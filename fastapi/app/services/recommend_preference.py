from sqlmodel import Session, select
from app.db.models.wine import Wine
from app.schemas.recommendDto import RecommendByPreferenceDto, RecommendationResponse

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from datetime import datetime


def recommend_by_preference(data: RecommendByPreferenceDto, session: Session) -> RecommendationResponse:

    print("🚀 recommend_by_preference 호출됨")
     # 1. 사용자 벡터
    user_vector = np.array([[
        data.alcoholContent,
        data.sweetness,
        data.acidity,
        data.tannin,
        data.body,
        int(data.red), int(data.white), int(data.sparkling),
        int(data.rose), int(data.fortified), int(data.etc)
    ]])
    print("🚀 사용자 벡터:", user_vector)

    # 2. 전체 와인 조회
    wines = session.exec(select(Wine)).all()

    if not wines:
        print("🚀 와인 데이터가 없습니다. dummy_wines를 사용합니다.")
        wines = [
            Wine(
                id=1,
                kr_name="테스트 와인1",
                en_name="Test Wine 1",
                image=None,
                country="TestCountry",
                grape="TestGrape",
                price=15000,
                sweetness=5,
                acidity=5,
                tannin=5,
                body=5,
                alcohol_content=13,
                created_at=datetime.now(),
                type_id=1,
                wine_group_id=1,
                year="2020"
            ),
            Wine(
                id=2,
                krName="테스트 와인2",
                en_name="Test Wine 2",
                image=None,
                country="TestCountry",
                grape="TestGrape",
                price=18000,
                sweetness=3,
                acidity=4,
                tannin=3,
                body=4,
                alcohol_content=12,
                created_at=datetime.now(),
                type_id=2,
                wine_group_id=1,
                year="2019"
            )
        ]


    wine_vectors = []
    wine_ids = []

    wine_type_map = {
        1: [1, 0, 0, 0, 0, 0],
        2: [0, 1, 0, 0, 0, 0],
        3: [0, 0, 1, 0, 0, 0],
        4: [0, 0, 0, 1, 0, 0],
        5: [0, 0, 0, 0, 1, 0],
        6: [0, 0, 0, 0, 0, 1],
    }
    for wine in wines:
        type_vector = wine_type_map.get(wine.type_id, [0, 0, 0, 0, 0, 0])
        feature_vector = [
            wine.alcohol_content or 0,
            wine.sweetness or 0,
            wine.acidity or 0,
            wine.tannin or 0,
            wine.body or 0
        ] + type_vector

        wine_vectors.append(feature_vector)
        wine_ids.append(wine.id)
    
    print("🚀 와인 벡터 수:", len(wine_vectors))

    # 3. 코사인 유사도 계산
    similarities = cosine_similarity(user_vector, np.array(wine_vectors))[0]
    top_indices = np.argsort(similarities)[::-1][:5]
    top_ids = [wine_ids[i] for i in top_indices]

    print("🚀 추천 와인 ID 목록:", top_ids)

    return RecommendationResponse(recommended_wine_ids=top_ids)


