from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from .database import Base


class EmployeeActivity(Base):
    __tablename__ = "employee_activity"

    id = Column(Integer, primary_key=True, index=True)

    employee_name = Column(
        String,
        nullable=False,
        index=True
    )

    activity_type = Column(
        String,
        nullable=False,
        index=True
    )

    risk_level = Column(
        String,
        nullable=False,
        index=True
    )

    timestamp = Column(
        DateTime,
        default=datetime.utcnow,
        index=True
    )