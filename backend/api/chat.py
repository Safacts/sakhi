from fastapi import APIRouter, HTTPException, Header
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from core.ollama import ollama_client
from core.router import scout_router
from core.context import context_service
from core.tools import agentic_tools
import json
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/chat", tags=["chat"])

class ChatRequest(BaseModel):
    message: str
    history: list = []
    token: str = None

class ToolCallRequest(BaseModel):
    tool_name: str
    params: dict = {}
    token: str

@router.post("/ask")
async def ask(request: ChatRequest):
    """Route request and inject academic context if needed."""
    intent = await scout_router.route_request(request.message)
    
    selected_model = scout_router.BRAIN_MODEL
    academic_context = ""
    user_role = "student"  # Default
    
    # Fetch user role if token provided
    if request.token:
        try:
            from api.auth import settings
            import httpx
            async with httpx.AsyncClient(timeout=5.0) as client:
                headers = {"Authorization": f"Bearer {request.token}"}
                profile_url = f"{settings.AACHARYA_BASE_URL}/aacharya/api/v1/user/profile/"
                response = await client.get(profile_url, headers=headers)
                if response.status_code == 200:
                    profile = response.json()
                    user_role = profile.get("role", "student")
                    logger.info(f"User role: {user_role}")
        except Exception as e:
            logger.warning(f"Could not fetch user role: {e}")
    
    if intent == "ACADEMIC" and request.token:
        academic_context = await context_service.fetch_academic_context(request.token)
        selected_model = scout_router.BRAIN_MODEL
    elif intent != "ACADEMIC":
        selected_model = intent
    
    # Role-specific system prompt
    role_prompts = {
        "student": "You are Sakhi, a helpful AI assistant for Aacharya College students. You can help with attendance queries, subject information, and general academic guidance.",
        "faculty": "You are Sakhi, an agentic AI assistant for Aacharya College faculty. You can generate workbooks, fortnight reports, and help with administrative tasks. When a user asks for a report, you should identify the tool needed and parameters.",
        "college_admin": "You are Sakhi, an administrative AI assistant for Aacharya College admins. You can provide college-wide statistics, attendance reports, and help with management decisions.",
        "superuser": "You are Sakhi, a platform-wide AI assistant for Aacharya super admins. You have access to all platform data and analytics."
    }
    
    system_prompt = role_prompts.get(user_role, role_prompts["student"])
    
    # Add tool availability info for faculty/admin
    if user_role in ["faculty", "college_admin", "superuser"]:
        system_prompt += "\n\nAVAILABLE TOOLS:\n"
        if user_role == "faculty":
            system_prompt += "- generate_workbook: Generate attendance workbook for a branch/year/sem\n"
            system_prompt += "- generate_fortnight_report: Generate fortnight attendance report\n"
        elif user_role == "college_admin":
            system_prompt += "- get_college_stats: Get college-wide statistics\n"
            system_prompt += "- get_attendance_thresholds: Get students below 75%/65% attendance\n"
            system_prompt += "- get_faculty_attendance_status: Check faculty submission status\n"
        elif user_role == "superuser":
            system_prompt += "- get_platform_stats: Get platform-wide statistics\n"
        system_prompt += "\nWhen you need to use a tool, output in this format: TOOL_CALL: {\"tool_name\": \"...\", \"params\": {...}}"
    
    if academic_context:
        system_prompt += f"\n\nCURRENT USER CONTEXT:\n{academic_context}\nUse this data to answer personalized questions accurately."
    
    messages = [{"role": "system", "content": system_prompt}]
    for h in request.history:
        messages.append({"role": h["role"], "content": h["content"]})
    messages.append({"role": "user", "content": request.message})
    
    async def stream_generator():
        yield json.dumps({"type": "info", "model": selected_model, "rag_active": bool(academic_context), "role": user_role}) + "\n"
        
        full_response = ""
        async for chunk in ollama_client.chat_stream(selected_model, messages):
            full_response += chunk
            yield json.dumps({"type": "content", "text": chunk}) + "\n"
        
        # Check for tool call in response
        if "TOOL_CALL:" in full_response:
            try:
                tool_start = full_response.find("TOOL_CALL:") + len("TOOL_CALL:")
                tool_json = full_response[tool_start:].strip()
                tool_data = json.loads(tool_json)
                
                # Execute the tool
                tool_result = await agentic_tools.execute_tool(
                    tool_data["tool_name"],
                    tool_data.get("params", {}),
                    request.token,
                    user_role
                )
                
                yield json.dumps({"type": "tool_result", "result": tool_result}) + "\n"
            except Exception as e:
                logger.error(f"Tool execution error: {e}")
                yield json.dumps({"type": "error", "message": f"Tool execution failed: {str(e)}"}) + "\n"
            
    return StreamingResponse(stream_generator(), media_type="application/x-ndjson")

@router.post("/tool")
async def execute_tool(request: ToolCallRequest, authorization: str = Header(...)):
    """Direct tool execution endpoint"""
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    token = authorization.replace("Bearer ", "")
    
    # Get user role
    user_role = "student"
    try:
        from api.auth import settings
        async with httpx.AsyncClient(timeout=5.0) as client:
            headers = {"Authorization": f"Bearer {token}"}
            profile_url = f"{settings.AACHARYA_BASE_URL}/aacharya/api/v1/user/profile/"
            response = await client.get(profile_url, headers=headers)
            if response.status_code == 200:
                profile = response.json()
                user_role = profile.get("role", "student")
    except Exception as e:
        logger.warning(f"Could not fetch user role: {e}")
    
    result = await agentic_tools.execute_tool(
        request.tool_name,
        request.params,
        token,
        user_role
    )
    
    return result
