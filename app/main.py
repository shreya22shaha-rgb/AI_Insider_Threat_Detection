from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes import router
from .prediction_routes import router as prediction_router
from .user_models import User
from .audit_models import AuditLog
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi import HTTPException
import logging
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s"
)

logger = logging.getLogger(__name__)

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Insider Threat Detection System")
logger.info("AI Insider Threat Detection System started successfully.")
logger = logging.getLogger(__name__)
# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError
):

    logger.warning(
        f"Validation Error: {request.url.path}"
    )

    errors = []

    for error in exc.errors():

        field = ".".join(
            str(loc)
            for loc in error["loc"]
            if loc != "body"
        )

        errors.append(
            {
                "field": field,
                "message": error["msg"]
            }
        )

    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Validation Failed",
            "errors": errors
        }
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(
    request: Request,
    exc: HTTPException
):

    logger.warning(
        f"HTTP Exception: {exc.detail}"
    )

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail
        }
    )

@app.exception_handler(Exception)
async def global_exception_handler(
    request: Request,
    exc: Exception
):

    logger.exception(
        f"Unhandled Exception: {str(exc)}"
    )

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal Server Error"
        }
    )


# Existing Routes
app.include_router(router)

# AI Prediction Routes
app.include_router(prediction_router)

@app.on_event("startup")
async def startup_event():
    logger.info("AI Insider Threat Detection System started successfully.")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Application shutdown successfully.")