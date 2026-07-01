import logging
import redis.asyncio as aioredis
from fastapi import Request, HTTPException, status
from backend.core.config import settings

logger = logging.getLogger(__name__)

# Global lazy-initialized redis client
redis_client = None

def get_redis_client() -> aioredis.Redis:
    global redis_client
    if redis_client is None:
        redis_client = aioredis.from_url(
            settings.get_redis_url, 
            encoding="utf-8", 
            decode_responses=True
        )
    return redis_client

class RateLimiter:
    """FastAPI dependency to rate limit requests using Redis."""
    
    def __init__(self, times: int = 100, seconds: int = 60):
        self.times = times
        self.seconds = seconds

    async def __call__(self, request: Request) -> None:
        if settings.ENV == "testing":
            return  # Disable rate limit constraints during testing
            
        client = get_redis_client()
        ip = request.client.host if request.client else "unknown"
        path = request.url.path
        key = f"rate_limit:{ip}:{path}"
        
        try:
            # Check key value
            current_value = await client.get(key)
            if current_value is not None and int(current_value) >= self.times:
                logger.warning(f"Rate limit exceeded for IP {ip} on path {path}")
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Rate limit exceeded. Please try again later."
                )
                
            # Perform atomic increment and expire
            async with client.pipeline(transaction=True) as pipe:
                await pipe.incr(key)
                await pipe.expire(key, self.seconds)
                await pipe.execute()
                
        except HTTPException:
            raise
        except Exception as e:
            # Non-blocking fallback: Log Redis errors but allow the request to proceed
            logger.error(f"Redis rate limiter connection error: {e}. Bypassing limit checks.")
            return
