import httpx
import json
import os
from typing import AsyncGenerator

class OllamaClient:
    def __init__(self, base_url: str = "http://host.docker.internal:11434"):
        self.base_url = os.environ.get("OLLAMA_BASE_URL", base_url)

    async def generate(self, model: str, prompt: str, system: str = "") -> str:
        url = f"{self.base_url}/api/generate"
        payload = {
            "model": model,
            "prompt": prompt,
            "system": system,
            "stream": False
        }
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            return response.json().get("response", "")

    async def chat_stream(self, model: str, messages: list) -> AsyncGenerator[str, None]:
        url = f"{self.base_url}/api/chat"
        payload = {
            "model": model,
            "messages": messages,
            "stream": True
        }
        async with httpx.AsyncClient(timeout=60.0) as client:
            async with client.stream("POST", url, json=payload) as response:
                async for line in response.aiter_lines():
                    if not line: continue
                    chunk = json.loads(line)
                    if "message" in chunk:
                        yield chunk["message"]["content"]
                    if chunk.get("done"):
                        break

ollama_client = OllamaClient()
