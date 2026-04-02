from typing import Optional, List
import os

from openai import OpenAI

from ..config import LLMConfig
from ..safety_policies import HYPO_ASSISTANT_SYSTEM_PROMPT
from ..models import SentimentLabel, SafetyAssessment


class LLMAgent:
    """Wraps the language model that generates final replies."""

    def __init__(self, config: Optional[LLMConfig] = None) -> None:
        self.config = config or LLMConfig()
        api_key = os.environ.get("OPENAI_API_KEY")
        self.client = OpenAI(api_key=api_key) if api_key else None

    def generate_reply(
        self,
        user_text: str,
        sentiment: SentimentLabel,
        safety: SafetyAssessment,
        knowledge_snippets: List[str],
    ) -> str:
        kb_text = "\n".join(f"- {s}" for s in knowledge_snippets)

        sentiment_line = ""
        if sentiment == "negative":
            sentiment_line = (
                "The user seems worried or distressed. Respond with extra empathy, "
                "normalize their feelings, and be reassuring."
            )
        elif sentiment == "positive":
            sentiment_line = (
                "The user seems more positive. Encourage them to keep building healthy habits "
                "and acknowledge their progress."
            )
        else:
            sentiment_line = (
                "The user's tone appears neutral. Provide clear, structured, supportive information."
            )

        safety_line = (
            f"Safety assessment level: {safety.level}. Reasons: " + "; ".join(safety.reasons)
        )

        system_instructions = (
            HYPO_ASSISTANT_SYSTEM_PROMPT
            + "\n\n"
            + "Use this context when answering. Never contradict these rules."
        )

        context_block = f"""Context for you:
- {safety_line}
- Sentiment analysis: {sentiment_line}
- Educational snippets you can reuse or adapt:
{kb_text}
"""

        messages = [
            {"role": "system", "content": system_instructions},
            {"role": "developer", "content": context_block},
            {"role": "user", "content": user_text},
        ]

        try:
            if self.client is None:
                raise RuntimeError("OPENAI_API_KEY is not configured")
            completion = self.client.chat.completions.create(
                model=self.config.model_name,
                messages=messages,
                temperature=self.config.temperature,
                max_tokens=self.config.max_tokens,
            )
            return completion.choices[0].message.content.strip()
        except Exception:
            # Fallback baseline reply if API fails
            kb_text_plain = "\n".join(knowledge_snippets)
            return (
                "I'm having trouble contacting the language model right now, so I'll share general information instead.\n\n"
                + kb_text_plain
                + "\n\nRemember: if you have sudden severe symptoms or feel like something is very wrong, seek in-person emergency care immediately."
            )
