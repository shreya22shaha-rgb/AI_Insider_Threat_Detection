from pydantic import BaseModel
from datetime import datetime

class EmployeeActivityCreate(BaseModel):
    employee_name: str
    activity_type: str
    risk_level: str

class EmployeeActivityResponse(BaseModel):
    id: int
    employee_name: str
    activity_type: str
    risk_level: str
    timestamp: datetime

    class Config:
        orm_mode = True