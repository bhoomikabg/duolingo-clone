from pydantic import BaseModel


class CompleteLessonSchema(BaseModel):
    xp_earned: int
    hearts_remaining: int