from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.auth import router as auth_router
from api.chat import router as chat_router
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Sakhi Standalone API", version="0.1.0")

# Strict CORS for JNWN Ecosystem
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://sakhi.jnwn.xyz",
    "https://aacharya.jnwn.xyz",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(chat_router)

@app.get("/")
async def root():
    return {"message": "Welcome to Sakhi Standalone Agentic API", "status": "online"}
