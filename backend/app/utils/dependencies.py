from fastapi import Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User

def get_current_user(db: Session = Depends(get_db)):
    # Temporary implementation
    user = db.query(User).first()
    return user