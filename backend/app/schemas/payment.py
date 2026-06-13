from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class PaymentBase(BaseModel):
    invoice_id: int
    amount: float = Field(..., gt=0)
    payment_method: Optional[str] = None
    transaction_id: Optional[str] = None
    payment_date: datetime
    notes: Optional[str] = None

class PaymentCreate(PaymentBase):
    pass

class PaymentResponse(PaymentBase):
    id: int
    status: str
    created_at: datetime
    invoice: Optional[dict] = None
    
    class Config:
        from_attributes = True