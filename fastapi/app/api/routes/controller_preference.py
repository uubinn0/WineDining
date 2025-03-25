from fastapi import APIRouter
from app.schemas.recommendDto import RecommendByPreferenceDto, RecommendationResponse
from app.services.recommend_preference import recommend_by_preference

router = APIRouter()

@router.post("/preference", response_model=RecommendationResponse)
def controller_preference(data: RecommendByPreferenceDto):
    return recommend_by_preference(data)

print("✅ controller_preference 모듈 로딩됨")