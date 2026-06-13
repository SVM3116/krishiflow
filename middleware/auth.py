from fastapi import Request, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

# Initialize Supabase client using Service Role key
supabase_url = os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

# Create a single instance
supabase_client = None
if supabase_url and supabase_key:
    try:
        supabase_client = create_client(supabase_url, supabase_key)
    except Exception as e:
        print(f"Error initializing Supabase client in middleware/auth.py: {e}")

security = HTTPBearer(auto_error=False)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    """FastAPI dependency to validate authorization headers against Supabase Auth."""
    if not credentials:
        raise HTTPException(
            status_code=401,
            detail="Authorization header must be provided as Bearer <token>."
        )
        
    token = credentials.credentials
    if not token:
        raise HTTPException(
            status_code=401,
            detail="Token missing from Authorization header."
        )
        
    if not supabase_client:
        raise HTTPException(
            status_code=500,
            detail="Supabase DB not configured on backend."
        )
        
    try:
        # Fetch user profile using the token
        response = supabase_client.auth.get_user(token)
        if not response or not response.user:
            raise HTTPException(
                status_code=401,
                detail="Invalid or expired authentication token."
            )
        return response.user
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Authentication token verification failed: {str(e)}"
        )
