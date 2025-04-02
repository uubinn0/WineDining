from sqlmodel import Session
from app.db.models.wine import Wine
from app.schemas.recommendDto import RecommendByPreferenceDto, RecommendationResponse
from sqlalchemy import text

def recommend_by_preference(data: RecommendByPreferenceDto, session: Session) -> RecommendationResponse:
    print("🚀 recommend_by_preference 호출됨")


    # 0. 사용자 입력값 전처리
    # 당도 조정
    sweetness_map = {1: 1, 2: 3, 3: 5}
    data.sweetness = sweetness_map.get(data.sweetness, data.sweetness)

    # 산도 조정
    acidity_map = {1: 0.5, 2: 2.5, 3: 4.5}
    data.acidity = acidity_map.get(data.acidity, data.acidity)

    # 바디감 조정
    body_map = {1: 0.5, 2: 2.5, 3: 4.5}
    data.body = body_map.get(data.body, data.body)

    # 타닌 조정
    tannin_map = {1: 1, 2: 4}
    data.tannin = tannin_map.get(data.tannin, data.tannin)

    # 와인 도수 조정
    alcohol_map = {1: 9, 2: 13, 3: 15}
    data.alcoholContent = alcohol_map.get(data.alcoholContent, data.alcoholContent)

    # 1. 사용자 벡터 생성 (numerical features + type one-hot encoding)
    user_vector = [
        data.acidity / 6,  
        data.alcoholContent / 100,
        data.body / 6,
        data.sweetness / 5,   # 당도는 단계가1부터 시작
        data.tannin / 6,
        int(data.red),
        int(data.white), 
        int(data.sparkling), 
        int(data.rose)
    ]
    print("🚀 사용자 벡터:", user_vector)


   # 2. PostgreSQL에서 와인 벡터 조회 
    if not data.foodIds:
        print("🚀 음식 ID가 없음 → 기본 추천 수행")
        query = text("""
            SELECT wine_id, feature_vector <=> CAST(:user_vector AS vector) AS cos
            FROM preference_wine_vectors
            WHERE wine_id > 10
            ORDER BY cos DESC
            LIMIT 3
        """)
        params = {"user_vector": user_vector}

    else:
        print("🚀 음식 ID가 있음 → 음식과 매칭된 추천 수행")
        query = text("""
            WITH SIM_TBL AS (
                SELECT 
                    wine_id, 
                    feature_vector <=> CAST(:user_vector AS vector) AS cos
                FROM preference_wine_vectors
                WHERE wine_id NOT BETWEEN 1 AND 10
                ORDER BY cos DESC
            )
            SELECT S.WINE_ID, P.FOOD_ID
            FROM SIM_TBL S
            INNER JOIN PAIRING_SETS P ON S.WINE_ID = P.WINE_ID
            WHERE P.FOOD_ID = ANY(:food_ids)
            ORDER BY S.cos DESC, P.FOOD_ID ASC
            LIMIT 3;
        """)
        params = {
            "user_vector": user_vector,
            "food_ids": data.foodIds  # PostgreSQL의 `ANY()` 함수가 리스트를 받도록 그대로 전달
        }

    # 3. 쿼리 실행
    result = session.execute(query, params)

    recommended_ids = [row[0] for row in result]
    print("🚀 추천 와인 ID 목록:", recommended_ids)

    return RecommendationResponse(recommended_wine_ids=recommended_ids)