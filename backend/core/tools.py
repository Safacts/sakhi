"""
Agentic Tools Module for Sakhi
Role-specific tools that the AI can call based on user permissions
"""
import httpx
import logging
from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta
import json

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
        """
        headers = {"Authorization": f"Bearer {token}"}
        
        # Role-based tool routing
        if user_role == "student":
            return await self._student_tools(tool_name, params, headers)
        elif user_role == "faculty":
            return await self._faculty_tools(tool_name, params, headers)
        elif user_role == "college_admin":
            return await self._admin_tools(tool_name, params, headers)
        elif user_role == "superuser":
            return await self._superadmin_tools(tool_name, params, headers)
        else:
            return {"error": f"Unknown role: {user_role}"}
    
    async def _student_tools(self, tool_name: str, params: Dict, headers: Dict) -> Dict:
        """Student-specific tools"""
        if tool_name == "get_attendance":
            return await self._get_student_attendance(headers)
        elif tool_name == "get_subjects":
            return await self._get_student_subjects(headers)
        elif tool_name == "get_profile":
            return await self._get_student_profile(headers)
        else:
            return {"error": f"Unknown student tool: {tool_name}"}
    
    async def _faculty_tools(self, tool_name: str, params: Dict, headers: Dict) -> Dict:
        """Faculty-specific tools"""
        if tool_name == "generate_workbook":
            return await self._generate_workbook(params, headers)
        elif tool_name == "generate_fortnight_report":
            return await self._generate_fortnight_report(params, headers)
        elif tool_name == "get_assigned_subjects":
            return await self._get_faculty_subjects(headers)
        else:
            return {"error": f"Unknown faculty tool: {tool_name}"}
    
    async def _admin_tools(self, tool_name: str, params: Dict, headers: Dict) -> Dict:
        """College admin-specific tools"""
        if tool_name == "get_college_stats":
            return await self._get_college_stats(headers)
        elif tool_name == "get_attendance_thresholds":
            return await self._get_attendance_thresholds(params, headers)
        elif tool_name == "get_faculty_attendance_status":
            return await self._get_faculty_attendance_status(headers)
        else:
            return {"error": f"Unknown admin tool: {tool_name}"}
    
    async def _superadmin_tools(self, tool_name: str, params: Dict, headers: Dict) -> Dict:
        """Super admin platform-wide tools"""
        if tool_name == "get_platform_stats":
            return await self._get_platform_stats(headers)
        else:
            return {"error": f"Unknown superadmin tool: {tool_name}"}
    
    # ==================== STUDENT TOOLS ====================
    
    async def _get_student_attendance(self, headers: Dict) -> Dict:
        """Get student's overall attendance percentage"""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{self.base_url}/aacharya/api/v1/student/dashboard/",
                    headers=headers
                )
                if response.status_code == 200:
                    data = response.json()
                    profile = data.get('profile', {})
                    subjects = data.get('subjects', [])
                    
                    return {
                        "success": True,
                        "overall_attendance": profile.get('overall_attendance', 0),
                        "subjects": [
                            {
                                "name": s.get('name'),
                                "attendance_percent": s.get('attendance_percent'),
                                "conducted_hours": s.get('conducted_hours'),
                                "attended_hours": s.get('attended_hours')
                            }
                            for s in subjects
                        ]
                    }
                return {"error": f"API error: {response.status_code}"}
        except Exception as e:
            logger.error(f"Error fetching attendance: {e}")
            return {"error": str(e)}
    
    async def _get_student_subjects(self, headers: Dict) -> Dict:
        """Get student's current semester subjects"""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{self.base_url}/aacharya/api/v1/student/dashboard/",
                    headers=headers
                )
                if response.status_code == 200:
                    data = response.json()
                    subjects = data.get('subjects', [])
                    profile = data.get('profile', {})
                    
                    return {
                        "success": True,
                        "semester": profile.get('sem'),
                        "year": profile.get('year'),
                        "branch": profile.get('branch_name'),
                        "subjects": [
                            {
                                "name": s.get('name'),
                                "code": s.get('code'),
                                "faculty": s.get('faculty')
                            }
                            for s in subjects
                        ]
                    }
                return {"error": f"API error: {response.status_code}"}
        except Exception as e:
            logger.error(f"Error fetching subjects: {e}")
            return {"error": str(e)}
    
    async def _get_student_profile(self, headers: Dict) -> Dict:
        """Get student profile information"""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{self.base_url}/aacharya/api/v1/user/profile/",
                    headers=headers
                )
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "success": True,
                        "profile": data
                    }
                return {"error": f"API error: {response.status_code}"}
        except Exception as e:
            logger.error(f"Error fetching profile: {e}")
            return {"error": str(e)}
    
    # ==================== FACULTY TOOLS ====================
    
    async def _generate_workbook(self, params: Dict, headers: Dict) -> Dict:
        """Generate workbook for faculty (calls JNWN API)"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.base_url}/aacharya/api/v1/generate-workbook/",
                    headers=headers,
                    json=params
                )
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "success": True,
                        "file_data": data.get('base64_data'),
                        "file_name": data.get('filename')
                    }
                return {"error": f"API error: {response.status_code}"}
        except Exception as e:
            logger.error(f"Error generating workbook: {e}")
            return {"error": str(e)}
    
    async def _generate_fortnight_report(self, params: Dict, headers: Dict) -> Dict:
        """Generate fortnight report for faculty"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.base_url}/aacharya/api/v1/generate-fortnight-report/",
                    headers=headers,
                    json=params
                )
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "success": True,
                        "file_data": data.get('base64_data'),
                        "file_name": data.get('filename')
                    }
                return {"error": f"API error: {response.status_code}"}
        except Exception as e:
            logger.error(f"Error generating fortnight report: {e}")
            return {"error": str(e)}
    
    async def _get_faculty_subjects(self, headers: Dict) -> Dict:
        """Get faculty's assigned subjects"""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{self.base_url}/aacharya/api/v1/faculty/dashboard/",
                    headers=headers
                )
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "success": True,
                        "subjects": data.get('assigned_subjects', [])
                    }
                return {"error": f"API error: {response.status_code}"}
        except Exception as e:
            logger.error(f"Error fetching faculty subjects: {e}")
            return {"error": str(e)}
    
    # ==================== ADMIN TOOLS ====================
    
    async def _get_college_stats(self, headers: Dict) -> Dict:
        """Get college-wide statistics"""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{self.base_url}/aacharya/api/v1/college-admin/dashboard/",
                    headers=headers
                )
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "success": True,
                        "stats": data
                    }
                return {"error": f"API error: {response.status_code}"}
        except Exception as e:
            logger.error(f"Error fetching college stats: {e}")
            return {"error": str(e)}
    
    async def _get_attendance_thresholds(self, params: Dict, headers: Dict) -> Dict:
        """Get students below attendance thresholds"""
        # This would need a specific API endpoint in JNWN
        # For now, return a placeholder
        return {
            "success": True,
            "below_75": 0,
            "below_65": 0,
            "message": "API endpoint to be implemented in JNWN"
        }
    
    async def _get_faculty_attendance_status(self, headers: Dict) -> Dict:
        """Get faculty attendance submission status"""
        # This would need a specific API endpoint in JNWN
        return {
            "success": True,
            "submitted_count": 0,
            "pending_count": 0,
            "message": "API endpoint to be implemented in JNWN"
        }
    
    # ==================== SUPERADMIN TOOLS ====================
    
    async def _get_platform_stats(self, headers: Dict) -> Dict:
        """Get platform-wide statistics"""
        # This would need a specific API endpoint in JNWN
        return {
            "success": True,
            "total_students": 0,
            "total_faculties": 0,
            "total_colleges": 0,
            "message": "API endpoint to be implemented in JNWN"
        }

# Singleton instance
agentic_tools = AgenticTools()
