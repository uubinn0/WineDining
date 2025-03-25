import pickle
from sqlmodel import Session, select
from app.schemas.recommendDto import RecommendByRatingDto, RecommendationResponse

def recommend_by_rating(data: RecommendByRatingDto) -> RecommendationResponse:


    # (임시) 전체에서 상위 3개만 추천
    top_ids = [1, 2, 3]
    return RecommendationResponse(recommended_wine_ids=top_ids)
