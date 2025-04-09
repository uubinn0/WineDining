from sqlmodel import Session
from app.db.models.wine import Wine
from app.schemas.recommendDto import RecommendByPreferenceDto, RecommendationResponse
from sqlalchemy import text

def recommend_by_preference(data: RecommendByPreferenceDto, session: Session) -> RecommendationResponse:
    print("🚀 recommend_by_preference 호출됨")
    print("foodIds",   data.foodIds)


    # 0. 사용자 입력값 전처리
    # 당도 조정
    sweetness_init = [data.sweetness, data.sweetness+1]  # 데이터 불균형 조정용 sql 쿼리 변수
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
        data.sweetness / 6,
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
            SELECT wine_id, vector <=> CAST(:user_vector AS vector) AS cos
            FROM preference_wine_vectors
                     AND vector <-> CAST(:user_vector AS vector) >= 0.5
            WHERE wine_id IN (SELECT id
                              FROM wines
                              WHERE sweetness = ANY(:sweetness)
                                AND price <= 100000)
            ORDER BY cos DESC
            LIMIT 3
        """)
        params = {"user_vector": user_vector}

    else:
        print("🚀 음식 ID가 있음 → 음식과 매칭된 추천 수행")
        query = text("""                   
            SELECT wine_id, vector <=> CAST(:user_vector AS vector) AS similarity
            FROM preference_wine_vectors
            WHERE wine_id IN (SELECT id
                              FROM wines
                              WHERE id IN (SELECT DISTINCT wine_id
                                           FROM pairing_sets 
                                           WHERE food_id = ANY(:food_ids))
						      AND sweetness = ANY(:sweetness)
                              AND price <= 100000)
            AND vector <=> CAST(:user_vector AS vector) >= 0.5
            ORDER BY similarity DESC
            LIMIT 3;
        """)
        params = {
            "user_vector": user_vector,
            "food_ids": data.foodIds,  # PostgreSQL의 `ANY()` 함수가 리스트를 받도록 그대로 전달
            "sweetness": sweetness_init
        }

    # 쿼리 실행
    result = session.execute(query, params)

    # 3. 결과가 3개 미만인 경우 추가 쿼리 실행
    rows = list(result)
    print(len(rows))
    if len(rows) < 3:
        print("🚀 추천 결과가 3개 미만 → 추가 쿼리 실행")
        
        existing_ids = [row[0] for row in rows]
        
        # 추천 데이터가 있는 경우
        if existing_ids:
            additional_query = text("""
                SELECT wine_id, vector <=> CAST(:user_vector AS vector) AS cos
                FROM preference_wine_vectors 
                AND wine_id NOT IN (SELECT wine_id FROM unnest(:existing_ids) AS wine_id
                                    WHERE sweetness = ANY(:sweetness)
                                    AND price <= 100000)
                ORDER BY cos DESC
                LIMIT :needed_count
            """)
            additional_params = {
                "user_vector": user_vector,
                "existing_ids": existing_ids,
                "needed_count": 3 - len(rows),
                "sweetness": sweetness_init
            }
        else:
            # 추천 데이터가 하나도 없는 경우 
            additional_query = text("""
                SELECT wine_id, vector <=> CAST(:user_vector AS vector) AS cos
                FROM preference_wine_vectors 
                WHERE wine_id > 10
                ORDER BY cos DESC
                LIMIT :needed_count
            """)
            additional_params = {
                "user_vector": user_vector,
                "needed_count": 3 - len(rows)
            }
        
        additional_result = session.execute(additional_query, additional_params)
        rows.extend(additional_result)

    result = rows


    recommended_ids = [row[0] for row in result]
    print("🚀 추천 와인 ID 목록:", recommended_ids)

    return RecommendationResponse(recommended_wine_ids=recommended_ids)