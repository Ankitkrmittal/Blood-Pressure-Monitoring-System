from dataclasses import dataclass, field


@dataclass
class LLMConfig:
    provider: str = "openai"
    model_name: str = "gpt-4o-mini"
    temperature: float = 0.3
    max_tokens: int = 512


@dataclass
class SentimentConfig:
    use_transformers: bool = True
    model_name: str = "distilbert-base-uncased-finetuned-sst-2-english"


@dataclass
class HypertensionConfig:
    emergency_systolic_threshold: int = 180
    emergency_diastolic_threshold: int = 120


@dataclass
class AppConfig:
    llm: LLMConfig = field(default_factory=LLMConfig)
    sentiment: SentimentConfig = field(default_factory=SentimentConfig)
    hypertension: HypertensionConfig = field(default_factory=HypertensionConfig)
    system_name: str = "Hypertension Assistant"
    system_version: str = "0.2.1"


def get_default_config() -> AppConfig:
    return AppConfig()