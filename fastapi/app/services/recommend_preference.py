from sqlmodel import Session
from app.db.models.wine import Wine
from app.schemas.recommendDto import RecommendByPreferenceDto, RecommendationResponse
from sqlalchemy import text

def recommend_by_preference(data: RecommendByPreferenceDto, session: Session) -> RecommendationResponse:
    print("🚀 recommend_by_preference 호출됨")

    # 0. 사용자 입력값 전처리
    # 산도
    if data.acidity == 1:
        data.acidity = 0.5
    elif data.acidity == 2:
        data.acidity = 2.5
    elif data.acidity == 3:
        data.acidity = 4.5

    # 바디감
    if data.body == 1:
        data.body = 0.5
    elif data.body == 2:
        data.body = 2.5
    elif data.body == 3:
        data.body = 4.5

    # 타닌
    if data.tannin == 1:
        data.tannin = 1
    elif data.tannin == 2:
        data.tannin = 4

    # 1. 사용자 벡터 생성 (numerical features + type one-hot encoding)
    user_vector = [
        data.acidity / 5,  
        data.alcoholContent / 100,
        data.body / 5,
        (data.sweetness + 1) / 5,   # 당도는 단계가1부터 시작
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



