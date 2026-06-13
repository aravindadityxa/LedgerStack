from sqlalchemy.orm import Session
from app.models.invoice import Invoice, InvoiceItem, InvoiceStatus
from datetime import datetime, timedelta

def check_overdue_invoices(db: Session, user_id: int):
    today = datetime.utcnow()
    overdue_invoices = db.query(Invoice).filter(
        Invoice.user_id == user_id,
        Invoice.status == InvoiceStatus.PENDING,
        Invoice.due_date < today
    ).all()
    
    for invoice in overdue_invoices:
        invoice.status = InvoiceStatus.OVERDUE
    
    db.commit()
    return len(overdue_invoices)

def calculate_invoice_totals(invoice: Invoice):
    subtotal = sum(item.total for item in invoice.items)
    tax_amount = subtotal * (invoice.tax_rate / 100)
    total = subtotal + tax_amount - (invoice.discount or 0)
    
    invoice.subtotal = subtotal
    invoice.tax_amount = tax_amount
    invoice.total = total
    invoice.balance_due = total - (invoice.amount_paid or 0)
    
    return invoice