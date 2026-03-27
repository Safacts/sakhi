import httpx
import os
import logging
from typing import Optional

class ContextService:
    def __init__(self, base_url: str = "https://jnwn.xyz"):
        self.base_url = os.environ.get("AACHARYA_BASE_URL", base_url)

    async def fetch_academic_context(self, token: str) -> Optional[str]:
        """Fetch student profile and dashboard data to build RAG context."""
        headers = {"Authorization": f"Bearer {token}"}
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                # 1. Fetch Profile
                profile_res = await client.get(f"{self.base_url}/aacharya/api/v1/user/profile/", headers=headers)
                if profile_res.status_code != 200:
                    return None
                profile = profile_res.json()
                
                # 2. Fetch Dashboard (Attendance/Schedule)
                dashboard_url = ""
                if profile.get("role") == "student":
                    dashboard_url = f"{self.base_url}/aacharya/api/v1/student/dashboard/"
                elif profile.get("role") == "faculty":
                    dashboard_url = f"{self.base_url}/aacharya/api/v1/faculty/dashboard/"
                
                if not dashboard_url:
                    return f"User Profile: {profile.get('full_name')} ({profile.get('role')})"

                dash_res = await client.get(dashboard_url, headers=headers)
                if dash_res.status_code != 200:
                    return f"User Profile: {profile.get('full_name')} ({profile.get('role')})"
                
                dash_data = dash_res.json()
                
                # 3. Format into a compact string for the LLM
                context = f"User: {profile.get('full_name')} (Role: {profile.get('role')})\n"
                
                if profile.get("role") == "student":
                    context += f"Branch: {dash_data.get('branch_name', 'N/A')}\n"
                    context += "Current Attendance Summary:\n"
                    attendance = dash_data.get("attendance_summary", [])
                    for sub in attendance:
                        context += f"- {sub.get('subject_name')}: {sub.get('attendance_percentage')}% ({sub.get('attended_hours')}/{sub.get('total_hours')} hrs)\n"
                
                return context

            except Exception as e:
                logging.error(f"Failed to fetch academic context: {e}")
                return None

context_service = ContextService()
