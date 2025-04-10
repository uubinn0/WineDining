from sqlmodel import Session
from app.db.models.wine import Wine
from app.schemas.recommendDto import RecommendByPreferenceDto, RecommendationResponse
from app.services.recommend_rating import recommend_by_rating
from sqlalchemy import text

def recommend_by_preference(data: RecommendByPreferenceDto, session: Session) -> RecommendationResponse:
    print("🚀 recommend_by_preference 호출됨")
    print("user_id", data.userId)
    print("foodIds",   data.foodIds)

    no_data = 0 # 위시리스트 또는 

    # 0. 사용자 입력값 전처리
    # 당도 조정
    sweetness_init = [data.sweetness-1, data.sweetness, data.sweetness+1]  # 데이터 불균형 조정용 sql 쿼리 변수
    sweetness_map = {1: 1, 2: 3, 3: 5}
    data.sweetness = sweetness_map.get(data.sweetness, data.sweetness)

    # 산도 조정
    acidity_init = [data.acidity-1, data.acidity, data.acidity+1]
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

    # 사용자 벡터 생성 (numerical features + type one-hot encoding)
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


   # 1. 취향 데이터 기반 추천
   # PostgreSQL에서 와인 벡터 조회 
    if not data.foodIds:
        print("🚀 음식 ID가 없음 → 기본 추천 수행")
        query = text("""
            SELECT wine_id, vector <=> CAST(:user_vector AS vector) AS cos
            FROM preference_wine_vectors
            WHERE wine_id IN (SELECT id
                              FROM wines
                              WHERE sweetness = ANY(:sweetness)
                              AND price <= 100000)
            AND vector <-> CAST(:user_vector AS vector) >= 0.5
            ORDER BY cos DESC
            LIMIT 3
        """)
        params = {
            "user_vector": user_vector,
            "sweetness": sweetness_init
        }

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

    # 결과가 3개 미만인 경우 추가 쿼리 실행
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
                WHERE wine_id IN (SELECT id FROM wines
                                    WHERE sweetness = ANY(:sweetness)
                                    AND price <= 100000)
                ORDER BY cos DESC
                LIMIT :needed_count
            """)
            additional_params = {
                "user_vector": user_vector,
                "needed_count": 3 - len(rows),
                "sweetness": sweetness_init
            }
        
        additional_result = session.execute(additional_query, additional_params)
        rows.extend(additional_result)

    result = rows

    # 2. 위시리스트 추천
    # 위시리스트 데이터 조회 및 벡터화
    wish_query = text("""
            SELECT 
                AVG(acidity) as acidity_avg,
                AVG(alcohol_content) as alcohol_avg,
                AVG(body) as body_avg,
                AVG(sweetness) as sweetness_avg,
                AVG(tannin) as tannin_avg,
                FLOOR(AVG(type_id)) as avg_type
            FROM wines
            WHERE id IN (SELECT wine_id FROM wish_items WHERE user_id = :user_id)
    """)
    wish_params = {
        "user_id": data.userId
    }
    wish_result = session.execute(wish_query, wish_params)
    wish_rows = list(wish_result)

    # 위시리스트 데이터가 있는 경우 벡터화
    if wish_rows and wish_rows[0]:
        row = wish_rows[0]
        # 기본 특성 벡터화
        wish_vector = [
            row.acidity_avg / 6 if row.acidity_avg is not None else 0,
            row.alcohol_avg / 100 if row.alcohol_avg is not None else 0,
            row.body_avg / 6 if row.body_avg is not None else 0,
            row.sweetness_avg / 6 if row.sweetness_avg is not None else 0,
            row.tannin_avg / 6 if row.tannin_avg is not None else 0
        ]
        
        # type_id 원핫 인코딩 (1: Red, 2: White, 3: Sparkling, 4: Rose)
        type_one_hot = [0] * 4
        if row.avg_type:
            type_idx = int(row.avg_type) - 1  # 1-based to 0-based index
            if 0 <= type_idx < 4:
                type_one_hot[type_idx] = 1
                
        # 최종 벡터 (기본 특성 + 원핫 인코딩)
        wish_vector.extend(type_one_hot)

        print("🚀 위시리스트 벡터:", wish_vector)
        # 위시리스트 벡터와 preference_wine_vectors 테이블의 벡터 비교
        wish_vector_query = text("""
            SELECT wine_id, vector <=> CAST(:wish_vector AS vector) AS cos
            FROM preference_wine_vectors
            WHERE wine_id IN (SELECT id 
                            FROM wines
                            WHERE price <= 100000)
            ORDER BY cos DESC
            LIMIT 1
        """)

        wish_vector_params = {
            "wish_vector" : wish_vector,
            "user_id": data.userId
        }

        wish_vector_result = session.execute(wish_vector_query, wish_vector_params)
        wish_result = list(wish_vector_result)
    else:
        # 위시리스트가 비어있는 경우 체크
        no_data += 1 
        
    
    # 3. 사용자의 최근 높은 평점 와인 조회
    recent_rating_query = text("""
        SELECT w.id, w.acidity, w.alcohol_content, w.body, w.sweetness, w.tannin, w.type_id, w.wine_group_id
        FROM wines w
        WHERE w.id IN (
            SELECT b.wine_id
            FROM wine_notes wn
            INNER JOIN bottles b ON b.id = wn.bottle_id
            WHERE b.wine_id IS NOT NULL
                AND b.user_id = :user_id
            ORDER BY rating DESC, created_at DESC
            LIMIT 1
        )
    """)

    rating_params = {
        "user_id": data.userId
    }

    rating_result = session.execute(recent_rating_query, rating_params)
    rating_row = rating_result.fetchone()

    # 평점 데이터가 있는 경우
    if rating_row:
        # 평점 데이터 벡터화
        rating_vector = [
            rating_row.acidity / 6 if rating_row.acidity is not None else 0,
            rating_row.alcohol_content / 100 if rating_row.alcohol_content is not None else 0,
            rating_row.body / 6 if rating_row.body is not None else 0,
            rating_row.sweetness / 6 if rating_row.sweetness is not None else 0,
            rating_row.tannin / 6 if rating_row.tannin is not None else 0
        ]

        # type_id 원핫 인코딩
        type_one_hot = [0] * 4
        if rating_row.type_id:
            type_idx = rating_row.type_id - 1
            if 0 <= type_idx < 4:
                type_one_hot[type_idx] = 1

        rating_vector.extend(type_one_hot)

        # 동일한 wine_group_id를 가진 와인들 중 코사인 유사도 계산
        rating_vector_query = text("""
            SELECT wine_id, vector <=> CAST(:rating_vector AS vector) AS cos
            FROM preference_wine_vectors
            WHERE wine_id IN (
                SELECT id 
                FROM wines 
                WHERE wine_group_id = :wine_group_id
                AND id != :wine_id
                AND price <= 100000
            )
            ORDER BY cos DESC
            LIMIT 1
        """)

        rating_vector_params = {
            "rating_vector": rating_vector,
            "wine_group_id": rating_row.wine_group_id,
            "wine_id": rating_row.id
        }

        rating_vector_result = session.execute(rating_vector_query, rating_vector_params)
        rating_result = list(rating_vector_result)
    else:
        no_data += 1

    
    # 위시리스트나 평점 데이터가 없는 경우 체크
    if not no_data:
        print("🚀 위시리스트나 평점 데이터가 있음 → 각 추천 1개 반환")
        print(rows)
        combined_results = rows + wish_result + rating_result
        recommended_ids = [row[0] for row in combined_results]
        print("🚀 추천 와인 ID 목록:", recommended_ids)
    else:
        print("🚀 위시리스트나 평점 데이터가 없음 → 취향 추천 3개 반환")
        combined_results = rows
        recommended_ids = [row[0] for row in combined_results]
        print("🚀 추천 와인 ID 목록:", recommended_ids)

    return RecommendationResponse(recommended_wine_ids=recommended_ids)