from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from app.schemas.invoice import InvoiceCreate, InvoiceUpdate, InvoiceResponse
from app.models.invoice import Invoice, InvoiceItem
from app.models.user import User
from app.database import get_db
from app.utils.auth import get_current_user
from app.services.pdf_generator import generate_invoice_pdf
from app.utils.helpers import generate_invoice_number
import os

router = APIRouter()

@router.get("/", response_model=List[InvoiceResponse])
def get_invoices(
    status: Optional[str] = Query(None),
    customer_id: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Invoice).filter(Invoice.user_id == current_user.id)
    
    if status:
        query = query.filter(Invoice.status == status)
    if customer_id:
        query = query.filter(Invoice.customer_id == customer_id)
    if search:
        query = query.filter(Invoice.invoice_number.like(f"%{search}%"))
    
    offset = (page - 1) * limit
    return query.order_by(Invoice.created_at.desc()).offset(offset).limit(limit).all()

@router.post("/", response_model=InvoiceResponse, status_code=201)
def create_invoice(
    invoice: InvoiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    invoice_data = invoice.dict(exclude={"items"})
    invoice_data["user_id"] = current_user.id
    
    db_invoice = Invoice(**invoice_data)
    db.add(db_invoice)
    db.flush()
    
    for item in invoice.items:
        db_item = InvoiceItem(**item.dict(), invoice_id=db_invoice.id)
        db.add(db_item)
    
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

@router.get("/{invoice_id}", response_model=InvoiceResponse)
def get_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id,
        Invoice.user_id == current_user.id
    ).first()
    
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice

@router.put("/{invoice_id}", response_model=InvoiceResponse)
def update_invoice(
    invoice_id: int,
    invoice_data: InvoiceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id,
        Invoice.user_id == current_user.id
    ).first()
    
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    update_data = invoice_data.dict(exclude={"items"}, exclude_unset=True)
    for key, value in update_data.items():
        setattr(invoice, key, value)
    
    if invoice_data.items:
        db.query(InvoiceItem).filter(InvoiceItem.invoice_id == invoice_id).delete()
        for item in invoice_data.items:
            db_item = InvoiceItem(**item.dict(), invoice_id=invoice_id)
            db.add(db_item)
    
    db.commit()
    db.refresh(invoice)
    return invoice

@router.delete("/{invoice_id}")
def delete_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id,
        Invoice.user_id == current_user.id
    ).first()
    
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    db.delete(invoice)
    db.commit()
    return {"message": "Invoice deleted successfully"}

@router.get("/{invoice_id}/pdf")
def download_invoice_pdf(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id,
        Invoice.user_id == current_user.id
    ).first()
    
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    pdf_path = generate_invoice_pdf(invoice, current_user)
    
    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=f"invoice-{invoice.invoice_number}.pdf"
    )

@router.post("/{invoice_id}/duplicate", response_model=InvoiceResponse)
def duplicate_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    original = db.query(Invoice).filter(
        Invoice.id == invoice_id,
        Invoice.user_id == current_user.id
    ).first()
    
    if not original:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    new_invoice = Invoice(
        user_id=current_user.id,
        customer_id=original.customer_id,
        invoice_number=generate_invoice_number(),
        issue_date=datetime.utcnow(),
        due_date=original.due_date,
        status="draft",
        notes=original.notes,
        terms=original.terms,
        tax_rate=original.tax_rate,
        subtotal=original.subtotal,
        tax_amount=original.tax_amount,
        total=original.total
    )
    db.add(new_invoice)
    db.flush()
    
    for item in original.items:
        db_item = InvoiceItem(
            invoice_id=new_invoice.id,
            description=item.description,
            quantity=item.quantity,
            unit_price=item.unit_price,
            total=item.total
        )
        db.add(db_item)
    
    db.commit()
    db.refresh(new_invoice)
    return new_invoice