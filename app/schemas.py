from pydantic import BaseModel, Field, field_validator
from datetime import datetime


class EmployeeActivityCreate(BaseModel):
    employee_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Employee Name"
    )

    activity_type: str = Field(
        ...,
        min_length=3,
        max_length=100,
        description="Activity Type"
    )

    @field_validator("employee_name")
    @classmethod
    def validate_employee_name(cls, value):
        value = value.strip()

        if not value:
            raise ValueError("Employee name cannot be empty.")

        return value

    @field_validator("activity_type")
    @classmethod
    def validate_activity_type(cls, value):
        value = value.strip()

        if not value:
            raise ValueError("Activity type cannot be empty.")

        return value

class EmployeeActivityResponse(BaseModel):
    id: int
    employee_name: str
    activity_type: str
    risk_level: str
    timestamp: datetime

    class Config:
        orm_mode = True