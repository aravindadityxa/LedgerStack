from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ServiceBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    price: float = Field(..., ge=0)
    category: Optional[str] = None

class ServiceCreate(ServiceBase):
    pass

class ServiceUpdate(ServiceBase):
    pass

class ServiceResponse(ServiceBase):
    id: int
    user_id: int
    is_active: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True