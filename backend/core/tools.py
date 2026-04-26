"""
Agentic Tools Module for Sakhi
Role-specific tools that the AI can call based on user permissions
Uses tool_registry for tool definitions
"""
import httpx
import logging
from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta
import json
from .tool_registry import TOOL_REGISTRY, get_tool_for_role

logger = logging.getLogger(__name__)

class AgenticTools:
    """Tool executor for role-specific agentic capabilities"""
    
    def __init__(self, aacharya_base_url: str = "https://jnwn.xyz"):
        self.base_url = aacharya_base_url
    
    async def execute_tool(
        self, 
        tool_name: str, 
        params: Dict[str, Any], 
        token: str,
        user_role: str
    ) -> Dict[str, Any]:
        """
        Execute a tool based on user role and permissions
        Uses the tool registry to find the tool definition
        """
        headers = {"Authorization": f"Bearer {token}"}
        
        # Get tool definition from registry
        tool_def = get_tool_for_role(user_role, tool_name)
        if not tool_def:
            return {"error": f"Tool '{tool_name}' not found for role '{user_role}'"}
        
        # Build endpoint URL with path parameters
        endpoint = tool_def["endpoint"]
        for param in tool_def["params"]:
            if param in params:
                endpoint = endpoint.replace(f"{{{param}}}", str(params[param]))
        
        # Execute the API call
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                if tool_def["method"] == "GET":
                    response = await client.get(
                        f"{self.base_url}{endpoint}",
                        headers=headers,
                        params={k: v for k, v in params.items() if k not in tool_def["params"]}
                    )
                elif tool_def["method"] == "POST":
                    response = await client.post(
                        f"{self.base_url}{endpoint}",
                        headers=headers,
                        json={k: v for k, v in params.items() if k not in tool_def["params"]}
                    )
                else:
                    return {"error": f"Unsupported method: {tool_def['method']}"}
                
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "success": True,
                        "data": data,
                        "tool_name": tool_name
                    }
                else:
                    return {
                        "error": f"API error: {response.status_code}",
                        "detail": response.text
                    }
        except httpx.TimeoutException:
            return {"error": "Request timeout"}
        except Exception as e:
            logger.error(f"Error executing tool {tool_name}: {e}")
            return {"error": str(e)}

# Singleton instance
agentic_tools = AgenticTools()
