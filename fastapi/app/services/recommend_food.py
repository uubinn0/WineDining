# import pickle
# import numpy as np
# from app.schemas.recommendDto import RecommendByPreferenceDto, RecommendationResponse

# # 모델 로딩
# with open("app/ml/model.pkl", "rb") as f:
#     model = pickle.load(f)

# def recommend_by_food(data: RecommendByPreferenceDto) -> RecommendationResponse:
#     # 입력값을 벡터로 변환
#     feature = np.array([[
#         data.alcoholContent, data.sweetness, data.acidity,
#         data.tannin, data.body,
#         int(data.red), int(data.white), int(data.sparkling),
#         int(data.rose), int(data.fortified), int(data.etc)
#     ]])
#     pred = model.predict(feature)
#     return RecommendationResponse(recommended_wine_ids=pred.tolist())
