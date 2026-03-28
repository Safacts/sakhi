from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from core.ollama import ollama_client
from core.router import scout_router
from core.context import context_service
import json

router = APIRouter(prefix="/api/chat", tags=["chat"])

class ChatRequest(BaseModel):
    message: str
    history: list = []
    token: str = None

@router.post("/ask")
async def ask(request: ChatRequest):
    """Route request and inject academic context if needed."""
    intent = await scout_router.route_request(request.message)
    
    selected_model = scout_router.BRAIN_MODEL
    academic_context = ""
    
    if intent == "ACADEMIC" and request.token:
        academic_context = await context_service.fetch_academic_context(request.token)
        selected_model = scout_router.BRAIN_MODEL
    elif intent != "ACADEMIC":
        selected_model = intent
    
    system_prompt = "You are Sakhi, an intelligent AI assistant for Aacharya College students."
    if academic_context:
        system_prompt += f"\n\nCURRENT USER CONTEXT:\n{academic_context}\nUse this data to answer personalized questions accurately."
    
    messages = [{"role": "system", "content": system_prompt}]
    for h in request.history:
        messages.append({"role": h["role"], "content": h["content"]})
    messages.append({"role": "user", "content": request.message})
    
    async def stream_generator():
        yield json.dumps({"type": "info", "model": selected_model, "rag_active": bool(academic_context)}) + "\n"
        
        async for chunk in ollama_client.chat_stream(selected_model, messages):
            yield json.dumps({"type": "content", "text": chunk}) + "\n"
            
    return StreamingResponse(stream_generator(), media_type="application/x-ndjson")
