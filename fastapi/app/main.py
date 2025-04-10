from fastapi import FastAPI
from contextlib import asynccontextmanager
from sqlmodel import SQLModel
from app.db.session import engine
from app.api.routers import router as api_router
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield

app = FastAPI(
    title="Wine Recommender API",
    lifespan=lifespan
)

app.include_router(api_router, prefix="/api/v1")
