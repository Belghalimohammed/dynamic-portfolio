import os
from motor.motor_asyncio import AsyncIOMotorClient
from models import *
from datetime import datetime

class Database:
    def __init__(self, mongo_url: str, db_name: str):
        self.client = AsyncIOMotorClient(mongo_url)
        self.db = self.client[db_name]
    
    async def close(self):
        self.client.close()
    
    # Hero Section Methods
    async def get_hero(self) -> HeroSection:
        data = await self.db.hero.find_one()
        if not data:
            # Create default hero section
            default_hero = HeroSection(
                name="Your Name",
                job_title="Your Job Title",
                tagline="Your professional tagline"
            )
            await self.db.hero.replace_one({}, default_hero.dict(), upsert=True)
            return default_hero
        return HeroSection(**data)
    
    async def update_hero(self, hero_data: HeroUpdate) -> HeroSection:
        update_data = {k: v for k, v in hero_data.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        await self.db.hero.update_one({}, {"$set": update_data}, upsert=True)
        return await self.get_hero()
    
    # About Section Methods
    async def get_about(self) -> AboutSection:
        data = await self.db.about.find_one()
        if not data:
            default_about = AboutSection(
                description="Your professional description",
                long_description="Additional details about yourself",
                location="Your Location",
                years_of_experience=0,
                projects_completed=0
            )
            await self.db.about.replace_one({}, default_about.dict(), upsert=True)
            return default_about
        return AboutSection(**data)
    
    async def update_about(self, about_data: AboutUpdate) -> AboutSection:
        update_data = {k: v for k, v in about_data.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        await self.db.about.update_one({}, {"$set": update_data}, upsert=True)
        return await self.get_about()
    
    # Education Methods
    async def get_education(self) -> List[Education]:
        cursor = self.db.education.find().sort("order", 1)
        education_list = await cursor.to_list(length=None)
        return [Education(**edu) for edu in education_list]
    
    async def create_education(self, education_data: EducationCreate) -> Education:
        education = Education(**education_data.dict())
        await self.db.education.insert_one(education.dict())
        return education
    
    async def update_education(self, edu_id: str, education_data: EducationUpdate) -> Education:
        update_data = {k: v for k, v in education_data.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        result = await self.db.education.update_one(
            {"id": edu_id}, {"$set": update_data}
        )
        if result.matched_count == 0:
            raise ValueError("Education entry not found")
        
        edu_data = await self.db.education.find_one({"id": edu_id})
        return Education(**edu_data)
    
    async def delete_education(self, edu_id: str) -> bool:
        result = await self.db.education.delete_one({"id": edu_id})
        return result.deleted_count > 0
    
    # Experience Methods
    async def get_experience(self) -> List[Experience]:
        cursor = self.db.experience.find().sort("order", 1)
        experience_list = await cursor.to_list(length=None)
        return [Experience(**exp) for exp in experience_list]
    
    async def create_experience(self, experience_data: ExperienceCreate) -> Experience:
        experience = Experience(**experience_data.dict())
        await self.db.experience.insert_one(experience.dict())
        return experience
    
    async def update_experience(self, exp_id: str, experience_data: ExperienceUpdate) -> Experience:
        update_data = {k: v for k, v in experience_data.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        result = await self.db.experience.update_one(
            {"id": exp_id}, {"$set": update_data}
        )
        if result.matched_count == 0:
            raise ValueError("Experience entry not found")
        
        exp_data = await self.db.experience.find_one({"id": exp_id})
        return Experience(**exp_data)
    
    async def delete_experience(self, exp_id: str) -> bool:
        result = await self.db.experience.delete_one({"id": exp_id})
        return result.deleted_count > 0
    
    # Skills Methods
    async def get_skills(self) -> Skills:
        data = await self.db.skills.find_one()
        if not data:
            default_skills = Skills()
            await self.db.skills.replace_one({}, default_skills.dict(), upsert=True)
            return default_skills
        return Skills(**data)
    
    async def update_skills(self, skills_data: SkillsUpdate) -> Skills:
        update_data = {k: v for k, v in skills_data.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        await self.db.skills.update_one({}, {"$set": update_data}, upsert=True)
        return await self.get_skills()
    
    # Projects Methods
    async def get_projects(self) -> List[Project]:
        cursor = self.db.projects.find().sort("order", 1)
        projects_list = await cursor.to_list(length=None)
        return [Project(**proj) for proj in projects_list]
    
    async def create_project(self, project_data: ProjectCreate) -> Project:
        project = Project(**project_data.dict())
        await self.db.projects.insert_one(project.dict())
        return project
    
    async def update_project(self, proj_id: str, project_data: ProjectUpdate) -> Project:
        update_data = {k: v for k, v in project_data.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        result = await self.db.projects.update_one(
            {"id": proj_id}, {"$set": update_data}
        )
        if result.matched_count == 0:
            raise ValueError("Project not found")
        
        proj_data = await self.db.projects.find_one({"id": proj_id})
        return Project(**proj_data)
    
    async def delete_project(self, proj_id: str) -> bool:
        result = await self.db.projects.delete_one({"id": proj_id})
        return result.deleted_count > 0
    
    # Certifications Methods
    async def get_certifications(self) -> List[Certification]:
        cursor = self.db.certifications.find().sort("order", 1)
        certs_list = await cursor.to_list(length=None)
        return [Certification(**cert) for cert in certs_list]
    
    async def create_certification(self, cert_data: CertificationCreate) -> Certification:
        certification = Certification(**cert_data.dict())
        await self.db.certifications.insert_one(certification.dict())
        return certification
    
    async def update_certification(self, cert_id: str, cert_data: CertificationUpdate) -> Certification:
        update_data = {k: v for k, v in cert_data.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        result = await self.db.certifications.update_one(
            {"id": cert_id}, {"$set": update_data}
        )
        if result.matched_count == 0:
            raise ValueError("Certification not found")
        
        cert_data = await self.db.certifications.find_one({"id": cert_id})
        return Certification(**cert_data)
    
    async def delete_certification(self, cert_id: str) -> bool:
        result = await self.db.certifications.delete_one({"id": cert_id})
        return result.deleted_count > 0
    
    # Testimonials Methods
    async def get_testimonials(self) -> List[Testimonial]:
        cursor = self.db.testimonials.find().sort("order", 1)
        testimonials_list = await cursor.to_list(length=None)
        return [Testimonial(**test) for test in testimonials_list]
    
    async def create_testimonial(self, testimonial_data: TestimonialCreate) -> Testimonial:
        testimonial = Testimonial(**testimonial_data.dict())
        await self.db.testimonials.insert_one(testimonial.dict())
        return testimonial
    
    async def update_testimonial(self, test_id: str, testimonial_data: TestimonialUpdate) -> Testimonial:
        update_data = {k: v for k, v in testimonial_data.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        result = await self.db.testimonials.update_one(
            {"id": test_id}, {"$set": update_data}
        )
        if result.matched_count == 0:
            raise ValueError("Testimonial not found")
        
        test_data = await self.db.testimonials.find_one({"id": test_id})
        return Testimonial(**test_data)
    
    async def delete_testimonial(self, test_id: str) -> bool:
        result = await self.db.testimonials.delete_one({"id": test_id})
        return result.deleted_count > 0
    
    # Blog Methods
    async def get_blog_articles(self) -> List[BlogArticle]:
        cursor = self.db.blog_articles.find().sort("publish_date", -1)
        articles_list = await cursor.to_list(length=None)
        return [BlogArticle(**article) for article in articles_list]
    
    async def create_blog_article(self, article_data: BlogArticleCreate) -> BlogArticle:
        article = BlogArticle(**article_data.dict())
        await self.db.blog_articles.insert_one(article.dict())
        return article
    
    async def update_blog_article(self, article_id: str, article_data: BlogArticleUpdate) -> BlogArticle:
        update_data = {k: v for k, v in article_data.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        result = await self.db.blog_articles.update_one(
            {"id": article_id}, {"$set": update_data}
        )
        if result.matched_count == 0:
            raise ValueError("Blog article not found")
        
        article_data = await self.db.blog_articles.find_one({"id": article_id})
        return BlogArticle(**article_data)
    
    async def delete_blog_article(self, article_id: str) -> bool:
        result = await self.db.blog_articles.delete_one({"id": article_id})
        return result.deleted_count > 0
    
    # Settings Methods
    async def get_settings(self) -> SiteSettings:
        data = await self.db.settings.find_one()
        if not data:
            default_settings = SiteSettings()
            await self.db.settings.replace_one({}, default_settings.dict(), upsert=True)
            return default_settings
        return SiteSettings(**data)
    
    async def update_settings(self, settings_data: SiteSettingsUpdate) -> SiteSettings:
        update_data = {k: v for k, v in settings_data.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        await self.db.settings.update_one({}, {"$set": update_data}, upsert=True)
        return await self.get_settings()
    
    # Contact Messages Methods
    async def create_contact_message(self, message_data: ContactMessageCreate) -> ContactMessage:
        message = ContactMessage(**message_data.dict())
        await self.db.contact_messages.insert_one(message.dict())
        return message
    
    async def get_contact_messages(self) -> List[ContactMessage]:
        cursor = self.db.contact_messages.find().sort("created_at", -1)
        messages_list = await cursor.to_list(length=None)
        return [ContactMessage(**msg) for msg in messages_list]