from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import RedirectResponse
import httpx
import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    AACHARYA_CLIENT_ID: str = "SAKHI_CLIENT"
    AACHARYA_CLIENT_SECRET: str = "SAKHI_SECRET_CHANGE_ME_123"
    AACHARYA_BASE_URL: str = "https://jnwn.xyz"
    FRONTEND_URL: str = "http://localhost:3001"
    
    class Config:
        env_file = ".env"

settings = Settings()
router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.get("/login")
async def login():
    """Redirect user to Aacharya Authorize page."""
    auth_url = (
        f"{settings.AACHARYA_BASE_URL}/o/authorize/"
        f"?response_type=code"
        f"&client_id={settings.AACHARYA_CLIENT_ID}"
        f"&redirect_uri={settings.AACHARYA_BASE_URL}/api/auth/callback" # This is a placeholder
    )
    # Wait, the redirect_uri must match EXACTLY what's in the DB.
    # We registered: http://localhost:8000/api/auth/callback 
    
    redirect_uri = "http://localhost:8000/api/auth/callback"
    auth_url = (
        f"{settings.AACHARYA_BASE_URL}/o/authorize/"
        f"?response_type=code"
        f"&client_id={settings.AACHARYA_CLIENT_ID}"
        f"&redirect_uri={redirect_uri}"
    )
    return RedirectResponse(auth_url)

@router.get("/callback")
async def callback(code: str):
    """Handle OAuth2 callback and exchange code for token."""
    token_url = f"{settings.AACHARYA_BASE_URL}/o/token/"
    
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": "http://localhost:8000/api/auth/callback",
        "client_id": settings.AACHARYA_CLIENT_ID,
        "client_secret": settings.AACHARYA_CLIENT_SECRET,
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(token_url, data=data)
        
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail=f"Failed to fetch token: {response.text}")
        
        token_data = response.json()
        
        # Now fetch user info
        user_info_url = f"{settings.AACHARYA_BASE_URL}/o/userinfo/"
        headers = {"Authorization": f"Bearer {token_data['access_token']}"}
        user_response = await client.get(user_info_url, headers=headers)
        
        if user_response.status_code != 200:
             raise HTTPException(status_code=400, detail="Failed to fetch user info")
             
        user_data = user_response.json()
        
        # Redirect back to frontend with token info (Simplified for now)
        # In production, use HttpOnly cookies or a secure session.
        return RedirectResponse(f"{settings.FRONTEND_URL}/auth-success?token={token_data['access_token']}")
