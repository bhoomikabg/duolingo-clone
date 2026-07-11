from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User

router = APIRouter(tags=["Leaderboard"])


@router.get("/api/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    users = (
        db.query(User)
        .order_by(User.xp.desc())
        .all()
    )

    return [
        {
            "rank": index + 1,
            "id": user.id,
            "name": user.name,
            "xp": user.xp,
            "streak": user.streak,
        }
        for index, user in enumerate(users)
    ]