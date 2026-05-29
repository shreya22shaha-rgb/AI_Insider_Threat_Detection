from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from .database import Base

class EmployeeActivity(Base):
    __tablename__ = "employee_activity"

    id = Column(Integer, primary_key=True, index=True)
    employee_name = Column(String, nullable=False)
    activity_type = Column(String, nullable=False)
    risk_level = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)