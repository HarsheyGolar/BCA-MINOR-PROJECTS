from pydantic import BaseModel, Field
from typing import Optional

class ChatRequest(BaseModel):
    user_id: str = Field(
        ...,
        description="User prompt or query",
        json_schema_extra={"examples": ["Harshey_001"]}
    )
    message: str = Field(
        ...,
        description="User prompt or query",
        json_schema_extra={"examples": ["Summarize our last meeting."]}
    )

class ChatResponse(BaseModel):
    user_id: str
    response: str
    context_retrieved: Optional[list[str]] = Field(default=[], description="Retrieved Vector memories.")
