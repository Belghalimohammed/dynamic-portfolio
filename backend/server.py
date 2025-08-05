from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.security import HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path
import os
import logging
from datetime import timedelta
from typing import List, Optional

# Import our modules
from models import *
from database import Database
from auth import *
from file_upload import file_manager

# Load environment
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Database setup
mongo_url = os.environ['MONGO_URL']
db_name = os.environ.get('DB_NAME', 'portfolio')
database = Database(mongo_url, db_name)

# Create the main app
app = FastAPI(title="Portfolio API", version="1.0.0")

# Create API router
api_router = APIRouter(prefix="/api")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded files
app.mount("/api/files", StaticFiles(directory="/app/backend/uploads"), name="files")

# Dependency to get database
async def get_db():
    return database.db

# Dependency to get current user with database
async def get_current_user_with_db(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db = Depends(get_db)
):
    payload = verify_token(credentials.credentials)
    user_id = payload.get("sub")
    
    user_data = await db.users.find_one({"id": user_id})
    if user_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return User(**user_data)

# Public endpoints (no authentication required)
@api_router.get("/")
async def root():
    return {"message": "Portfolio API v1.0.0"}

# Authentication endpoints
@api_router.post("/auth/login", response_model=LoginResponse)
async def login(login_data: LoginRequest, db = Depends(get_db)):
    user = await authenticate_user(login_data.email, login_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    
    return LoginResponse(
        access_token=access_token,
        user={
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role
        }
    )

@api_router.get("/auth/me")
async def get_current_user_info(current_user: User = Depends(get_current_user_with_db)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "role": current_user.role
    }

# Public portfolio data endpoints (no auth required)
@api_router.get("/portfolio/hero", response_model=HeroSection)
async def get_hero():
    return await database.get_hero()

@api_router.get("/portfolio/about", response_model=AboutSection)
async def get_about():
    return await database.get_about()

@api_router.get("/portfolio/education", response_model=List[Education])
async def get_education():
    return await database.get_education()

@api_router.get("/portfolio/experience", response_model=List[Experience])
async def get_experience():
    return await database.get_experience()

@api_router.get("/portfolio/skills", response_model=Skills)
async def get_skills():
    return await database.get_skills()

@api_router.get("/portfolio/projects", response_model=List[Project])
async def get_projects():
    return await database.get_projects()

@api_router.get("/portfolio/certifications", response_model=List[Certification])
async def get_certifications():
    return await database.get_certifications()

@api_router.get("/portfolio/testimonials", response_model=List[Testimonial])
async def get_testimonials():
    return await database.get_testimonials()

@api_router.get("/portfolio/blog", response_model=List[BlogArticle])
async def get_blog_articles():
    return await database.get_blog_articles()

@api_router.get("/portfolio/settings", response_model=SiteSettings)
async def get_settings():
    return await database.get_settings()

# Contact form (public)
@api_router.post("/contact", response_model=MessageResponse)
async def create_contact_message(message_data: ContactMessageCreate):
    try:
        message = await database.create_contact_message(message_data)
        return MessageResponse(
            message="Message sent successfully!",
            data={"id": message.id}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Admin endpoints (authentication required)
@api_router.put("/admin/hero", response_model=HeroSection)
async def update_hero(hero_data: HeroUpdate, current_user: User = Depends(get_current_user_with_db)):
    return await database.update_hero(hero_data)

@api_router.put("/admin/about", response_model=AboutSection)
async def update_about(about_data: AboutUpdate, current_user: User = Depends(get_current_user_with_db)):
    return await database.update_about(about_data)

# Education admin endpoints
@api_router.post("/admin/education", response_model=Education)
async def create_education(education_data: EducationCreate, current_user: User = Depends(get_current_user_with_db)):
    return await database.create_education(education_data)

@api_router.put("/admin/education/{edu_id}", response_model=Education)
async def update_education(edu_id: str, education_data: EducationUpdate, current_user: User = Depends(get_current_user_with_db)):
    try:
        return await database.update_education(edu_id, education_data)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@api_router.delete("/admin/education/{edu_id}", response_model=MessageResponse)
async def delete_education(edu_id: str, current_user: User = Depends(get_current_user_with_db)):
    success = await database.delete_education(edu_id)
    if not success:
        raise HTTPException(status_code=404, detail="Education entry not found")
    return MessageResponse(message="Education entry deleted successfully")

# Experience admin endpoints
@api_router.post("/admin/experience", response_model=Experience)
async def create_experience(experience_data: ExperienceCreate, current_user: User = Depends(get_current_user_with_db)):
    return await database.create_experience(experience_data)

@api_router.put("/admin/experience/{exp_id}", response_model=Experience)
async def update_experience(exp_id: str, experience_data: ExperienceUpdate, current_user: User = Depends(get_current_user_with_db)):
    try:
        return await database.update_experience(exp_id, experience_data)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@api_router.delete("/admin/experience/{exp_id}", response_model=MessageResponse)
async def delete_experience(exp_id: str, current_user: User = Depends(get_current_user_with_db)):
    success = await database.delete_experience(exp_id)
    if not success:
        raise HTTPException(status_code=404, detail="Experience entry not found")
    return MessageResponse(message="Experience entry deleted successfully")

# Skills admin endpoints
@api_router.put("/admin/skills", response_model=Skills)
async def update_skills(skills_data: SkillsUpdate, current_user: User = Depends(get_current_user_with_db)):
    return await database.update_skills(skills_data)

# Projects admin endpoints
@api_router.post("/admin/projects", response_model=Project)
async def create_project(project_data: ProjectCreate, current_user: User = Depends(get_current_user_with_db)):
    return await database.create_project(project_data)

@api_router.put("/admin/projects/{proj_id}", response_model=Project)
async def update_project(proj_id: str, project_data: ProjectUpdate, current_user: User = Depends(get_current_user_with_db)):
    try:
        return await database.update_project(proj_id, project_data)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@api_router.delete("/admin/projects/{proj_id}", response_model=MessageResponse)
async def delete_project(proj_id: str, current_user: User = Depends(get_current_user_with_db)):
    success = await database.delete_project(proj_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return MessageResponse(message="Project deleted successfully")

# Certifications admin endpoints
@api_router.post("/admin/certifications", response_model=Certification)
async def create_certification(cert_data: CertificationCreate, current_user: User = Depends(get_current_user_with_db)):
    return await database.create_certification(cert_data)

@api_router.put("/admin/certifications/{cert_id}", response_model=Certification)
async def update_certification(cert_id: str, cert_data: CertificationUpdate, current_user: User = Depends(get_current_user_with_db)):
    try:
        return await database.update_certification(cert_id, cert_data)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@api_router.delete("/admin/certifications/{cert_id}", response_model=MessageResponse)
async def delete_certification(cert_id: str, current_user: User = Depends(get_current_user_with_db)):
    success = await database.delete_certification(cert_id)
    if not success:
        raise HTTPException(status_code=404, detail="Certification not found")
    return MessageResponse(message="Certification deleted successfully")

# Testimonials admin endpoints
@api_router.post("/admin/testimonials", response_model=Testimonial)
async def create_testimonial(testimonial_data: TestimonialCreate, current_user: User = Depends(get_current_user_with_db)):
    return await database.create_testimonial(testimonial_data)

@api_router.put("/admin/testimonials/{test_id}", response_model=Testimonial)
async def update_testimonial(test_id: str, testimonial_data: TestimonialUpdate, current_user: User = Depends(get_current_user_with_db)):
    try:
        return await database.update_testimonial(test_id, testimonial_data)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@api_router.delete("/admin/testimonials/{test_id}", response_model=MessageResponse)
async def delete_testimonial(test_id: str, current_user: User = Depends(get_current_user_with_db)):
    success = await database.delete_testimonial(test_id)
    if not success:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return MessageResponse(message="Testimonial deleted successfully")

# Blog admin endpoints
@api_router.post("/admin/blog/articles", response_model=BlogArticle)
async def create_blog_article(article_data: BlogArticleCreate, current_user: User = Depends(get_current_user_with_db)):
    return await database.create_blog_article(article_data)

@api_router.put("/admin/blog/articles/{article_id}", response_model=BlogArticle)
async def update_blog_article(article_id: str, article_data: BlogArticleUpdate, current_user: User = Depends(get_current_user_with_db)):
    try:
        return await database.update_blog_article(article_id, article_data)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@api_router.delete("/admin/blog/articles/{article_id}", response_model=MessageResponse)
async def delete_blog_article(article_id: str, current_user: User = Depends(get_current_user_with_db)):
    success = await database.delete_blog_article(article_id)
    if not success:
        raise HTTPException(status_code=404, detail="Blog article not found")
    return MessageResponse(message="Blog article deleted successfully")

# Settings admin endpoints
@api_router.put("/admin/settings", response_model=SiteSettings)
async def update_settings(settings_data: SiteSettingsUpdate, current_user: User = Depends(get_current_user_with_db)):
    return await database.update_settings(settings_data)

# File upload endpoints
@api_router.post("/admin/upload", response_model=dict)
async def upload_file(
    file: UploadFile = File(...),
    subfolder: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user_with_db)
):
    return await file_manager.save_file(file, subfolder)

@api_router.get("/admin/files", response_model=List[dict])
async def list_files(
    subfolder: Optional[str] = None,
    current_user: User = Depends(get_current_user_with_db)
):
    return file_manager.list_files(subfolder)

@api_router.delete("/admin/files/{filename}", response_model=MessageResponse)
async def delete_file(
    filename: str,
    subfolder: Optional[str] = None,
    current_user: User = Depends(get_current_user_with_db)
):
    file_path = file_manager.get_file_path(filename, subfolder)
    success = file_manager.delete_file(str(file_path))
    if not success:
        raise HTTPException(status_code=404, detail="File not found")
    return MessageResponse(message="File deleted successfully")

# Contact messages admin endpoint
@api_router.get("/admin/contact-messages", response_model=List[ContactMessage])
async def get_contact_messages(current_user: User = Depends(get_current_user_with_db)):
    return await database.get_contact_messages()

# Include the router in the main app
app.include_router(api_router)

# Startup event
@app.on_event("startup")
async def startup_event():
    # Create default admin user
    await create_default_admin(database.db)
    print("🚀 Portfolio API started successfully!")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    await database.close()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)