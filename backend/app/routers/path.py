from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Unit, UserProgress

router = APIRouter(tags=["Learning Path"])

DEFAULT_USER_ID = 1


@router.get("/api/path")
def get_learning_path(db: Session = Depends(get_db)):
    """
    Returns units, skills and lesson progress.
    """

    units = db.query(Unit).order_by(Unit.order).all()

    completed_lessons = [
        progress.lesson_id
        for progress in db.query(UserProgress)
        .filter(UserProgress.user_id == DEFAULT_USER_ID)
        .all()
    ]

    path = []

    for unit in units:

        unit_data = {
            "id": unit.id,
            "title": unit.title,
            "skills": [],
        }

        for skill in unit.skills:

            skill_data = {
                "id": skill.id,
                "name": skill.name,
                "icon": skill.icon,
                "lessons": [],
            }

            for lesson in skill.lessons:

                skill_data["lessons"].append(
                    {
                        "id": lesson.id,
                        "order": lesson.order,
                        "completed": lesson.id in completed_lessons,
                    }
                )

            unit_data["skills"].append(skill_data)

        path.append(unit_data)

    return path