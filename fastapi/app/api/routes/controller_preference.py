from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.db.session import get_session
from app.schemas.recommendDto import RecommendByPreferenceDto, RecommendationResponse
from app.services.recommend_preference import recommend_by_preference

router = APIRouter()

@router.post("/preference", response_model=RecommendationResponse)
def controller_preference(data: RecommendByPreferenceDto, session: Session = Depends(get_session)):
    print("🚀 controller_preference 호출됨")
    return recommend_by_preference(data, session)

print("✅ controller_preference 모듈 로딩됨")