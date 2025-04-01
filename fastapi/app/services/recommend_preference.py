from sqlmodel import Session
from app.db.models.wine import Wine
from app.schemas.recommendDto import RecommendByPreferenceDto, RecommendationResponse
from sqlalchemy import text

def recommend_by_preference(data: RecommendByPreferenceDto, session: Session) -> RecommendationResponse:

    print("🚀 recommend_by_preference 호출됨")
    # 1. 사용자 벡터 생성 (numerical features + type one-hot encoding)
    user_vector = [
        data.acidity / 5,  
        data.alcoholContent / 100,
        data.body / 5,
        data.sweetness / 5,
        data.tannin / 5,
        int(data.red),
        int(data.white), 
        int(data.sparkling), 
        int(data.rose)
    ]
    print("🚀 사용자 벡터:", user_vector)


    # 2. PostgreSQL에서 와인 벡터 조회
    query = text("""
        SELECT wine_id, feature_vector <=> CAST(:user_vector AS vector) as cos
        FROM preference_wine_vectors
        WHERE wine_id NOT IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
        ORDER BY cos DESC
        LIMIT 3
    """)
    
    result = session.execute(
        query, 
        {"user_vector": user_vector}
    )

    recommended_ids = [row[0] for row in result]
    print("🚀 추천 와인 ID 목록:", recommended_ids)

    return RecommendationResponse(recommended_wine_ids=recommended_ids)



