from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import RedirectResponse
import httpx
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    AACHARYA_CLIENT_ID: str = "SAKHI_CLIENT"
    AACHARYA_CLIENT_SECRET: str = "SAKHI_SECRET_CHANGE_ME_123"
    AACHARYA_BASE_URL: str = "https://jnwn.xyz"
    FRONTEND_URL: str = "https://sakhi.jnwn.xyz"
    
    class Config:
        env_file = ".env"

settings = Settings()
router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.get("/config")
async def get_auth_config():
    """Return OIDC config for frontend to initiate PKCE flow."""
    return {
        "client_id": settings.AACHARYA_CLIENT_ID,
        "authorize_url": f"{settings.AACHARYA_BASE_URL}/o/authorize/",
        "redirect_uri": f"{settings.FRONTEND_URL}/auth-success",
    }

@router.post("/exchange")
async def exchange_token(request: Request):
    """Securely exchange OIDC code for tokens using PKCE verifier."""
    body = await request.json()
    code = body.get("code")
    code_verifier = body.get("code_verifier")
    redirect_uri = body.get("redirect_uri", f"{settings.FRONTEND_URL}/auth-success")

    if not all([code, code_verifier]):
        raise HTTPException(status_code=400, detail="Missing code or code_verifier")

    token_url = f"{settings.AACHARYA_BASE_URL}/o/token/"
    
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": redirect_uri,
        "client_id": settings.AACHARYA_CLIENT_ID,
        "client_secret": settings.AACHARYA_CLIENT_SECRET,
        "code_verifier": code_verifier,
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(token_url, data=data)
        
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail=f"OIDC Error: {response.text}")
        
        tokens = response.json()
        
        # 2. Fetch User Info
        user_info_url = f"{settings.AACHARYA_BASE_URL}/o/userinfo/"
        headers = {"Authorization": f"Bearer {tokens['access_token']}"}
        user_response = await client.get(user_info_url, headers=headers)
        
        if user_response.status_code != 200:
             raise HTTPException(status_code=400, detail="Failed to fetch user info")
             
        user_data = user_response.json()
        
        return {
            "token": tokens["access_token"],
            "user": {
                "sub": user_data.get("sub"),
                "name": user_data.get("name"),
                "email": user_data.get("email"),
                "role": user_data.get("role"),
                "college": user_data.get("college"),
                "roll_no": user_data.get("roll_no"),
                "branch": user_data.get("branch"),
                "year": user_data.get("year"),
            }
        }
