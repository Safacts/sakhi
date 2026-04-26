from fastapi import APIRouter, Request, HTTPException, Header
from fastapi.responses import RedirectResponse
import httpx
from pydantic_settings import BaseSettings
import logging

logger = logging.getLogger(__name__)

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
        
        # 3. Fetch additional profile data from Aacharya API
        profile_data = {}
        try:
            profile_url = f"{settings.AACHARYA_BASE_URL}/aacharya/api/v1/user/profile/"
            profile_response = await client.get(profile_url, headers=headers)
            if profile_response.status_code == 200:
                profile_data = profile_response.json()
                logger.info(f"Successfully fetched profile for user: {user_data.get('sub')}")
        except Exception as e:
            logger.warning(f"Could not fetch extended profile: {e}")
        
        return {
            "token": tokens["access_token"],
            "user": {
                "sub": user_data.get("sub"),
                "name": user_data.get("name"),
                "email": user_data.get("email"),
                "role": user_data.get("role") or profile_data.get("role"),
                "college": user_data.get("college") or profile_data.get("college"),
                "roll_no": user_data.get("roll_no") or profile_data.get("roll_no"),
                "branch": user_data.get("branch") or profile_data.get("branch"),
                "year": user_data.get("year") or profile_data.get("year"),
                "full_name": profile_data.get("full_name") or user_data.get("name"),
            }
        }

@router.get("/validate")
async def validate_token(authorization: str = Header(...)):
    """Validate a token and return user info with role."""
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    token = authorization.replace("Bearer ", "")
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            # Validate with Aacharya userinfo endpoint
            user_info_url = f"{settings.AACHARYA_BASE_URL}/o/userinfo/"
            response = await client.get(user_info_url, headers=headers)
            
            if response.status_code != 200:
                raise HTTPException(status_code=401, detail="Invalid token")
            
            user_data = response.json()
            
            # Fetch extended profile
            profile_data = {}
            try:
                profile_url = f"{settings.AACHARYA_BASE_URL}/aacharya/api/v1/user/profile/"
                profile_response = await client.get(profile_url, headers=headers)
                if profile_response.status_code == 200:
                    profile_data = profile_response.json()
            except Exception as e:
                logger.warning(f"Could not fetch extended profile during validation: {e}")
            
            return {
                "valid": True,
                "user": {
                    "sub": user_data.get("sub"),
                    "name": user_data.get("name"),
                    "email": user_data.get("email"),
                    "role": user_data.get("role") or profile_data.get("role"),
                    "college": user_data.get("college") or profile_data.get("college"),
                    "roll_no": user_data.get("roll_no") or profile_data.get("roll_no"),
                    "branch": user_data.get("branch") or profile_data.get("branch"),
                    "year": user_data.get("year") or profile_data.get("year"),
                }
            }
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Aacharya API timeout")
    except Exception as e:
        logger.error(f"Token validation error: {e}")
        raise HTTPException(status_code=500, detail="Validation error")
