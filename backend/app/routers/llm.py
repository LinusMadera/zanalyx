from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import httpx
from pydantic import BaseModel
from typing import List, Dict

router = APIRouter()

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

@router.post("/ai/chat")
async def chat(request: ChatRequest):
    try:
        async def generate():
            async with httpx.AsyncClient() as client:
                # Make request to local Ollama instance
                async with client.stream(
                    'POST',
                    'http://localhost:11434/api/chat',
                    json={
                        "model": "zanalyx",
                        "messages": [
                            {"role": msg.role, "content": msg.content}
                            for msg in request.messages
                        ]
                    },
                    timeout=None
                ) as response:
                    async for line in response.aiter_lines():
                        if line:  # Skip empty lines
                            yield line + '\n'

        return StreamingResponse(
            generate(),
            media_type='text/event-stream'
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error communicating with LLM: {str(e)}")