from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from sqlalchemy import Column
# from sqlalchemy.dialects.postgresql import VECTOR  # pgvector를 위한 타입
from pgvector.sqlalchemy import Vector  # pgvector에서 Vector 타입 가져오기


class Wine(SQLModel, table=True):
    __tablename__ = "wines"  # 명시적 선언 (옵션)

    id: int = Field(primary_key=True)
    kr_name: str
    en_name: str
    image: Optional[str] = None
    country: Optional[str] = None
    grape: Optional[str] = None

    price: Optional[int] = None

    sweetness: Optional[int] = None
    acidity: Optional[int] = None
    tannin: Optional[int] = None
    body: Optional[int] = None
    alcohol_content: Optional[int] = Field(default=None, alias="alcoholContent")

    created_at: datetime
    type_id: int
    wine_group_id: int
    year: Optional[str] = None


class WineVector(SQLModel, table=True):
    __tablename__ = "wine_vectors"  # 명시적 선언 (옵션)

    wine_id: int = Field(primary_key=True, foreign_key="wines.id")
    feature_vector: Optional[list[float]] = Field(
        # sa_column=Column(VECTOR)  # PostgreSQL vector 타입 지정
        sa_column=Column(Vector)  # PostgreSQL vector 타입 지정

    )
