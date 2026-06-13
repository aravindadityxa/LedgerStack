from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.schemas.payment import PaymentCreate, PaymentResponse
from app.models.payment import Payment
from app.models.invoice import Invoice, InvoiceStatus
from app.models.user import User
from app.database import get_db
from app.utils.auth import get_current_user
from datetime import datetime

router = APIRouter()

@router.get("/", response_model=List[PaymentResponse])
def get_payments(
    invoice_id: Optional[int] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Payment).join(Invoice).filter(Invoice.user_id == current_user.id)
    
    if invoice_id:
        query = query.filter(Payment.invoice_id == invoice_id)
    
    offset = (page - 1) * limit
    return query.order_by(Payment.payment_date.desc()).offset(offset).limit(limit).all()

@router.post("/", response_model=PaymentResponse, status_code=201)
def create_payment(
    payment: PaymentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    invoice = db.query(Invoice).filter(
        Invoice.id == payment.invoice_id,
        Invoice.user_id == current_user.id
    ).first()
    
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    db_payment = Payment(**payment.dict())
    db.add(db_payment)
    
    invoice.amount_paid = (invoice.amount_paid or 0) + payment.amount
    invoice.balance_due = invoice.total - invoice.amount_paid
    
    if invoice.balance_due <= 0:
        invoice.status = InvoiceStatus.PAID
    else:
        invoice.status = InvoiceStatus.PENDING
    
    db.commit()
    db.refresh(db_payment)
    return db_payment