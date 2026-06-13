from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class InvoiceStatusEnum(str, Enum):
    DRAFT = "draft"
    PENDING = "pending"
    PAID = "paid"
    OVERDUE = "overdue"
    CANCELLED = "cancelled"

class InvoiceItemBase(BaseModel):
    description: str
    quantity: int = Field(default=1, ge=1)
    unit_price: float = Field(default=0, ge=0)
    total: float = Field(default=0, ge=0)

class InvoiceItemCreate(InvoiceItemBase):
    pass

class InvoiceItemResponse(InvoiceItemBase):
    id: int
    invoice_id: int
    
    class Config:
        from_attributes = True

class InvoiceBase(BaseModel):
    customer_id: int
    invoice_number: str
    issue_date: datetime
    due_date: datetime
    status: InvoiceStatusEnum = InvoiceStatusEnum.DRAFT
    notes: Optional[str] = None
    terms: Optional[str] = None
    tax_rate: float = Field(default=0, ge=0, le=100)
    discount: float = Field(default=0, ge=0)
    subtotal: float = Field(default=0, ge=0)
    tax_amount: float = Field(default=0, ge=0)
    total: float = Field(default=0, ge=0)

class InvoiceCreate(InvoiceBase):
    items: List[InvoiceItemCreate]

class InvoiceUpdate(InvoiceBase):
    items: List[InvoiceItemCreate]

class InvoiceResponse(InvoiceBase):
    id: int
    user_id: int
    amount_paid: float
    balance_due: float
    created_at: datetime
    updated_at: datetime
    items: List[InvoiceItemResponse]
    customer: dict
    
    class Config:
        from_attributes = True