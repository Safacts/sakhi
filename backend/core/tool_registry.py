"""
Tool Registry for Sakhi Agentic AI
Defines all available tools with metadata, permissions, and parameters
"""

TOOL_REGISTRY = {
    # ==================== STUDENT TOOLS ====================
    "student": {
        "get_profile": {
            "name": "Get Profile",
            "description": "Get student profile information including name, roll number, branch, year, semester",
            "method": "GET",
            "endpoint": "/aacharya/api/v1/user/profile/",
            "params": [],
            "permission": "student"
        },
        "get_dashboard": {
            "name": "Get Dashboard",
            "description": "Get student dashboard with attendance summary, subjects, and grades",
            "method": "GET",
            "endpoint": "/aacharya/api/v1/student/dashboard/",
            "params": [],
            "permission": "student"
        },
        "get_attendance": {
            "name": "Get Attendance",
            "description": "Get detailed attendance record for all subjects",
            "method": "GET",
            "endpoint": "/aacharya/api/v1/student/dashboard/",
            "params": [],
            "permission": "student"
        },
        "get_subjects": {
            "name": "Get Subjects",
            "description": "Get list of current semester subjects with faculty info",
            "method": "GET",
            "endpoint": "/aacharya/api/v1/student/dashboard/",
            "params": [],
            "permission": "student"
        },
        "get_forms": {
            "name": "Get Forms",
            "description": "Get targeted forms assigned to the student",
            "method": "GET",
            "endpoint": "/aacharya/api/v1/student/forms/",
            "params": [],
            "permission": "student"
        },
        "submit_form": {
            "name": "Submit Form",
            "description": "Submit a form response",
            "method": "POST",
            "endpoint": "/aacharya/api/v1/public/forms/{form_id}/submit/",
            "params": ["form_id", "responses"],
            "permission": "student"
        },
        "get_notifications": {
            "name": "Get Notifications",
            "description": "Get inbox notifications for the student",
            "method": "GET",
            "endpoint": "/aacharya/api/v1/notifications/inbox/",
            "params": [],
            "permission": "student"
        },
        "respond_notification": {
            "name": "Respond to Notification",
            "description": "Respond to a notification",
            "method": "POST",
            "endpoint": "/aacharya/api/v1/notifications/{notification_id}/respond/",
            "params": ["notification_id", "response"],
            "permission": "student"
        },
        "mark_notification_read": {
            "name": "Mark Notification as Read",
            "description": "Mark notifications as read",
            "method": "POST",
            "endpoint": "/aacharya/api/v1/notifications/read/",
            "params": ["notification_ids"],
            "permission": "student"
        },
        "get_portfolio": {
            "name": "Get Portfolio",
            "description": "Get public student portfolio",
            "method": "GET",
            "endpoint": "/aacharya/api/v1/public-data/{subdomain}/portfolio/{roll_no}/",
            "params": ["subdomain", "roll_no"],
            "permission": "student"
        },
    },
    
    # ==================== FACULTY TOOLS ====================
    "faculty": {
        "get_dashboard": {
            "name": "Get Dashboard",
            "description": "Get faculty dashboard with assigned subjects and stats",
            "method": "GET",
            "endpoint": "/aacharya/api/v1/faculty/dashboard/",
            "params": [],
            "permission": "faculty"
        },
        "get_subjects": {
            "name": "Get Assigned Subjects",
            "description": "Get list of subjects assigned to the faculty",
            "method": "GET",
            "endpoint": "/aacharya/api/faculty/subjects/",
            "params": [],
            "permission": "faculty"
        },
        "get_class_roster": {
            "name": "Get Class Roster",
            "description": "Get roster of students for a specific subject",
            "method": "GET",
            "endpoint": "/aacharya/api/class/{subject_id}/roster/",
            "params": ["subject_id"],
            "permission": "faculty"
        },
        "submit_attendance": {
            "name": "Submit Attendance",
            "description": "Submit attendance for a class session",
            "method": "POST",
            "endpoint": "/aacharya/api/class/{subject_id}/attendance/",
            "params": ["subject_id", "attendance_data"],
            "permission": "faculty"
        },
        "generate_workbook": {
            "name": "Generate Workbook",
            "description": "Generate attendance workbook for a branch/year/sem",
            "method": "GET",
            "endpoint": "/aacharya/api/v1/workbook/generate/",
            "params": ["branch", "year", "sem"],
            "permission": "faculty"
        },
        "get_report_filters": {
            "name": "Get Report Filters",
            "description": "Get available filter options for reports",
            "method": "GET",
            "endpoint": "/aacharya/api/v1/report-filters/",
            "params": [],
            "permission": "faculty"
        },
        "send_notification": {
            "name": "Send Notification",
            "description": "Send notification to students or faculty",
            "method": "POST",
            "endpoint": "/aacharya/api/v1/notifications/send/",
            "params": ["recipients", "message", "type"],
            "permission": "faculty"
        },
        "get_marks_roster": {
            "name": "Get Marks Roster",
            "description": "Get marks roster for a subject",
            "method": "GET",
            "endpoint": "/aacharya/api/v1/marks/roster/",
            "params": ["subject_id"],
            "permission": "faculty"
        },
        "save_marks": {
            "name": "Save Marks",
            "description": "Bulk save marks for students",
            "method": "POST",
            "endpoint": "/aacharya/api/v1/marks/bulk-save/",
            "params": ["subject_id", "marks_data"],
            "permission": "faculty"
        },
        "approve_marks": {
            "name": "Approve Marks",
            "description": "Approve submitted marks",
            "method": "POST",
            "endpoint": "/aacharya/api/v1/marks/approve-bulk/",
            "params": ["marks_ids"],
            "permission": "faculty"
        },
        "get_marks_delegations": {
            "name": "Get Marks Delegations",
            "description": "Get marks delegation requests",
            "method": "GET",
            "endpoint": "/aacharya/api/v1/marks/delegations/",
            "params": [],
            "permission": "faculty"
        },
    },
    
    # ==================== COLLEGE ADMIN TOOLS ====================
    "college_admin": {
        "get_dashboard_stats": {
            "name": "Get Dashboard Stats",
            "description": "Get college-wide dashboard statistics",
            "method": "GET",
            "endpoint": "/aacharya/api/v1/college-admin/dashboard-stats/",
            "params": [],
            "permission": "college_admin"
        },
        "get_students": {
            "name": "Get Students List",
            "description": "Get list of all students in the college",
            "method": "GET",
            "endpoint": "/aacharya/api/v1/manage/students/",
            "params": [],
            "permission": "college_admin"
        },
        "get_faculty": {
            "name": "Get Faculty List",
            "description": "Get list of all faculty in the college",
            "method": "GET",
            "endpoint": "/aacharya/api/v1/manage/faculty/",
            "params": [],
            "permission": "college_admin"
        },
        "get_faculty_subjects": {
            "name": "Get Faculty Subjects",
            "description": "Get subjects assigned to a specific faculty",
            "method": "GET",
            "endpoint": "/aacharya/api/v1/manage/faculty/{faculty_id}/subjects/",
            "params": ["faculty_id"],
            "permission": "college_admin"
        },
        "get_subjects": {
            "name": "Get Available Subjects",
            "description": "Get all available subjects in the college",
            "method": "GET",
            "endpoint": "/aacharya/api/v1/manage/subjects/",
            "params": [],
            "permission": "college_admin"
        },
        "get_attendance_ledger": {
            "name": "Get Attendance Ledger",
            "description": "Get attendance ledger for the college",
            "method": "GET",
            "endpoint": "/aacharya/api/v1/manage/ledger/",
            "params": [],
            "permission": "college_admin"
        },
        "get_analytics": {
            "name": "Get System Analytics",
            "description": "Get system-wide analytics and statistics",
            "method": "GET",
            "endpoint": "/aacharya/api/v1/manage/analytics/",
            "params": [],
            "permission": "college_admin"
        },
        "get_settings": {
            "name": "Get College Settings",
            "description": "Get college configuration settings",
            "method": "GET",
            "endpoint": "/aacharya/api/v1/manage/settings/",
            "params": [],
            "permission": "college_admin"
        },
        "get_forms": {
            "name": "Get Forms",
            "description": "Get all forms in the college",
            "method": "GET",
            "endpoint": "/aacharya/api/v1/manage/forms/",
            "params": [],
            "permission": "college_admin"
        },
        "get_gallery": {
            "name": "Get Gallery Events",
            "description": "Get gallery events for the college",
            "method": "GET",
            "endpoint": "/aacharya/api/v1/college-admin/{subdomain}/gallery/",
            "params": ["subdomain"],
            "permission": "college_admin"
        },
        "parse_syllabus": {
            "name": "Parse Syllabus",
            "description": "Parse syllabus text into structured format",
            "method": "POST",
            "endpoint": "/aacharya/api/v1/syllabus/parse-text/",
            "params": ["syllabus_text"],
            "permission": "college_admin"
        },
        "save_syllabus": {
            "name": "Save Syllabus Tree",
            "description": "Save syllabus tree structure",
            "method": "POST",
            "endpoint": "/aacharya/api/v1/syllabus/save-tree/",
            "params": ["syllabus_tree"],
            "permission": "college_admin"
        },
    },
    
    # ==================== SUPER ADMIN TOOLS ====================
    "superuser": {
        "get_platform_analytics": {
            "name": "Get Platform Analytics",
            "description": "Get platform-wide analytics across all colleges",
            "method": "GET",
            "endpoint": "/aacharya/api/v1/super-admin/analytics/",
            "params": [],
            "permission": "superuser"
        },
        "get_college_data": {
            "name": "Get College Data",
            "description": "Get public data for any college",
            "method": "GET",
            "endpoint": "/aacharya/api/v1/public-data/{subdomain}/",
            "params": ["subdomain"],
            "permission": "superuser"
        },
        "get_college_students": {
            "name": "Get College Students",
            "description": "Get student list for any college",
            "method": "GET",
            "endpoint": "/aacharya/api/v1/public-data/{subdomain}/students/",
            "params": ["subdomain"],
            "permission": "superuser"
        },
        "get_college_faculty": {
            "name": "Get College Faculty",
            "description": "Get faculty list for any college",
            "method": "GET",
            "endpoint": "/aacharya/api/v1/public-data/{subdomain}/faculty/",
            "params": ["subdomain"],
            "permission": "superuser"
        },
        "search_platform": {
            "name": "Search Platform",
            "description": "Unified search across the platform",
            "method": "GET",
            "endpoint": "/aacharya/api/v1/public-data/{subdomain}/search/",
            "params": ["subdomain", "query"],
            "permission": "superuser"
        },
    },
}

def get_tool_for_role(role: str, tool_name: str):
    """Get tool definition for a specific role"""
    if role not in TOOL_REGISTRY:
        return None
    return TOOL_REGISTRY[role].get(tool_name)

def get_all_tools_for_role(role: str):
    """Get all tools available for a specific role"""
    return TOOL_REGISTRY.get(role, {})

def get_tool_description(role: str, tool_name: str):
    """Get tool description for LLM prompting"""
    tool = get_tool_for_role(role, tool_name)
    if tool:
        return f"{tool['name']}: {tool['description']}. Parameters: {', '.join(tool['params'])}"
    return None

def get_tools_prompt(role: str):
    """Generate a prompt string listing all available tools for a role"""
    tools = get_all_tools_for_role(role)
    if not tools:
        return "No tools available for this role."
    
    prompt = f"Available tools for {role}:\n"
    for tool_name, tool_def in tools.items():
        prompt += f"- {tool_name}: {tool_def['description']}\n"
        if tool_def['params']:
            prompt += f"  Parameters: {', '.join(tool_def['params'])}\n"
    return prompt
