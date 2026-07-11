import json

from .database import SessionLocal
from .models import User, Unit, Skill, Lesson, Exercise


def seed_database():
    """
    Seeds the database with sample data.

    This function runs only once. If users already exist,
    the database is assumed to be seeded.
    """

    db = SessionLocal()

    if db.query(User).first():
        db.close()
        return

    try:
        # ==================================================
        # Sample Users
        # ==================================================

        users = [
            User(id=1, name="Duo Learner", streak=3, xp=120, hearts=5, gems=450),
            User(id=2, name="Alex", streak=10, xp=910, hearts=5, gems=720),
            User(id=3, name="Emma", streak=8, xp=640, hearts=4, gems=610),
            User(id=4, name="Liam", streak=5, xp=500, hearts=5, gems=550),
            User(id=5, name="Sophia", streak=12, xp=1120, hearts=5, gems=980),
        ]

        db.add_all(users)

        # ==================================================
        # Units
        # ==================================================

        unit1 = Unit(
            id=1,
            title="Form Basic Sentences",
            order=1,
        )

        unit2 = Unit(
            id=2,
            title="Everyday Conversations",
            order=2,
        )

        db.add_all([unit1, unit2])

        # ==================================================
        # Skills
        # ==================================================

        skills = [
            Skill(id=1, unit_id=1, name="Basics", icon="☕", order=1),
            Skill(id=2, unit_id=1, name="Greetings", icon="👋", order=2),
            Skill(id=3, unit_id=1, name="Food", icon="🍎", order=3),
            Skill(id=4, unit_id=1, name="Travel", icon="✈️", order=4),
            Skill(id=5, unit_id=2, name="Home", icon="🏠", order=1),
            Skill(id=6, unit_id=2, name="Shopping", icon="🛒", order=2),
            Skill(id=7, unit_id=2, name="Family", icon="👨‍👩‍👧", order=3),
        ]

        db.add_all(skills)

        # ==================================================
        # Lessons
        # ==================================================

        lessons = [
            Lesson(id=1, skill_id=1, order=1),
            Lesson(id=2, skill_id=1, order=2),
            Lesson(id=3, skill_id=2, order=1),
            Lesson(id=4, skill_id=3, order=1),
            Lesson(id=5, skill_id=4, order=1),
        ]

        db.add_all(lessons)

        # ==================================================
        # Exercises
        # ==================================================

        exercises = [

            Exercise(
                lesson_id=1,
                type="MULTIPLE_CHOICE",
                question='Select the correct translation for "The milk"',
                correct_answer="La leche",
                choices_json=json.dumps([
                    "El gato",
                    "La leche",
                    "El agua",
                    "El niño",
                ]),
            ),

            Exercise(
                lesson_id=1,
                type="TRANSLATE",
                question="Translate: 'Un niño'",
                correct_answer="A boy",
                choices_json=json.dumps([
                    "A",
                    "girl",
                    "boy",
                    "man",
                    "apple",
                ]),
            ),

            Exercise(
                lesson_id=1,
                type="FILL_IN_BLANK",
                question="El hombre y la ______ (woman)",
                correct_answer="mujer",
                choices_json=json.dumps([
                    "mujer",
                    "niño",
                    "leche",
                ]),
            ),

            Exercise(
                lesson_id=1,
                type="MULTIPLE_CHOICE",
                question='Choose the Spanish word for "Apple"',
                correct_answer="Manzana",
                choices_json=json.dumps([
                    "Leche",
                    "Agua",
                    "Manzana",
                    "Pan",
                ]),
            ),

            Exercise(
                lesson_id=1,
                type="TRANSLATE",
                question="Translate: 'Buenos días'",
                correct_answer="Good morning",
                choices_json=json.dumps([
                    "Good",
                    "morning",
                    "night",
                    "hello",
                    "bye",
                ]),
            ),
        ]

        db.add_all(exercises)

        db.commit()

        print("Database seeded successfully!")

    except Exception as e:
        db.rollback()
        print(f"Database seeding failed: {e}")

    finally:
        db.close()