from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import Optional
from app.models.user import User
from app.models.invoice import Invoice, InvoiceStatus
from app.models.payment import Payment
from app.models.customer import Customer
from app.database import get_db
from app.utils.auth import get_current_user
from datetime import datetime
import csv
import io

router = APIRouter()

@router.get("/revenue")
def revenue_report(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    format: str = Query("json"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Payment).join(Invoice).filter(Invoice.user_id == current_user.id)
    
    if start_date:
        query = query.filter(Payment.payment_date >= datetime.fromisoformat(start_date))
    if end_date:
        query = query.filter(Payment.payment_date <= datetime.fromisoformat(end_date))
    
    payments = query.all()
    
    data = [
        {
            "id": p.id,
            "invoice_number": p.invoice.invoice_number,
            "customer": p.invoice.customer.name,
            "amount": p.amount,
            "method": p.payment_method,
            "date": p.payment_date.isoformat()
        }
        for p in payments
    ]
    
    if format == "csv":
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=["id", "invoice_number", "customer", "amount", "method", "date"])
        writer.writeheader()
        writer.writerows(data)
        output.seek(0)
        
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=revenue_report.csv"}
        )
    
    return {"data": data, "total": sum(p["amount"] for p in data)}