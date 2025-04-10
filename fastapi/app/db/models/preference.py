# from sqlmodel import SQLModel, Field
# from typing import Optional
# from datetime import datetime

# class Preferecne(SQLModel, table=True):
#     __tablename__ = "preferences"  # 명시적 선언 (옵션)

#     id: int = Field(primary_key=True)
#     krName: str
#     enName: str
#     image: Optional[str] = None
#     country: Optional[str] = None
#     grape: Optional[str] = None

#     price: Optional[int] = None

#     sweetness: Optional[int] = None
#     acidity: Optional[int] = None
#     tannin: Optional[int] = None
#     body: Optional[int] = None
#     alcoholContent: Optional[int] = Field(default=None, alias="alcoholContent")

#     createdAt: datetime
#     typeId: int
#     wineGroup_id: int
#     year: Optional[str] = None
