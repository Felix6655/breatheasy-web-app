from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends, Response
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import httpx

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Config
JWT_SECRET = os.environ.get('JWT_SECRET', 'breatheasy_secret_2024')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_DAYS = 7

# Stripe Config
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY')

# Stripe Checkout import
from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout, 
    CheckoutSessionResponse, 
    CheckoutStatusResponse, 
    CheckoutSessionRequest
)

# Create the main app
app = FastAPI()

# Create router with /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============== MODELS ==============

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    subscription_status: str = "free"
    created_at: str

class TokenResponse(BaseModel):
    token: str
    user: UserResponse

class CourseProgress(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    course_id: str
    module_id: str
    lesson_id: str
    completed: bool = False
    completed_at: Optional[str] = None

class PanicSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None
    started_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    completed_at: Optional[str] = None
    helpful_items: List[str] = []
    duration_seconds: int = 0

class PanicSessionCreate(BaseModel):
    user_id: Optional[str] = None
    helpful_items: List[str] = []
    duration_seconds: int = 0

class UserSettings(BaseModel):
    vibration_enabled: bool = True
    sound_enabled: bool = True
    voice_guidance_enabled: bool = False
    default_breathing_preset: str = "2m"

class SubscriptionPlan(BaseModel):
    plan_id: str
    name: str
    price: float
    interval: str
    features: List[str]

# Subscription Plans
SUBSCRIPTION_PLANS = {
    "monthly": SubscriptionPlan(
        plan_id="monthly",
        name="Premium Monthly",
        price=9.99,
        interval="month",
        features=[
            "Full courses access",
            "Night panic support",
            "Offline access",
            "Personalized insights",
            "Progress history"
        ]
    ),
    "yearly": SubscriptionPlan(
        plan_id="yearly",
        name="Premium Yearly",
        price=79.99,
        interval="year",
        features=[
            "Full courses access",
            "Night panic support",
            "Offline access",
            "Personalized insights",
            "Progress history",
            "Save 33%"
        ]
    )
}

# ============== HELPER FUNCTIONS ==============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_jwt_token(user_id: str) -> str:
    payload = {
        'user_id': user_id,
        'exp': datetime.now(timezone.utc) + timedelta(days=JWT_EXPIRATION_DAYS),
        'iat': datetime.now(timezone.utc)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_jwt_token(token: str) -> Optional[Dict]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

async def get_current_user(request: Request) -> Optional[Dict]:
    """Get current user from token (cookie or header)"""
    token = request.cookies.get('session_token')
    if not token:
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header[7:]
    
    if not token:
        return None
    
    # Check if it's a JWT token
    payload = decode_jwt_token(token)
    if payload:
        user = await db.users.find_one({"user_id": payload['user_id']}, {"_id": 0})
        return user
    
    # Check if it's a session token (Google OAuth)
    session = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if session:
        expires_at = session.get('expires_at')
        if isinstance(expires_at, str):
            expires_at = datetime.fromisoformat(expires_at)
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        if expires_at < datetime.now(timezone.utc):
            return None
        user = await db.users.find_one({"user_id": session['user_id']}, {"_id": 0})
        return user
    
    return None

async def require_auth(request: Request) -> Dict:
    """Require authentication - raises 401 if not authenticated"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    return user

# ============== AUTH ROUTES ==============

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    # Check if user exists
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    hashed_password = hash_password(user_data.password)
    
    user_doc = {
        "user_id": user_id,
        "email": user_data.email,
        "name": user_data.name,
        "password": hashed_password,
        "picture": None,
        "subscription_status": "free",
        "settings": UserSettings().model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_doc)
    
    token = create_jwt_token(user_id)
    
    user_response = UserResponse(
        user_id=user_id,
        email=user_data.email,
        name=user_data.name,
        subscription_status="free",
        created_at=user_doc['created_at']
    )
    
    return TokenResponse(token=token, user=user_response)

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not user.get('password'):
        raise HTTPException(status_code=401, detail="Please use Google login for this account")
    
    if not verify_password(credentials.password, user['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_jwt_token(user['user_id'])
    
    user_response = UserResponse(
        user_id=user['user_id'],
        email=user['email'],
        name=user['name'],
        picture=user.get('picture'),
        subscription_status=user.get('subscription_status', 'free'),
        created_at=user['created_at']
    )
    
    return TokenResponse(token=token, user=user_response)

@api_router.post("/auth/session")
async def create_session(request: Request, response: Response):
    """Handle Google OAuth session - exchange session_id for session_token"""
    session_id = request.headers.get('X-Session-ID')
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID required")
    
    # Fetch user data from Emergent Auth
    async with httpx.AsyncClient() as client:
        try:
            auth_response = await client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": session_id}
            )
            if auth_response.status_code != 200:
                raise HTTPException(status_code=401, detail="Invalid session")
            
            auth_data = auth_response.json()
        except Exception as e:
            logger.error(f"Auth error: {e}")
            raise HTTPException(status_code=401, detail="Authentication failed")
    
    # Check if user exists
    existing_user = await db.users.find_one({"email": auth_data['email']}, {"_id": 0})
    
    if existing_user:
        user_id = existing_user['user_id']
        # Update user info
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {
                "name": auth_data.get('name', existing_user['name']),
                "picture": auth_data.get('picture')
            }}
        )
    else:
        # Create new user
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        user_doc = {
            "user_id": user_id,
            "email": auth_data['email'],
            "name": auth_data.get('name', 'User'),
            "picture": auth_data.get('picture'),
            "subscription_status": "free",
            "settings": UserSettings().model_dump(),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(user_doc)
    
    # Store session
    session_token = auth_data.get('session_token', str(uuid.uuid4()))
    session_doc = {
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.user_sessions.delete_many({"user_id": user_id})
    await db.user_sessions.insert_one(session_doc)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7 * 24 * 60 * 60
    )
    
    user = await db.users.find_one({"user_id": user_id}, {"_id": 0, "password": 0})
    return user

@api_router.get("/auth/me")
async def get_me(request: Request):
    """Get current user info"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Remove password from response
    user_copy = {k: v for k, v in user.items() if k != 'password'}
    return user_copy

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    """Logout user"""
    token = request.cookies.get('session_token')
    if token:
        await db.user_sessions.delete_many({"session_token": token})
    
    response.delete_cookie(key="session_token", path="/")
    return {"message": "Logged out successfully"}

# ============== USER SETTINGS ==============

@api_router.get("/users/settings")
async def get_user_settings(request: Request):
    user = await get_current_user(request)
    if not user:
        # Return default settings for guest users
        return UserSettings().model_dump()
    
    return user.get('settings', UserSettings().model_dump())

@api_router.put("/users/settings")
async def update_user_settings(settings: UserSettings, request: Request):
    user = await require_auth(request)
    
    await db.users.update_one(
        {"user_id": user['user_id']},
        {"$set": {"settings": settings.model_dump()}}
    )
    
    return settings.model_dump()

# ============== PANIC SESSIONS ==============

@api_router.post("/panic-sessions", response_model=PanicSession)
async def create_panic_session(session_data: PanicSessionCreate, request: Request):
    """Create a panic session record (works without auth for guest mode)"""
    user = await get_current_user(request)
    
    session = PanicSession(
        user_id=user['user_id'] if user else session_data.user_id,
        helpful_items=session_data.helpful_items,
        duration_seconds=session_data.duration_seconds,
        completed_at=datetime.now(timezone.utc).isoformat()
    )
    
    await db.panic_sessions.insert_one(session.model_dump())
    return session

@api_router.get("/panic-sessions", response_model=List[PanicSession])
async def get_panic_sessions(request: Request):
    """Get user's panic session history"""
    user = await require_auth(request)
    
    sessions = await db.panic_sessions.find(
        {"user_id": user['user_id']},
        {"_id": 0}
    ).sort("started_at", -1).limit(50).to_list(50)
    
    return sessions

# ============== COURSES ==============

# Course content data
COURSES_DATA = {
    "panic-attacks": {
        "id": "panic-attacks",
        "title": "Understanding Panic Attacks",
        "description": "Learn what panic attacks are and how to manage them",
        "image": "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800",
        "is_premium": False,
        "modules": [
            {
                "id": "understanding",
                "title": "Understanding Panic",
                "lessons": [
                    {"id": "what-is-panic", "title": "What panic really is", "duration": "5 min", "is_premium": False},
                    {"id": "symptoms", "title": "Why symptoms feel intense", "duration": "7 min", "is_premium": False},
                    {"id": "not-dangerous", "title": "Why panic is not dangerous", "duration": "6 min", "is_premium": True}
                ]
            },
            {
                "id": "calming-skills",
                "title": "Calming Skills",
                "lessons": [
                    {"id": "breathing", "title": "Breathing that works", "duration": "8 min", "is_premium": True},
                    {"id": "grounding", "title": "Grounding techniques", "duration": "10 min", "is_premium": True},
                    {"id": "relaxation", "title": "Muscle relaxation", "duration": "12 min", "is_premium": True}
                ]
            },
            {
                "id": "confidence",
                "title": "Confidence Building",
                "lessons": [
                    {"id": "fear-reduction", "title": "Reducing fear of symptoms", "duration": "8 min", "is_premium": True},
                    {"id": "public", "title": "Handling panic in public", "duration": "10 min", "is_premium": True},
                    {"id": "trust-body", "title": "Trusting the body again", "duration": "7 min", "is_premium": True}
                ]
            },
            {
                "id": "prevention",
                "title": "Prevention",
                "lessons": [
                    {"id": "warning-signs", "title": "Early warning signs", "duration": "6 min", "is_premium": True},
                    {"id": "triggers", "title": "Triggers (sleep, caffeine, stress)", "duration": "9 min", "is_premium": True},
                    {"id": "panic-plan", "title": "Personal panic plan", "duration": "10 min", "is_premium": True}
                ]
            },
            {
                "id": "long-term",
                "title": "Long-Term Stability",
                "lessons": [
                    {"id": "setbacks", "title": "Panic setbacks", "duration": "7 min", "is_premium": True},
                    {"id": "confidence-time", "title": "Confidence over time", "duration": "8 min", "is_premium": True},
                    {"id": "maintenance", "title": "Maintenance routine", "duration": "6 min", "is_premium": True}
                ]
            }
        ]
    },
    "anxiety": {
        "id": "anxiety",
        "title": "Managing Anxiety",
        "description": "Tools and techniques for everyday anxiety",
        "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        "is_premium": True,
        "modules": [
            {
                "id": "understanding-anxiety",
                "title": "Understanding Anxiety",
                "lessons": [
                    {"id": "what-is-anxiety", "title": "What is anxiety?", "duration": "5 min", "is_premium": True},
                    {"id": "anxiety-cycle", "title": "The anxiety cycle", "duration": "7 min", "is_premium": True},
                    {"id": "physical-symptoms", "title": "Physical symptoms", "duration": "6 min", "is_premium": True}
                ]
            },
            {
                "id": "coping-strategies",
                "title": "Coping Strategies",
                "lessons": [
                    {"id": "cognitive-techniques", "title": "Cognitive techniques", "duration": "10 min", "is_premium": True},
                    {"id": "behavioral-strategies", "title": "Behavioral strategies", "duration": "8 min", "is_premium": True},
                    {"id": "lifestyle-changes", "title": "Lifestyle changes", "duration": "9 min", "is_premium": True}
                ]
            }
        ]
    },
    "worry": {
        "id": "worry",
        "title": "Reducing Worry",
        "description": "Break free from chronic worrying",
        "image": "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800",
        "is_premium": True,
        "modules": [
            {
                "id": "understanding-worry",
                "title": "Understanding Worry",
                "lessons": [
                    {"id": "worry-mind", "title": "The worrying mind", "duration": "6 min", "is_premium": True},
                    {"id": "productive-worry", "title": "Productive vs unproductive worry", "duration": "8 min", "is_premium": True}
                ]
            },
            {
                "id": "worry-techniques",
                "title": "Worry Reduction Techniques",
                "lessons": [
                    {"id": "worry-time", "title": "Scheduled worry time", "duration": "7 min", "is_premium": True},
                    {"id": "thought-defusion", "title": "Thought defusion", "duration": "10 min", "is_premium": True},
                    {"id": "letting-go", "title": "Letting go of control", "duration": "9 min", "is_premium": True}
                ]
            }
        ]
    }
}

# Lesson content (simplified for demo)
LESSON_CONTENT = {
    "what-is-panic": {
        "title": "What panic really is",
        "content": """
## Understanding Panic

A panic attack is your body's natural "fight or flight" response activating when there's no real danger. It's like a false alarm in your nervous system.

### Key Points to Remember:

**1. It's a normal body response**
Your body is trying to protect you. The sensations you feel during panic are the same ones that would help you escape real danger.

**2. It's temporary**
Panic attacks typically peak within 10 minutes and rarely last more than 30 minutes. Your body cannot maintain this state indefinitely.

**3. You're not in danger**
Even though it feels terrifying, panic attacks are not harmful. Your heart is strong enough to handle the increased rate. You can breathe, even when it feels difficult.

**4. It's more common than you think**
About 1 in 10 people experience panic attacks. You're not alone in this experience.

### What triggers panic?
- Stress accumulation
- Certain physical sensations
- Specific situations or places
- Sometimes, seemingly nothing at all

The good news? Panic attacks are highly treatable. The techniques in this course will help you understand and manage them.
        """,
        "audio_url": None,
        "duration": "5 min"
    },
    "symptoms": {
        "title": "Why symptoms feel intense",
        "content": """
## Why Panic Feels So Intense

When panic strikes, your body releases adrenaline. This hormone triggers a cascade of physical changes designed to help you survive threats.

### Common Symptoms Explained:

**Racing Heart**
Your heart pumps faster to send blood to your muscles. This is normal and your heart is not in danger.

**Shortness of Breath**
You're actually breathing faster, not less. This can make you feel like you can't catch your breath, but you're getting plenty of oxygen.

**Dizziness**
Rapid breathing can change CO2 levels in your blood, causing lightheadedness. This is uncomfortable but not dangerous.

**Chest Tightness**
Muscles in your chest tense up. This is tension, not a heart attack.

**Tingling Sensations**
Changes in blood flow and breathing can cause tingling in hands, feet, or face.

**Feeling Detached**
Your brain shifts focus outward for threats, which can make you feel "unreal" or detached.

### Remember
Every symptom has a logical, physical explanation. Your body is doing exactly what it's designed to do - it's just doing it at the wrong time.
        """,
        "audio_url": None,
        "duration": "7 min"
    }
}

@api_router.get("/courses")
async def get_courses(request: Request):
    """Get all courses with user progress"""
    user = await get_current_user(request)
    is_premium = user and user.get('subscription_status') == 'premium'
    
    courses = []
    for course_id, course in COURSES_DATA.items():
        course_data = {
            "id": course['id'],
            "title": course['title'],
            "description": course['description'],
            "image": course['image'],
            "is_premium": course['is_premium'],
            "is_locked": course['is_premium'] and not is_premium,
            "module_count": len(course['modules']),
            "lesson_count": sum(len(m['lessons']) for m in course['modules'])
        }
        
        if user:
            # Get progress
            completed = await db.course_progress.count_documents({
                "user_id": user['user_id'],
                "course_id": course_id,
                "completed": True
            })
            total = course_data['lesson_count']
            course_data['progress'] = (completed / total * 100) if total > 0 else 0
        else:
            course_data['progress'] = 0
            
        courses.append(course_data)
    
    return courses

@api_router.get("/courses/{course_id}")
async def get_course(course_id: str, request: Request):
    """Get course details with modules"""
    if course_id not in COURSES_DATA:
        raise HTTPException(status_code=404, detail="Course not found")
    
    user = await get_current_user(request)
    is_premium = user and user.get('subscription_status') == 'premium'
    
    course = COURSES_DATA[course_id]
    
    # Get user progress for all lessons
    user_progress = {}
    if user:
        progress_docs = await db.course_progress.find(
            {"user_id": user['user_id'], "course_id": course_id},
            {"_id": 0}
        ).to_list(100)
        for p in progress_docs:
            user_progress[p['lesson_id']] = p['completed']
    
    # Build response with progress
    modules = []
    for module in course['modules']:
        lessons = []
        for lesson in module['lessons']:
            lessons.append({
                **lesson,
                "is_locked": lesson['is_premium'] and not is_premium,
                "completed": user_progress.get(lesson['id'], False)
            })
        modules.append({
            "id": module['id'],
            "title": module['title'],
            "lessons": lessons
        })
    
    return {
        "id": course['id'],
        "title": course['title'],
        "description": course['description'],
        "image": course['image'],
        "is_premium": course['is_premium'],
        "modules": modules
    }

@api_router.get("/courses/{course_id}/lessons/{lesson_id}")
async def get_lesson(course_id: str, lesson_id: str, request: Request):
    """Get lesson content"""
    if course_id not in COURSES_DATA:
        raise HTTPException(status_code=404, detail="Course not found")
    
    user = await get_current_user(request)
    is_premium = user and user.get('subscription_status') == 'premium'
    
    # Find the lesson
    course = COURSES_DATA[course_id]
    lesson_meta = None
    for module in course['modules']:
        for lesson in module['lessons']:
            if lesson['id'] == lesson_id:
                lesson_meta = lesson
                break
    
    if not lesson_meta:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    if lesson_meta['is_premium'] and not is_premium:
        raise HTTPException(status_code=403, detail="Premium subscription required")
    
    # Get content
    content = LESSON_CONTENT.get(lesson_id, {
        "title": lesson_meta['title'],
        "content": "Lesson content coming soon...",
        "audio_url": None,
        "duration": lesson_meta['duration']
    })
    
    return {
        **content,
        "lesson_id": lesson_id,
        "course_id": course_id
    }

@api_router.post("/courses/{course_id}/lessons/{lesson_id}/complete")
async def complete_lesson(course_id: str, lesson_id: str, request: Request):
    """Mark a lesson as complete"""
    user = await require_auth(request)
    
    progress_doc = {
        "user_id": user['user_id'],
        "course_id": course_id,
        "lesson_id": lesson_id,
        "completed": True,
        "completed_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.course_progress.update_one(
        {"user_id": user['user_id'], "course_id": course_id, "lesson_id": lesson_id},
        {"$set": progress_doc},
        upsert=True
    )
    
    return {"message": "Lesson marked as complete"}

# ============== STRIPE SUBSCRIPTIONS ==============

@api_router.get("/subscriptions/plans")
async def get_subscription_plans():
    """Get available subscription plans"""
    return list(SUBSCRIPTION_PLANS.values())

@api_router.post("/subscriptions/checkout")
async def create_checkout_session(request: Request):
    """Create Stripe checkout session"""
    body = await request.json()
    plan_id = body.get('plan_id')
    origin_url = body.get('origin_url')
    
    if plan_id not in SUBSCRIPTION_PLANS:
        raise HTTPException(status_code=400, detail="Invalid plan")
    
    plan = SUBSCRIPTION_PLANS[plan_id]
    
    user = await get_current_user(request)
    user_id = user['user_id'] if user else f"guest_{uuid.uuid4().hex[:8]}"
    
    # Initialize Stripe
    host_url = str(request.base_url)
    webhook_url = f"{host_url}api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    # Build URLs
    success_url = f"{origin_url}/subscription/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin_url}/subscription"
    
    # Create checkout session
    checkout_request = CheckoutSessionRequest(
        amount=plan.price,
        currency="usd",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "plan_id": plan_id,
            "user_id": user_id,
            "plan_name": plan.name
        }
    )
    
    session = await stripe_checkout.create_checkout_session(checkout_request)
    
    # Create payment transaction record
    transaction_doc = {
        "transaction_id": str(uuid.uuid4()),
        "session_id": session.session_id,
        "user_id": user_id,
        "plan_id": plan_id,
        "amount": plan.price,
        "currency": "usd",
        "payment_status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.payment_transactions.insert_one(transaction_doc)
    
    return {"url": session.url, "session_id": session.session_id}

@api_router.get("/subscriptions/status/{session_id}")
async def get_checkout_status(session_id: str, request: Request):
    """Check payment status and update subscription"""
    # Initialize Stripe
    host_url = str(request.base_url)
    webhook_url = f"{host_url}api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    status = await stripe_checkout.get_checkout_status(session_id)
    
    # Update transaction
    transaction = await db.payment_transactions.find_one(
        {"session_id": session_id},
        {"_id": 0}
    )
    
    if transaction and status.payment_status == "paid" and transaction.get('payment_status') != 'paid':
        # Update transaction status
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {
                "payment_status": "paid",
                "completed_at": datetime.now(timezone.utc).isoformat()
            }}
        )
        
        # Update user subscription
        user_id = transaction.get('user_id')
        if user_id and not user_id.startswith('guest_'):
            await db.users.update_one(
                {"user_id": user_id},
                {"$set": {
                    "subscription_status": "premium",
                    "subscription_plan": transaction.get('plan_id'),
                    "subscription_updated_at": datetime.now(timezone.utc).isoformat()
                }}
            )
    
    return {
        "status": status.status,
        "payment_status": status.payment_status,
        "amount_total": status.amount_total,
        "currency": status.currency
    }

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks"""
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    host_url = str(request.base_url)
    webhook_url = f"{host_url}api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    try:
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        if webhook_response.payment_status == "paid":
            session_id = webhook_response.session_id
            metadata = webhook_response.metadata
            
            # Update transaction
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {
                    "payment_status": "paid",
                    "completed_at": datetime.now(timezone.utc).isoformat()
                }}
            )
            
            # Update user subscription
            user_id = metadata.get('user_id')
            if user_id and not user_id.startswith('guest_'):
                await db.users.update_one(
                    {"user_id": user_id},
                    {"$set": {
                        "subscription_status": "premium",
                        "subscription_plan": metadata.get('plan_id'),
                        "subscription_updated_at": datetime.now(timezone.utc).isoformat()
                    }}
                )
        
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        return JSONResponse(status_code=400, content={"error": str(e)})

# ============== HEALTH CHECK ==============

@api_router.get("/")
async def root():
    return {"message": "BreatheEasy API", "status": "healthy"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

# Include router
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
