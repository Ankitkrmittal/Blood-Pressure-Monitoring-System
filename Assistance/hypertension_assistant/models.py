from dataclasses import dataclass, field
from typing import List, Optional, Literal, Dict


SentimentLabel = Literal["positive", "negative", "neutral"]


@dataclass
class UserMessage:
    user_id: str
    text: str
    systolic: Optional[int] = None
    diastolic: Optional[int] = None
    symptoms: List[str] = field(default_factory=list)


@dataclass
class SafetyAssessment:
    level: Literal["emergency", "caution", "routine"]
    reasons: List[str] = field(default_factory=list)


@dataclass
class OrchestratorContext:
    sentiment: SentimentLabel
    safety: SafetyAssessment
    knowledge_snippets: List[str] = field(default_factory=list)


@dataclass
class AssistantResponse:
    reply: str
    sentiment: SentimentLabel
    safety: SafetyAssessment
    extra: Dict[str, str] = field(default_factory=dict)
