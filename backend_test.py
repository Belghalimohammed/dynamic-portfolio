#!/usr/bin/env python3
"""
Comprehensive Backend API Test Suite for Portfolio Application
Tests all public and admin endpoints with authentication
"""

import requests
import json
import os
from datetime import datetime
from typing import Dict, Any, Optional

# Get backend URL from frontend .env
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except FileNotFoundError:
        pass
    return "http://localhost:8001"

BASE_URL = get_backend_url()
API_URL = f"{BASE_URL}/api"

class PortfolioAPITester:
    def __init__(self):
        self.base_url = API_URL
        self.auth_token = None
        self.test_results = []
        self.session = requests.Session()
        
    def log_test(self, test_name: str, success: bool, message: str = "", response_data: Any = None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat()
        }
        if response_data and not success:
            result["response"] = str(response_data)[:500]  # Limit response size
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if message:
            print(f"    {message}")
        if not success and response_data:
            print(f"    Response: {str(response_data)[:200]}...")
    
    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/")
            if response.status_code == 200:
                data = response.json()
                if "Portfolio API" in data.get("message", ""):
                    self.log_test("API Root", True, f"API version: {data.get('message')}")
                else:
                    self.log_test("API Root", False, f"Unexpected response: {data}")
            else:
                self.log_test("API Root", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("API Root", False, f"Exception: {str(e)}")
    
    def test_authentication(self):
        """Test authentication with default admin credentials"""
        try:
            login_data = {
                "email": "admin@portfolio.com",
                "password": "admin123"
            }
            
            response = self.session.post(f"{self.base_url}/auth/login", json=login_data)
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data:
                    self.auth_token = data["access_token"]
                    user_info = data.get("user", {})
                    self.log_test("Authentication - Login", True, 
                                f"Logged in as: {user_info.get('name')} ({user_info.get('email')})")
                    
                    # Set authorization header for future requests
                    self.session.headers.update({"Authorization": f"Bearer {self.auth_token}"})
                    
                    # Test /auth/me endpoint
                    me_response = self.session.get(f"{self.base_url}/auth/me")
                    if me_response.status_code == 200:
                        me_data = me_response.json()
                        self.log_test("Authentication - Get Current User", True, 
                                    f"User: {me_data.get('name')} - Role: {me_data.get('role')}")
                    else:
                        self.log_test("Authentication - Get Current User", False, 
                                    f"Status: {me_response.status_code}", me_response.text)
                else:
                    self.log_test("Authentication - Login", False, "No access token in response", data)
            else:
                self.log_test("Authentication - Login", False, f"Status: {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Authentication - Login", False, f"Exception: {str(e)}")
    
    def test_public_endpoints(self):
        """Test all public portfolio endpoints"""
        public_endpoints = [
            ("Hero Section", "/portfolio/hero"),
            ("About Section", "/portfolio/about"),
            ("Education", "/portfolio/education"),
            ("Experience", "/portfolio/experience"),
            ("Skills", "/portfolio/skills"),
            ("Projects", "/portfolio/projects"),
            ("Certifications", "/portfolio/certifications"),
            ("Testimonials", "/portfolio/testimonials"),
            ("Blog Articles", "/portfolio/blog"),
            ("Site Settings", "/portfolio/settings")
        ]
        
        for name, endpoint in public_endpoints:
            try:
                response = self.session.get(f"{self.base_url}{endpoint}")
                if response.status_code == 200:
                    data = response.json()
                    # Check if we got valid data structure
                    if isinstance(data, (dict, list)):
                        self.log_test(f"Public - {name}", True, f"Retrieved {type(data).__name__}")
                    else:
                        self.log_test(f"Public - {name}", False, f"Invalid data type: {type(data)}")
                else:
                    self.log_test(f"Public - {name}", False, f"Status: {response.status_code}", response.text)
            except Exception as e:
                self.log_test(f"Public - {name}", False, f"Exception: {str(e)}")
    
    def test_contact_form(self):
        """Test contact form submission"""
        try:
            contact_data = {
                "name": "John Smith",
                "email": "john.smith@example.com",
                "subject": "Portfolio Inquiry",
                "message": "I'm interested in discussing a potential project collaboration."
            }
            
            response = self.session.post(f"{self.base_url}/contact", json=contact_data)
            if response.status_code == 200:
                data = response.json()
                if "Message sent successfully" in data.get("message", ""):
                    self.log_test("Contact Form", True, "Contact message submitted successfully")
                else:
                    self.log_test("Contact Form", False, f"Unexpected response: {data}")
            else:
                self.log_test("Contact Form", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Contact Form", False, f"Exception: {str(e)}")
    
    def test_admin_endpoints_without_auth(self):
        """Test that admin endpoints require authentication"""
        # Temporarily remove auth header
        auth_header = self.session.headers.pop("Authorization", None)
        
        admin_endpoints = [
            "/admin/hero",
            "/admin/about",
            "/admin/education",
            "/admin/settings"
        ]
        
        for endpoint in admin_endpoints:
            try:
                response = self.session.put(f"{self.base_url}{endpoint}", json={})
                if response.status_code == 401:
                    self.log_test(f"Auth Protection - {endpoint}", True, "Correctly requires authentication")
                else:
                    self.log_test(f"Auth Protection - {endpoint}", False, 
                                f"Expected 401, got {response.status_code}")
            except Exception as e:
                self.log_test(f"Auth Protection - {endpoint}", False, f"Exception: {str(e)}")
        
        # Restore auth header
        if auth_header:
            self.session.headers["Authorization"] = auth_header
    
    def test_admin_hero_update(self):
        """Test hero section update"""
        if not self.auth_token:
            self.log_test("Admin - Hero Update", False, "No auth token available")
            return
            
        try:
            hero_data = {
                "name": "Alex Johnson",
                "job_title": "Senior Full Stack Developer",
                "tagline": "Building innovative web solutions with modern technologies"
            }
            
            response = self.session.put(f"{self.base_url}/admin/hero", json=hero_data)
            if response.status_code == 200:
                data = response.json()
                if data.get("name") == hero_data["name"]:
                    self.log_test("Admin - Hero Update", True, f"Updated hero: {data.get('name')}")
                else:
                    self.log_test("Admin - Hero Update", False, f"Data mismatch: {data}")
            else:
                self.log_test("Admin - Hero Update", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Admin - Hero Update", False, f"Exception: {str(e)}")
    
    def test_admin_about_update(self):
        """Test about section update"""
        if not self.auth_token:
            self.log_test("Admin - About Update", False, "No auth token available")
            return
            
        try:
            about_data = {
                "description": "Passionate full-stack developer with 5+ years of experience",
                "location": "San Francisco, CA",
                "years_of_experience": 5,
                "projects_completed": 25
            }
            
            response = self.session.put(f"{self.base_url}/admin/about", json=about_data)
            if response.status_code == 200:
                data = response.json()
                if data.get("years_of_experience") == about_data["years_of_experience"]:
                    self.log_test("Admin - About Update", True, f"Updated about section")
                else:
                    self.log_test("Admin - About Update", False, f"Data mismatch: {data}")
            else:
                self.log_test("Admin - About Update", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Admin - About Update", False, f"Exception: {str(e)}")
    
    def test_education_crud(self):
        """Test education CRUD operations"""
        if not self.auth_token:
            self.log_test("Admin - Education CRUD", False, "No auth token available")
            return
        
        education_id = None
        
        try:
            # CREATE
            education_data = {
                "degree": "Master of Science in Computer Science",
                "institution": "Stanford University",
                "location": "Stanford, CA",
                "duration": "2018-2020",
                "gpa": "3.8/4.0",
                "description": "Specialized in Machine Learning and Distributed Systems",
                "order": 1
            }
            
            response = self.session.post(f"{self.base_url}/admin/education", json=education_data)
            if response.status_code == 200:
                data = response.json()
                education_id = data.get("id")
                self.log_test("Admin - Education Create", True, f"Created education: {data.get('degree')}")
                
                # UPDATE
                update_data = {
                    "gpa": "3.9/4.0",
                    "description": "Specialized in Machine Learning, AI, and Distributed Systems"
                }
                
                update_response = self.session.put(f"{self.base_url}/admin/education/{education_id}", 
                                                 json=update_data)
                if update_response.status_code == 200:
                    updated_data = update_response.json()
                    if updated_data.get("gpa") == "3.9/4.0":
                        self.log_test("Admin - Education Update", True, "Updated education entry")
                    else:
                        self.log_test("Admin - Education Update", False, f"Update failed: {updated_data}")
                else:
                    self.log_test("Admin - Education Update", False, 
                                f"Status: {update_response.status_code}", update_response.text)
                
                # DELETE
                delete_response = self.session.delete(f"{self.base_url}/admin/education/{education_id}")
                if delete_response.status_code == 200:
                    self.log_test("Admin - Education Delete", True, "Deleted education entry")
                else:
                    self.log_test("Admin - Education Delete", False, 
                                f"Status: {delete_response.status_code}", delete_response.text)
            else:
                self.log_test("Admin - Education Create", False, f"Status: {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Admin - Education CRUD", False, f"Exception: {str(e)}")
    
    def test_experience_crud(self):
        """Test experience CRUD operations"""
        if not self.auth_token:
            self.log_test("Admin - Experience CRUD", False, "No auth token available")
            return
        
        experience_id = None
        
        try:
            # CREATE
            experience_data = {
                "position": "Senior Software Engineer",
                "company": "Tech Innovations Inc.",
                "location": "San Francisco, CA",
                "duration": "2021-Present",
                "type": "Full-time",
                "description": "Lead development of scalable web applications",
                "achievements": [
                    "Improved system performance by 40%",
                    "Led team of 5 developers"
                ],
                "technologies": ["React", "Node.js", "Python", "AWS"],
                "order": 1
            }
            
            response = self.session.post(f"{self.base_url}/admin/experience", json=experience_data)
            if response.status_code == 200:
                data = response.json()
                experience_id = data.get("id")
                self.log_test("Admin - Experience Create", True, f"Created experience: {data.get('position')}")
                
                # UPDATE
                update_data = {
                    "achievements": [
                        "Improved system performance by 50%",
                        "Led team of 8 developers",
                        "Implemented CI/CD pipeline"
                    ]
                }
                
                update_response = self.session.put(f"{self.base_url}/admin/experience/{experience_id}", 
                                                 json=update_data)
                if update_response.status_code == 200:
                    self.log_test("Admin - Experience Update", True, "Updated experience entry")
                else:
                    self.log_test("Admin - Experience Update", False, 
                                f"Status: {update_response.status_code}", update_response.text)
                
                # DELETE
                delete_response = self.session.delete(f"{self.base_url}/admin/experience/{experience_id}")
                if delete_response.status_code == 200:
                    self.log_test("Admin - Experience Delete", True, "Deleted experience entry")
                else:
                    self.log_test("Admin - Experience Delete", False, 
                                f"Status: {delete_response.status_code}", delete_response.text)
            else:
                self.log_test("Admin - Experience Create", False, f"Status: {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Admin - Experience CRUD", False, f"Exception: {str(e)}")
    
    def test_skills_update(self):
        """Test skills update"""
        if not self.auth_token:
            self.log_test("Admin - Skills Update", False, "No auth token available")
            return
            
        try:
            skills_data = {
                "technical": [
                    {"name": "JavaScript", "level": 95, "category": "Frontend"},
                    {"name": "Python", "level": 90, "category": "Backend"},
                    {"name": "React", "level": 92, "category": "Frontend"},
                    {"name": "Node.js", "level": 88, "category": "Backend"}
                ],
                "soft": [
                    "Leadership",
                    "Problem Solving",
                    "Communication",
                    "Team Collaboration"
                ]
            }
            
            response = self.session.put(f"{self.base_url}/admin/skills", json=skills_data)
            if response.status_code == 200:
                data = response.json()
                if len(data.get("technical", [])) == 4:
                    self.log_test("Admin - Skills Update", True, f"Updated skills with {len(data['technical'])} technical skills")
                else:
                    self.log_test("Admin - Skills Update", False, f"Skills count mismatch: {data}")
            else:
                self.log_test("Admin - Skills Update", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Admin - Skills Update", False, f"Exception: {str(e)}")
    
    def test_projects_crud(self):
        """Test projects CRUD operations"""
        if not self.auth_token:
            self.log_test("Admin - Projects CRUD", False, "No auth token available")
            return
        
        project_id = None
        
        try:
            # CREATE
            project_data = {
                "title": "E-Commerce Platform",
                "description": "Full-stack e-commerce solution with modern UI",
                "long_description": "A comprehensive e-commerce platform built with React, Node.js, and MongoDB. Features include user authentication, product catalog, shopping cart, payment integration, and admin dashboard.",
                "technologies": ["React", "Node.js", "MongoDB", "Stripe", "AWS"],
                "github_url": "https://github.com/alexjohnson/ecommerce-platform",
                "live_url": "https://ecommerce-demo.alexjohnson.dev",
                "featured": True,
                "category": "Web Application",
                "order": 1
            }
            
            response = self.session.post(f"{self.base_url}/admin/projects", json=project_data)
            if response.status_code == 200:
                data = response.json()
                project_id = data.get("id")
                self.log_test("Admin - Projects Create", True, f"Created project: {data.get('title')}")
                
                # UPDATE
                update_data = {
                    "description": "Advanced full-stack e-commerce solution with modern UI/UX",
                    "featured": False
                }
                
                update_response = self.session.put(f"{self.base_url}/admin/projects/{project_id}", 
                                                 json=update_data)
                if update_response.status_code == 200:
                    self.log_test("Admin - Projects Update", True, "Updated project entry")
                else:
                    self.log_test("Admin - Projects Update", False, 
                                f"Status: {update_response.status_code}", update_response.text)
                
                # DELETE
                delete_response = self.session.delete(f"{self.base_url}/admin/projects/{project_id}")
                if delete_response.status_code == 200:
                    self.log_test("Admin - Projects Delete", True, "Deleted project entry")
                else:
                    self.log_test("Admin - Projects Delete", False, 
                                f"Status: {delete_response.status_code}", delete_response.text)
            else:
                self.log_test("Admin - Projects Create", False, f"Status: {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Admin - Projects CRUD", False, f"Exception: {str(e)}")
    
    def test_certifications_crud(self):
        """Test certifications CRUD operations"""
        if not self.auth_token:
            self.log_test("Admin - Certifications CRUD", False, "No auth token available")
            return
        
        cert_id = None
        
        try:
            # CREATE
            cert_data = {
                "name": "AWS Certified Solutions Architect",
                "issuer": "Amazon Web Services",
                "date": "2023-06-15",
                "credential_id": "AWS-SAA-2023-001234",
                "url": "https://aws.amazon.com/certification/",
                "order": 1
            }
            
            response = self.session.post(f"{self.base_url}/admin/certifications", json=cert_data)
            if response.status_code == 200:
                data = response.json()
                cert_id = data.get("id")
                self.log_test("Admin - Certifications Create", True, f"Created certification: {data.get('name')}")
                
                # UPDATE
                update_data = {
                    "credential_id": "AWS-SAA-2023-001235"
                }
                
                update_response = self.session.put(f"{self.base_url}/admin/certifications/{cert_id}", 
                                                 json=update_data)
                if update_response.status_code == 200:
                    self.log_test("Admin - Certifications Update", True, "Updated certification entry")
                else:
                    self.log_test("Admin - Certifications Update", False, 
                                f"Status: {update_response.status_code}", update_response.text)
                
                # DELETE
                delete_response = self.session.delete(f"{self.base_url}/admin/certifications/{cert_id}")
                if delete_response.status_code == 200:
                    self.log_test("Admin - Certifications Delete", True, "Deleted certification entry")
                else:
                    self.log_test("Admin - Certifications Delete", False, 
                                f"Status: {delete_response.status_code}", delete_response.text)
            else:
                self.log_test("Admin - Certifications Create", False, f"Status: {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Admin - Certifications CRUD", False, f"Exception: {str(e)}")
    
    def test_testimonials_crud(self):
        """Test testimonials CRUD operations"""
        if not self.auth_token:
            self.log_test("Admin - Testimonials CRUD", False, "No auth token available")
            return
        
        testimonial_id = None
        
        try:
            # CREATE
            testimonial_data = {
                "name": "Sarah Wilson",
                "position": "Product Manager",
                "company": "TechCorp Solutions",
                "quote": "Alex delivered exceptional results on our project. His technical expertise and attention to detail were outstanding.",
                "rating": 5,
                "order": 1
            }
            
            response = self.session.post(f"{self.base_url}/admin/testimonials", json=testimonial_data)
            if response.status_code == 200:
                data = response.json()
                testimonial_id = data.get("id")
                self.log_test("Admin - Testimonials Create", True, f"Created testimonial from: {data.get('name')}")
                
                # UPDATE
                update_data = {
                    "rating": 4,
                    "quote": "Alex delivered excellent results on our project. His technical skills were impressive."
                }
                
                update_response = self.session.put(f"{self.base_url}/admin/testimonials/{testimonial_id}", 
                                                 json=update_data)
                if update_response.status_code == 200:
                    self.log_test("Admin - Testimonials Update", True, "Updated testimonial entry")
                else:
                    self.log_test("Admin - Testimonials Update", False, 
                                f"Status: {update_response.status_code}", update_response.text)
                
                # DELETE
                delete_response = self.session.delete(f"{self.base_url}/admin/testimonials/{testimonial_id}")
                if delete_response.status_code == 200:
                    self.log_test("Admin - Testimonials Delete", True, "Deleted testimonial entry")
                else:
                    self.log_test("Admin - Testimonials Delete", False, 
                                f"Status: {delete_response.status_code}", delete_response.text)
            else:
                self.log_test("Admin - Testimonials Create", False, f"Status: {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Admin - Testimonials CRUD", False, f"Exception: {str(e)}")
    
    def test_blog_crud(self):
        """Test blog articles CRUD operations"""
        if not self.auth_token:
            self.log_test("Admin - Blog CRUD", False, "No auth token available")
            return
        
        article_id = None
        
        try:
            # CREATE
            article_data = {
                "title": "Building Scalable Web Applications with React and Node.js",
                "excerpt": "Learn best practices for creating scalable full-stack applications",
                "content": "In this article, we'll explore the key principles and patterns for building scalable web applications using React for the frontend and Node.js for the backend...",
                "read_time": "8 min read",
                "tags": ["React", "Node.js", "Web Development", "Scalability"],
                "featured": True,
                "published": True
            }
            
            response = self.session.post(f"{self.base_url}/admin/blog/articles", json=article_data)
            if response.status_code == 200:
                data = response.json()
                article_id = data.get("id")
                self.log_test("Admin - Blog Create", True, f"Created article: {data.get('title')[:50]}...")
                
                # UPDATE
                update_data = {
                    "excerpt": "Comprehensive guide to building scalable full-stack applications",
                    "featured": False
                }
                
                update_response = self.session.put(f"{self.base_url}/admin/blog/articles/{article_id}", 
                                                 json=update_data)
                if update_response.status_code == 200:
                    self.log_test("Admin - Blog Update", True, "Updated blog article")
                else:
                    self.log_test("Admin - Blog Update", False, 
                                f"Status: {update_response.status_code}", update_response.text)
                
                # DELETE
                delete_response = self.session.delete(f"{self.base_url}/admin/blog/articles/{article_id}")
                if delete_response.status_code == 200:
                    self.log_test("Admin - Blog Delete", True, "Deleted blog article")
                else:
                    self.log_test("Admin - Blog Delete", False, 
                                f"Status: {delete_response.status_code}", delete_response.text)
            else:
                self.log_test("Admin - Blog Create", False, f"Status: {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Admin - Blog CRUD", False, f"Exception: {str(e)}")
    
    def test_settings_update(self):
        """Test site settings update"""
        if not self.auth_token:
            self.log_test("Admin - Settings Update", False, "No auth token available")
            return
            
        try:
            settings_data = {
                "theme": "dark",
                "primary_color": "#1a1a1a",
                "accent_color": "#0066ff",
                "font": "Roboto",
                "seo": {
                    "title": "Alex Johnson - Full Stack Developer",
                    "description": "Professional portfolio of Alex Johnson, experienced full-stack developer",
                    "keywords": "full-stack developer, web development, React, Node.js"
                }
            }
            
            response = self.session.put(f"{self.base_url}/admin/settings", json=settings_data)
            if response.status_code == 200:
                data = response.json()
                if data.get("theme") == "dark":
                    self.log_test("Admin - Settings Update", True, f"Updated settings: theme={data.get('theme')}")
                else:
                    self.log_test("Admin - Settings Update", False, f"Settings mismatch: {data}")
            else:
                self.log_test("Admin - Settings Update", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Admin - Settings Update", False, f"Exception: {str(e)}")
    
    def test_contact_messages_admin(self):
        """Test admin contact messages endpoint"""
        if not self.auth_token:
            self.log_test("Admin - Contact Messages", False, "No auth token available")
            return
            
        try:
            response = self.session.get(f"{self.base_url}/admin/contact-messages")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Admin - Contact Messages", True, f"Retrieved {len(data)} contact messages")
                else:
                    self.log_test("Admin - Contact Messages", False, f"Expected list, got: {type(data)}")
            else:
                self.log_test("Admin - Contact Messages", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Admin - Contact Messages", False, f"Exception: {str(e)}")
    
    def test_file_operations(self):
        """Test file upload and management operations"""
        if not self.auth_token:
            self.log_test("Admin - File Operations", False, "No auth token available")
            return
            
        try:
            # Test list files endpoint
            response = self.session.get(f"{self.base_url}/admin/files")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Admin - List Files", True, f"Retrieved {len(data)} files")
                else:
                    self.log_test("Admin - List Files", False, f"Expected list, got: {type(data)}")
            else:
                self.log_test("Admin - List Files", False, f"Status: {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Admin - File Operations", False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print(f"🚀 Starting Portfolio API Tests")
        print(f"📍 Testing API at: {self.base_url}")
        print("=" * 60)
        
        # Basic connectivity
        self.test_api_root()
        
        # Authentication
        self.test_authentication()
        
        # Public endpoints
        self.test_public_endpoints()
        self.test_contact_form()
        
        # Auth protection
        self.test_admin_endpoints_without_auth()
        
        # Admin endpoints (require auth)
        if self.auth_token:
            self.test_admin_hero_update()
            self.test_admin_about_update()
            self.test_education_crud()
            self.test_experience_crud()
            self.test_skills_update()
            self.test_projects_crud()
            self.test_certifications_crud()
            self.test_testimonials_crud()
            self.test_blog_crud()
            self.test_settings_update()
            self.test_contact_messages_admin()
            self.test_file_operations()
        
        # Print summary
        self.print_summary()
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result["success"])
        failed = len(self.test_results) - passed
        
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"📈 Success Rate: {(passed/len(self.test_results)*100):.1f}%")
        
        if failed > 0:
            print(f"\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"   • {result['test']}: {result['message']}")
        
        print("\n" + "=" * 60)
        return passed, failed

def main():
    """Main test execution"""
    tester = PortfolioAPITester()
    tester.run_all_tests()
    
    # Return exit code based on test results
    passed, failed = tester.print_summary()
    return 0 if failed == 0 else 1

if __name__ == "__main__":
    exit(main())