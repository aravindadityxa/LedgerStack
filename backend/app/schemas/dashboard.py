from pydantic import BaseModel
from typing import List, Optional

class StatCard(BaseModel):
    label: str
    value: float
    change: float
    icon: str

class MonthlyRevenue(BaseModel):
    month: str
    revenue: float

class InvoiceStatusDistribution(BaseModel):
    name: str
    value: int
    color: str

class RecentInvoice(BaseModel):
    id: int
    invoice_number: str
    customer: str
    total: float
    status: str
    date: str

class DashboardResponse(BaseModel):
    total_revenue: float
    total_customers: int
    total_invoices: int
    paid_invoices: int
    pending_invoices: int
    monthly_revenue: List[MonthlyRevenue]
    invoice_status: List[InvoiceStatusDistribution]
    recent_invoices: List[RecentInvoice]
    recent_payments: List[dict]