from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

# Base Models
class BaseDocument(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Authentication Models
class User(BaseDocument):
    email: str
    password: str  # This will be hashed
    name: str
    role: str = "admin"

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

# Hero Section Models
class SocialLinks(BaseModel):
    linkedin: Optional[str] = None
    github: Optional[str] = None
    twitter: Optional[str] = None
    email: Optional[str] = None

class HeroSection(BaseModel):
    name: str
    job_title: str
    tagline: str
    profile_image: Optional[str] = None
    background_image: Optional[str] = None
    resume_url: Optional[str] = None
    social_links: SocialLinks = SocialLinks()
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class HeroUpdate(BaseModel):
    name: Optional[str] = None
    job_title: Optional[str] = None
    tagline: Optional[str] = None
    profile_image: Optional[str] = None
    background_image: Optional[str] = None
    resume_url: Optional[str] = None
    social_links: Optional[SocialLinks] = None

# About Section Models
class AboutSection(BaseModel):
    title: str = "About Me"
    description: str
    long_description: str
    location: str
    years_of_experience: int
    projects_completed: int
    technologies: List[str] = []
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class AboutUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    long_description: Optional[str] = None
    location: Optional[str] = None
    years_of_experience: Optional[int] = None
    projects_completed: Optional[int] = None
    technologies: Optional[List[str]] = None

# Education Models
class Education(BaseDocument):
    degree: str
    institution: str
    location: str
    duration: str
    gpa: Optional[str] = None
    description: str
    order: int = 0

class EducationCreate(BaseModel):
    degree: str
    institution: str
    location: str
    duration: str
    gpa: Optional[str] = None
    description: str
    order: int = 0

class EducationUpdate(BaseModel):
    degree: Optional[str] = None
    institution: Optional[str] = None
    location: Optional[str] = None
    duration: Optional[str] = None
    gpa: Optional[str] = None
    description: Optional[str] = None
    order: Optional[int] = None

# Experience Models
class Experience(BaseDocument):
    position: str
    company: str
    location: str
    duration: str
    type: str = "Full-time"
    description: str
    achievements: List[str] = []
    technologies: List[str] = []
    order: int = 0

class ExperienceCreate(BaseModel):
    position: str
    company: str
    location: str
    duration: str
    type: str = "Full-time"
    description: str
    achievements: List[str] = []
    technologies: List[str] = []
    order: int = 0

class ExperienceUpdate(BaseModel):
    position: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    duration: Optional[str] = None
    type: Optional[str] = None
    description: Optional[str] = None
    achievements: Optional[List[str]] = None
    technologies: Optional[List[str]] = None
    order: Optional[int] = None

# Skills Models
class TechnicalSkill(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    level: int  # 0-100
    category: str

class Skills(BaseModel):
    technical: List[TechnicalSkill] = []
    soft: List[str] = []
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TechnicalSkillCreate(BaseModel):
    name: str
    level: int
    category: str

class TechnicalSkillUpdate(BaseModel):
    name: Optional[str] = None
    level: Optional[int] = None
    category: Optional[str] = None

class SkillsUpdate(BaseModel):
    technical: Optional[List[TechnicalSkill]] = None
    soft: Optional[List[str]] = None

# Project Models
class Project(BaseDocument):
    title: str
    description: str
    long_description: str
    image: Optional[str] = None
    technologies: List[str] = []
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    featured: bool = False
    category: str
    order: int = 0

class ProjectCreate(BaseModel):
    title: str
    description: str
    long_description: str
    image: Optional[str] = None
    technologies: List[str] = []
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    featured: bool = False
    category: str
    order: int = 0

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    long_description: Optional[str] = None
    image: Optional[str] = None
    technologies: Optional[List[str]] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    featured: Optional[bool] = None
    category: Optional[str] = None
    order: Optional[int] = None

# Certification Models
class Certification(BaseDocument):
    name: str
    issuer: str
    date: str
    credential_id: Optional[str] = None
    image: Optional[str] = None
    url: Optional[str] = None
    order: int = 0

class CertificationCreate(BaseModel):
    name: str
    issuer: str
    date: str
    credential_id: Optional[str] = None
    image: Optional[str] = None
    url: Optional[str] = None
    order: int = 0

class CertificationUpdate(BaseModel):
    name: Optional[str] = None
    issuer: Optional[str] = None
    date: Optional[str] = None
    credential_id: Optional[str] = None
    image: Optional[str] = None
    url: Optional[str] = None
    order: Optional[int] = None

# Testimonial Models
class Testimonial(BaseDocument):
    name: str
    position: str
    company: str
    avatar: Optional[str] = None
    quote: str
    rating: int = 5  # 1-5
    order: int = 0

class TestimonialCreate(BaseModel):
    name: str
    position: str
    company: str
    avatar: Optional[str] = None
    quote: str
    rating: int = 5
    order: int = 0

class TestimonialUpdate(BaseModel):
    name: Optional[str] = None
    position: Optional[str] = None
    company: Optional[str] = None
    avatar: Optional[str] = None
    quote: Optional[str] = None
    rating: Optional[int] = None
    order: Optional[int] = None

# Blog Models
class BlogArticle(BaseDocument):
    title: str
    excerpt: str
    content: str
    publish_date: datetime
    read_time: str
    tags: List[str] = []
    image: Optional[str] = None
    featured: bool = False
    published: bool = True

class BlogArticleCreate(BaseModel):
    title: str
    excerpt: str
    content: str
    publish_date: datetime = Field(default_factory=datetime.utcnow)
    read_time: str
    tags: List[str] = []
    image: Optional[str] = None
    featured: bool = False
    published: bool = True

class BlogArticleUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    publish_date: Optional[datetime] = None
    read_time: Optional[str] = None
    tags: Optional[List[str]] = None
    image: Optional[str] = None
    featured: Optional[bool] = None
    published: Optional[bool] = None

# Settings Models
class SEOSettings(BaseModel):
    title: str = "Portfolio"
    description: str = "Personal portfolio website"
    keywords: str = "portfolio, developer, web development"
    og_image: Optional[str] = None

class AnalyticsSettings(BaseModel):
    google_analytics_id: Optional[str] = None
    enabled: bool = False

class SectionSettings(BaseModel):
    enabled: bool = True
    order: int = 0

class SiteSettings(BaseModel):
    theme: str = "light"  # light, dark, auto
    primary_color: str = "#000000"
    secondary_color: str = "#666666"
    accent_color: str = "#0066cc"
    font: str = "Inter"
    language: str = "en"
    seo: SEOSettings = SEOSettings()
    analytics: AnalyticsSettings = AnalyticsSettings()
    blog_enabled: bool = True
    sections: Dict[str, SectionSettings] = {
        "hero": SectionSettings(order=1),
        "about": SectionSettings(order=2),
        "experience": SectionSettings(order=3),
        "education": SectionSettings(order=4),
        "skills": SectionSettings(order=5),
        "projects": SectionSettings(order=6),
        "certifications": SectionSettings(order=7),
        "testimonials": SectionSettings(order=8),
        "blog": SectionSettings(order=9),
        "contact": SectionSettings(order=10)
    }
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class SiteSettingsUpdate(BaseModel):
    theme: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    accent_color: Optional[str] = None
    font: Optional[str] = None
    language: Optional[str] = None
    seo: Optional[SEOSettings] = None
    analytics: Optional[AnalyticsSettings] = None
    blog_enabled: Optional[bool] = None
    sections: Optional[Dict[str, SectionSettings]] = None

# Contact Form Models
class ContactMessage(BaseDocument):
    name: str
    email: str
    subject: str
    message: str
    read: bool = False

class ContactMessageCreate(BaseModel):
    name: str
    email: str
    subject: str
    message: str

# File Upload Models
class UploadedFile(BaseModel):
    filename: str
    original_filename: str
    file_path: str
    file_size: int
    mime_type: str
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)

# Response Models
class MessageResponse(BaseModel):
    message: str
    data: Optional[Any] = None

class ListResponse(BaseModel):
    items: List[Any]
    total: int
    page: int = 1
    per_page: int = 50