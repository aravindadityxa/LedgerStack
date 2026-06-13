from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.schemas.service import ServiceCreate, ServiceUpdate, ServiceResponse
from app.models.service import Service
from app.models.user import User
from app.database import get_db
from app.utils.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[ServiceResponse])
def get_services(
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Service).filter(Service.user_id == current_user.id)
    
    if search:
        query = query.filter(Service.name.like(f"%{search}%"))
    
    return query.order_by(Service.created_at.desc()).all()

@router.post("/", response_model=ServiceResponse, status_code=201)
def create_service(
    service: ServiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_service = Service(**service.dict(), user_id=current_user.id)
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

@router.get("/{service_id}", response_model=ServiceResponse)
def get_service(
    service_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = db.query(Service).filter(
        Service.id == service_id,
        Service.user_id == current_user.id
    ).first()
    
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

@router.put("/{service_id}", response_model=ServiceResponse)
def update_service(
    service_id: int,
    service_data: ServiceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = db.query(Service).filter(
        Service.id == service_id,
        Service.user_id == current_user.id
    ).first()
    
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    for key, value in service_data.dict(exclude_unset=True).items():
        setattr(service, key, value)
    
    db.commit()
    db.refresh(service)
    return service

@router.delete("/{service_id}")
def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = db.query(Service).filter(
        Service.id == service_id,
        Service.user_id == current_user.id
    ).first()
    
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    db.delete(service)
    db.commit()
    return {"message": "Service deleted successfully"}