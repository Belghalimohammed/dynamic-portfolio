# Portfolio API Contracts & Integration Plan

## Overview
This document outlines the API contracts for the portfolio application backend and the integration plan to replace mock data with real backend APIs.

## Backend API Endpoints

### Authentication
```
POST /api/auth/login
POST /api/auth/logout  
GET /api/auth/me
```

### Portfolio Content Management

#### Hero Section
```
GET /api/hero - Get hero section data
PUT /api/hero - Update hero section
POST /api/hero/upload-profile - Upload profile image
POST /api/hero/upload-background - Upload background image
```

#### About Section
```
GET /api/about - Get about section data
PUT /api/about - Update about section
```

#### Education
```
GET /api/education - Get all education entries
POST /api/education - Create new education entry
PUT /api/education/:id - Update education entry
DELETE /api/education/:id - Delete education entry
```

#### Work Experience
```
GET /api/experience - Get all work experiences
POST /api/experience - Create new experience
PUT /api/experience/:id - Update experience
DELETE /api/experience/:id - Delete experience
```

#### Skills
```
GET /api/skills - Get all skills (technical & soft)
PUT /api/skills - Update skills data
POST /api/skills/technical - Add technical skill
PUT /api/skills/technical/:id - Update technical skill
DELETE /api/skills/technical/:id - Delete technical skill
POST /api/skills/soft - Add soft skill
DELETE /api/skills/soft/:index - Delete soft skill
```

#### Projects
```
GET /api/projects - Get all projects
POST /api/projects - Create new project
PUT /api/projects/:id - Update project
DELETE /api/projects/:id - Delete project
POST /api/projects/:id/upload-image - Upload project image
```

#### Certifications
```
GET /api/certifications - Get all certifications
POST /api/certifications - Create new certification
PUT /api/certifications/:id - Update certification
DELETE /api/certifications/:id - Delete certification
POST /api/certifications/:id/upload-image - Upload certification image
```

#### Testimonials
```
GET /api/testimonials - Get all testimonials
POST /api/testimonials - Create new testimonial
PUT /api/testimonials/:id - Update testimonial
DELETE /api/testimonials/:id - Delete testimonial
POST /api/testimonials/:id/upload-avatar - Upload testimonial avatar
```

#### Blog/Articles
```
GET /api/blog - Get blog settings and articles
PUT /api/blog/settings - Update blog settings (enabled/disabled)
GET /api/blog/articles - Get all articles
POST /api/blog/articles - Create new article
PUT /api/blog/articles/:id - Update article
DELETE /api/blog/articles/:id - Delete article
POST /api/blog/articles/:id/upload-image - Upload article image
```

### Design & Settings Management

#### Site Settings
```
GET /api/settings - Get all site settings
PUT /api/settings - Update site settings
PUT /api/settings/theme - Update theme settings
PUT /api/settings/seo - Update SEO settings
PUT /api/settings/social - Update social media links
```

#### Section Management
```
GET /api/sections - Get section order and visibility
PUT /api/sections/order - Update section order
PUT /api/sections/visibility - Toggle section visibility
```

#### File Upload
```
POST /api/upload - General file upload endpoint
DELETE /api/upload/:filename - Delete uploaded file
GET /api/files - List all uploaded files
```

## Data Models

### User (Admin)
```javascript
{
  id: string,
  email: string,
  password: string (hashed),
  name: string,
  role: 'admin',
  createdAt: datetime,
  updatedAt: datetime
}
```

### Hero Section
```javascript
{
  name: string,
  jobTitle: string,
  tagline: string,
  profileImage: string (URL),
  backgroundImage: string (URL),
  resumeUrl: string,
  socialLinks: {
    linkedin: string,
    github: string,
    twitter: string,
    email: string
  },
  updatedAt: datetime
}
```

### About Section
```javascript
{
  title: string,
  description: string,
  longDescription: string,
  location: string,
  yearsOfExperience: number,
  projectsCompleted: number,
  technologies: [string],
  updatedAt: datetime
}
```

### Education Entry
```javascript
{
  id: string,
  degree: string,
  institution: string,
  location: string,
  duration: string,
  gpa: string,
  description: string,
  order: number,
  createdAt: datetime,
  updatedAt: datetime
}
```

### Experience Entry
```javascript
{
  id: string,
  position: string,
  company: string,
  location: string,
  duration: string,
  type: string,
  description: string,
  achievements: [string],
  technologies: [string],
  order: number,
  createdAt: datetime,
  updatedAt: datetime
}
```

### Skills
```javascript
{
  technical: [{
    id: string,
    name: string,
    level: number,
    category: string
  }],
  soft: [string],
  updatedAt: datetime
}
```

### Project
```javascript
{
  id: string,
  title: string,
  description: string,
  longDescription: string,
  image: string (URL),
  technologies: [string],
  githubUrl: string,
  liveUrl: string,
  featured: boolean,
  category: string,
  order: number,
  createdAt: datetime,
  updatedAt: datetime
}
```

### Certification
```javascript
{
  id: string,
  name: string,
  issuer: string,
  date: string,
  credentialId: string,
  image: string (URL),
  order: number,
  createdAt: datetime,
  updatedAt: datetime
}
```

### Testimonial
```javascript
{
  id: string,
  name: string,
  position: string,
  company: string,
  avatar: string (URL),
  quote: string,
  rating: number,
  order: number,
  createdAt: datetime,
  updatedAt: datetime
}
```

### Blog Article
```javascript
{
  id: string,
  title: string,
  excerpt: string,
  content: string,
  publishDate: datetime,
  readTime: string,
  tags: [string],
  image: string (URL),
  featured: boolean,
  published: boolean,
  createdAt: datetime,
  updatedAt: datetime
}
```

### Site Settings
```javascript
{
  theme: 'light' | 'dark' | 'auto',
  primaryColor: string,
  secondaryColor: string,
  accentColor: string,
  font: string,
  language: string,
  seo: {
    title: string,
    description: string,
    keywords: string,
    ogImage: string
  },
  analytics: {
    googleAnalyticsId: string,
    enabled: boolean
  },
  blog: {
    enabled: boolean
  },
  sections: {
    hero: { enabled: boolean, order: number },
    about: { enabled: boolean, order: number },
    experience: { enabled: boolean, order: number },
    education: { enabled: boolean, order: number },
    skills: { enabled: boolean, order: number },
    projects: { enabled: boolean, order: number },
    certifications: { enabled: boolean, order: number },
    testimonials: { enabled: boolean, order: number },
    blog: { enabled: boolean, order: number },
    contact: { enabled: boolean, order: number }
  },
  updatedAt: datetime
}
```

## Frontend Integration Plan

### Mock Data Replacement
1. Replace `mock.js` imports with API calls using axios
2. Add loading states for all data fetching
3. Add error handling for API failures
4. Implement real-time data updates

### API Integration Points
1. **Portfolio.jsx**: Main data fetching orchestration
2. **Each Section Component**: Individual API calls for specific data
3. **Admin Components**: CRUD operations for content management
4. **Settings Components**: Theme and configuration management

### File Upload Integration
1. Replace mock image URLs with actual uploaded file URLs
2. Implement chunked file upload for large files
3. Add image optimization and resizing
4. File management with delete functionality

### Authentication Integration
1. Login form with JWT token management
2. Route protection for admin panel
3. Token refresh and session management
4. Secure API calls with authorization headers

## Implementation Priority

### Phase 1: Core Backend (Day 1)
- Basic MongoDB models
- Authentication system
- Essential CRUD endpoints for all sections
- File upload functionality

### Phase 2: Frontend Integration (Day 1)
- Replace mock data with API calls
- Add loading and error states
- Basic admin panel for content management

### Phase 3: Advanced Features (Day 2)
- Design customization panel
- Section reordering and toggling
- SEO and analytics integration
- Export/deployment features

### Phase 4: Polish & Testing (Day 2)
- Comprehensive error handling
- Performance optimization
- Mobile responsiveness validation
- Security hardening