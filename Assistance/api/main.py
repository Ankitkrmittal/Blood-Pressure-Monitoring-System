import os
from pathlib import Path
from typing import Optional, List

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import APIKeyHeader
from pydantic import BaseModel, Field
from dotenv import load_dotenv

from hypertension_assistant import HypertensionOrchestrator
from hypertension_assistant.models import UserMessage, SafetyAssessment

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

API_KEY_HEADER_NAME = "X-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_HEADER_NAME, auto_error=False)


def get_api_key(api_key: Optional[str] = Depends(api_key_header)) -> str:
    """Simple API key authentication using env var APP_API_KEY."""
    expected = os.environ.get("APP_API_KEY")
    if expected is None:
        # In development, warn instead of blocking if key not set
        return "dev-no-auth"

    if api_key is None or api_key != expected:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key",
        )
    return api_key


class ChatRequest(BaseModel):
    user_id: str
    message: str
    systolic: Optional[int] = None
    diastolic: Optional[int] = None
    symptoms: List[str] = Field(default_factory=list)


class ChatResponse(BaseModel):
    reply: str
    sentiment: str
    safety_level: str
    safety_reasons: List[str]


app = FastAPI(title="Hypertension Assistant API", version="0.2.1")
_orchestrator = HypertensionOrchestrator()


@app.get("/health")
async def health() -> dict:
    return {"status": "ok", "service": "hypertension-assistant"}


@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(payload: ChatRequest, api_key: str = Depends(get_api_key)) -> ChatResponse:
    _ = api_key

    msg = UserMessage(
        user_id=payload.user_id,
        text=payload.message,
        systolic=payload.systolic,
        diastolic=payload.diastolic,
        symptoms=payload.symptoms,
    )

    resp = _orchestrator.handle_message(msg)

    return ChatResponse(
        reply=resp.reply,
        sentiment=resp.sentiment,
        safety_level=resp.safety.level,
        safety_reasons=resp.safety.reasons,
    )
