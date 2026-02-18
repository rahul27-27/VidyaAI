from fastapi import FastAPI, APIRouter, UploadFile, File, Form, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import json
import tempfile

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- Pydantic Models ---

class ManualResumeInput(BaseModel):
    full_name: str
    email: Optional[str] = ""
    phone: Optional[str] = ""
    education: str
    skills: str
    experience: str
    interests: str
    career_goals: str

class AnalysisResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    full_name: str
    resume_score: int
    resume_improvements: List[str]
    career_paths: List[dict]
    skill_gaps: List[dict]
    learning_roadmap: List[dict]
    strengths: List[str]
    summary: str
    created_at: str
    input_type: str

class AnalysisSummary(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    full_name: str
    resume_score: int
    summary: str
    created_at: str
    input_type: str

# --- AI Analysis Helper ---

async def analyze_with_ai(resume_text: str, name: str) -> dict:
    from emergentintegrations.llm.chat import LlmChat, UserMessage

    api_key = os.environ.get('EMERGENT_LLM_KEY')
    if not api_key:
        raise HTTPException(status_code=500, detail="AI API key not configured")

    session_id = f"vidyaguide-{uuid.uuid4()}"
    system_prompt = """You are VidyaGuide AI, an expert career planning and resume mentor. 
Analyze the provided resume/profile and return a JSON response with exactly this structure:
{
  "resume_score": <integer 0-100>,
  "resume_improvements": ["improvement1", "improvement2", ...],
  "career_paths": [
    {"title": "Career Title", "match_percentage": <int>, "description": "Why this fits", "key_skills": ["skill1", "skill2"]},
    ...
  ],
  "skill_gaps": [
    {"skill": "Skill Name", "importance": "High/Medium/Low", "description": "Why it matters", "resources": ["resource1", "resource2"]},
    ...
  ],
  "learning_roadmap": [
    {"phase": "Phase 1 (Month 1-2)", "title": "Foundation", "tasks": ["task1", "task2"], "skills": ["skill1"]},
    ...
  ],
  "strengths": ["strength1", "strength2", ...],
  "summary": "Brief 2-3 sentence career assessment"
}
Provide at least 3 career paths, 4 skill gaps, 4 learning roadmap phases, 5 resume improvements, and 4 strengths.
Return ONLY valid JSON, no markdown, no explanation."""

    chat = LlmChat(
        api_key=api_key,
        session_id=session_id,
        system_message=system_prompt
    ).with_model("openai", "gpt-4o")

    user_message = UserMessage(text=f"Analyze this resume/profile:\n\n{resume_text}")
    response = await chat.send_message(user_message)

    try:
        clean = response.strip()
        if clean.startswith("```"):
            clean = clean.split("\n", 1)[1] if "\n" in clean else clean[3:]
            if clean.endswith("```"):
                clean = clean[:-3]
            clean = clean.strip()
        result = json.loads(clean)
    except json.JSONDecodeError:
        logger.error(f"Failed to parse AI response: {response[:500]}")
        raise HTTPException(status_code=500, detail="Failed to parse AI analysis")

    return result


def extract_pdf_text(file_bytes: bytes) -> str:
    import PyPDF2
    import io
    reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
    text_parts = []
    for page in reader.pages:
        t = page.extract_text()
        if t:
            text_parts.append(t)
    return "\n".join(text_parts)


# --- API Endpoints ---

@api_router.get("/")
async def root():
    return {"message": "VidyaGuide AI API is running"}

@api_router.post("/analyze-resume", response_model=AnalysisResponse)
async def analyze_resume_pdf(file: UploadFile = File(...), full_name: str = Form("")):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    file_bytes = await file.read()
    if len(file_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max 10MB")

    resume_text = extract_pdf_text(file_bytes)
    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from PDF")

    name = full_name or "Unknown"
    ai_result = await analyze_with_ai(resume_text, name)

    analysis_id = str(uuid.uuid4())
    doc = {
        "id": analysis_id,
        "full_name": name,
        "resume_score": ai_result.get("resume_score", 0),
        "resume_improvements": ai_result.get("resume_improvements", []),
        "career_paths": ai_result.get("career_paths", []),
        "skill_gaps": ai_result.get("skill_gaps", []),
        "learning_roadmap": ai_result.get("learning_roadmap", []),
        "strengths": ai_result.get("strengths", []),
        "summary": ai_result.get("summary", ""),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "input_type": "pdf",
        "raw_text": resume_text[:5000]
    }
    await db.analyses.insert_one(doc)

    return {k: v for k, v in doc.items() if k != "_id" and k != "raw_text"}

@api_router.post("/analyze-manual", response_model=AnalysisResponse)
async def analyze_manual_entry(data: ManualResumeInput):
    resume_text = f"""
Name: {data.full_name}
Email: {data.email}
Phone: {data.phone}

Education:
{data.education}

Skills:
{data.skills}

Experience:
{data.experience}

Interests:
{data.interests}

Career Goals:
{data.career_goals}
""".strip()

    ai_result = await analyze_with_ai(resume_text, data.full_name)

    analysis_id = str(uuid.uuid4())
    doc = {
        "id": analysis_id,
        "full_name": data.full_name,
        "resume_score": ai_result.get("resume_score", 0),
        "resume_improvements": ai_result.get("resume_improvements", []),
        "career_paths": ai_result.get("career_paths", []),
        "skill_gaps": ai_result.get("skill_gaps", []),
        "learning_roadmap": ai_result.get("learning_roadmap", []),
        "strengths": ai_result.get("strengths", []),
        "summary": ai_result.get("summary", ""),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "input_type": "manual",
        "raw_text": resume_text[:5000]
    }
    await db.analyses.insert_one(doc)

    return {k: v for k, v in doc.items() if k != "_id" and k != "raw_text"}

@api_router.get("/analysis/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis(analysis_id: str):
    doc = await db.analyses.find_one({"id": analysis_id}, {"_id": 0, "raw_text": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return doc

@api_router.get("/analyses", response_model=List[AnalysisSummary])
async def list_analyses():
    docs = await db.analyses.find(
        {},
        {"_id": 0, "id": 1, "full_name": 1, "resume_score": 1, "summary": 1, "created_at": 1, "input_type": 1}
    ).sort("created_at", -1).to_list(50)
    return docs

@api_router.delete("/analysis/{analysis_id}")
async def delete_analysis(analysis_id: str):
    result = await db.analyses.delete_one({"id": analysis_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return {"message": "Analysis deleted"}

# Include router and middleware
app.include_router(api_router)

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
