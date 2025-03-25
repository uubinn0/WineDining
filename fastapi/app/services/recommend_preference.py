import pickle
from sqlmodel import Session, select
from app.schemas.recommendDto import RecommendByPreferenceDto, RecommendationResponse


def recommend_by_preference(data: RecommendByPreferenceDto) -> RecommendationResponse:
    return RecommendationResponse(recommended_wine_ids=[1, 2, 3])


