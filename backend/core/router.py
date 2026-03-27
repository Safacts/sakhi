from core.ollama import ollama_client
import logging

class ScoutRouter:
    LIGHT_MODEL = "llama3.2:3b"
    BRAIN_MODEL = "llama3:8b"

    CLASSIFICATION_SYSTEM = """
    Identify if the user request is 'LIGHT', 'HEAVY', or 'ACADEMIC'.
    LIGHT: Greetings, simple formatting, casual talk.
    HEAVY: Complex general analysis, technical troubleshooting, general reasoning.
    ACADEMIC: Questions about attendance, grades, schedules, courses, or "my" status in the college.
    Reply with ONLY one word: LIGHT, HEAVY, or ACADEMIC.
    """

    @classmethod
    async def route_request(cls, user_message: str) -> str:
        try:
            decision = await ollama_client.generate(
                model=cls.LIGHT_MODEL,
                prompt=user_message,
                system=cls.CLASSIFICATION_SYSTEM
            )
            decision = decision.strip().upper()
            if "ACADEMIC" in decision:
                return "ACADEMIC"
            if "HEAVY" in decision:
                return cls.BRAIN_MODEL
            return cls.LIGHT_MODEL
        except Exception as e:
            logging.error(f"Scout routing failed: {e}")
            return cls.BRAIN_MODEL

scout_router = ScoutRouter()
