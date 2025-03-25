from fastapi import APIRouter
from app.api.routes import controller_food, controller_rating, controller_preference

router = APIRouter()
router.include_router(controller_rating.router, prefix="/recommend", tags=["Rating Recommend"])
router.include_router(controller_preference.router, prefix="/recommend", tags=["Preference Recommend"])
# router.include_router(controller_food.router, prefix="/recommend", tags=["Food Pairing"])
