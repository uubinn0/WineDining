from pydantic import BaseModel, Field
from typing import List

class RecommendByPreferenceDto(BaseModel):
    userId: int
    alcoholContent: int = Field(default=0)
    sweetness: int = Field(default=0)
    acidity: int = Field(default=0)
    tannin: int = Field(default=0)
    body: int = Field(default=0)
    red: bool = False
    white: bool = False
    sparkling: bool = False
    rose: bool = False
    fortified: bool = False
    etc: bool = False

class RecommendByRatingDto(BaseModel):
    userId: int

class RecommendationResponse(BaseModel):
    recommended_wine_ids: List[int]
