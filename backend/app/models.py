from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="Learner")
    streak = Column(Integer, default=0)
    xp = Column(Integer, default=0)
    hearts = Column(Integer, default=5)
    gems = Column(Integer, default=500)


class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    order = Column(Integer)

    skills = relationship("Skill", back_populates="unit")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id"))
    name = Column(String)
    icon = Column(String)
    order = Column(Integer)

    unit = relationship("Unit", back_populates="skills")
    lessons = relationship("Lesson", back_populates="skill")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"))
    order = Column(Integer)

    skill = relationship("Skill", back_populates="lessons")
    exercises = relationship("Exercise", back_populates="lesson")


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    type = Column(String)
    question = Column(String)
    correct_answer = Column(String)
    choices_json = Column(Text)

    lesson = relationship("Lesson", back_populates="exercises")


class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    completed_at = Column(DateTime, default=datetime.utcnow)