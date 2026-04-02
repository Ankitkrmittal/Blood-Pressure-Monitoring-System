from typing import Optional

from .config import AppConfig, get_default_config
from .models import UserMessage, AssistantResponse, OrchestratorContext
from .agents import SentimentAgent, TriageAgent, EducationAgent, LLMAgent


class HypertensionOrchestrator:
    """High-level orchestrator for the agentic hypertension assistant."""

    def __init__(self, config: Optional[AppConfig] = None) -> None:
        self.config = config or get_default_config()

        self.sentiment_agent = SentimentAgent(self.config.sentiment)
        self.triage_agent = TriageAgent(self.config.hypertension)
        self.education_agent = EducationAgent()
        self.llm_agent = LLMAgent(self.config.llm)

    def handle_message(self, msg: UserMessage) -> AssistantResponse:
        """Main pipeline: sentiment → safety → education → LLM."""
        sentiment = self.sentiment_agent.analyze(msg.text)

        safety = self.triage_agent.assess(
            systolic=msg.systolic,
            diastolic=msg.diastolic,
            symptoms=msg.symptoms,
        )

        knowledge_snippets = self.education_agent.get_snippets_for_query(msg.text)

        context = OrchestratorContext(
            sentiment=sentiment,
            safety=safety,
            knowledge_snippets=knowledge_snippets,
        )

        reply_text = self.llm_agent.generate_reply(
            user_text=msg.text,
            sentiment=context.sentiment,
            safety=context.safety,
            knowledge_snippets=context.knowledge_snippets,
        )

        return AssistantResponse(
            reply=reply_text,
            sentiment=sentiment,
            safety=safety,
            extra={},
        )