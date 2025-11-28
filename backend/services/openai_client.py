import logging
from typing import Dict, Any

from openai import OpenAI

from backend.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

client = OpenAI(api_key=settings.openai_api_key) if settings.openai_api_key else None


async def generate_chat_completion(messages: list[dict], response_format: Dict[str, Any] | None = None) -> dict:
    """
    Call OpenAI chat completion with optional JSON mode.
    """
    if client is None:
        raise RuntimeError("OpenAI API key is not configured")

    logger.info("Calling OpenAI chat completion")
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        response_format=response_format or {"type": "json_object"},
        temperature=0.2,
    )
    content = completion.choices[0].message.content
    return {"content": content, "raw": completion.model_dump()}
