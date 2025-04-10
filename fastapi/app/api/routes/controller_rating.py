from fastapi import APIRouter
from app.schemas.recommendDto import RecommendByRatingDto, RecommendationResponse
from app.services.recommend_rating import recommend_by_rating

router = APIRouter()

@router.post("/rating", response_model=RecommendationResponse)
def controller_rating(data: RecommendByRatingDto):
    return recommend_by_rating(data)

print("✅ controller_rating 모듈 로딩됨")