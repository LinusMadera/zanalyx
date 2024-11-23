import asyncio
from contextlib import asynccontextmanager
import sys
from typing import Optional

import uvicorn
from config import SOFTWARE_NAME
from database import close_db, init_db
from fastapi import FastAPI
from routers import auth, protected, payment, whale_alert, crypto, llm
from utils.whale_alert import connect_whale_alert
from preload import check_environment

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize the database and start Whale Alert connection
    init_db()
    asyncio.create_task(connect_whale_alert())
    yield
    # Shutdown: close the database connection
    close_db()

app = FastAPI(
    lifespan=lifespan,
    title=f"{SOFTWARE_NAME} API",
    description=f"{SOFTWARE_NAME} backend API service",
    version="alpha",
    redoc_url="/redoc",
    docs_url="/swagger"
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(payment.router, prefix="/payment", tags=["Payment"])
app.include_router(protected.router, prefix="/test", tags=["Test (Restricted Routes)"])
app.include_router(whale_alert.router, prefix="/whale", tags=["Whale Alerts"])
app.include_router(crypto.router, prefix="/crypto", tags=["Crypto Data"])
app.include_router(llm.router, prefix="/llm", tags=["LLM"])

def main():
    # Run environment checks before starting the API
    if not check_environment():
        print("Failed to initialize required services. Exiting...")
        sys.exit(1)

    # Only start uvicorn if environment checks pass
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

if __name__ == "__main__":
    main()