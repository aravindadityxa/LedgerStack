from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from app.models.user import User
from app.models.customer import Customer
from app.models.invoice import Invoice, InvoiceStatus
from app.models.payment import Payment
from app.database import get_db
from app.utils.auth import get_current_user
from datetime import datetime, timedelta
from typing import List, Dict

router = APIRouter()

@router.get("/")
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_id = current_user.id
    
    total_revenue = db.query(func.coalesce(func.sum(Payment.amount), 0)).join(Invoice).filter(
        Invoice.user_id == user_id,
        Payment.status == "completed"
    ).scalar()
    
    total_customers = db.query(func.count(Customer.id)).filter(
        Customer.user_id == user_id
    ).scalar()
    
    total_invoices = db.query(func.count(Invoice.id)).filter(
        Invoice.user_id == user_id
    ).scalar()
    
    paid_invoices = db.query(func.count(Invoice.id)).filter(
        Invoice.user_id == user_id,
        Invoice.status == InvoiceStatus.PAID
    ).scalar()
    
    pending_invoices = db.query(func.count(Invoice.id)).filter(
        Invoice.user_id == user_id,
        Invoice.status.in_([InvoiceStatus.PENDING, InvoiceStatus.OVERDUE])
    ).scalar()
    
    # Monthly revenue for last 6 months
    monthly_revenue = []
    for i in range(5, -1, -1):
        date = datetime.utcnow() - timedelta(days=30*i)
        month_start = date.replace(day=1, hour=0, minute=0, second=0)
        if i == 0:
            month_end = datetime.utcnow()
        else:
            next_month = month_start.replace(day=28) + timedelta(days=4)
            month_end = next_month - timedelta(days=next_month.day)
        
        revenue = db.query(func.coalesce(func.sum(Payment.amount), 0)).join(Invoice).filter(
            Invoice.user_id == user_id,
            Payment.payment_date >= month_start,
            Payment.payment_date <= month_end,
            Payment.status == "completed"
        ).scalar()
        
        monthly_revenue.append({
            "month": month_start.strftime("%b %Y"),
            "revenue": float(revenue)
        })
    
    # Invoice status distribution
    status_counts = db.query(
        Invoice.status,
        func.count(Invoice.id)
    ).filter(
        Invoice.user_id == user_id
    ).group_by(Invoice.status).all()
    
    color_map = {
        "paid": "#10B981",
        "pending": "#F59E0B",
        "overdue": "#EF4444",
        "draft": "#6B7280",
        "cancelled": "#9CA3AF"
    }
    
    invoice_status = [
        {"name": status.value, "value": count, "color": color_map.get(status.value, "#6B7280")}
        for status, count in status_counts
    ]
    
    # Recent invoices
    recent_invoices = db.query(Invoice).filter(
        Invoice.user_id == user_id
    ).order_by(Invoice.created_at.desc()).limit(5).all()
    
    recent_invoice_data = [
        {
            "id": inv.id,
            "invoice_number": inv.invoice_number,
            "customer": inv.customer.name if inv.customer else "N/A",
            "total": inv.total,
            "status": inv.status.value,
            "date": inv.created_at.strftime("%b %d, %Y")
        }
        for inv in recent_invoices
    ]
    
    # Recent payments
    recent_payments = db.query(Payment).join(Invoice).filter(
        Invoice.user_id == user_id
    ).order_by(Payment.payment_date.desc()).limit(5).all()
    
    recent_payment_data = [
        {
            "id": pay.id,
            "invoice_number": pay.invoice.invoice_number if pay.invoice else "N/A",
            "customer": pay.invoice.customer.name if pay.invoice and pay.invoice.customer else "N/A",
            "amount": pay.amount,
            "method": pay.payment_method or "N/A",
            "date": pay.payment_date.strftime("%b %d, %Y")
        }
        for pay in recent_payments
    ]
    
    return {
        "total_revenue": float(total_revenue),
        "total_customers": total_customers,
        "total_invoices": total_invoices,
        "paid_invoices": paid_invoices,
        "pending_invoices": pending_invoices,
        "monthly_revenue": monthly_revenue,
        "invoice_status": invoice_status,
        "recent_invoices": recent_invoice_data,
        "recent_payments": recent_payment_data
    }