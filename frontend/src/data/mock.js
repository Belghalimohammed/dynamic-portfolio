// Mock data for portfolio - will be replaced with backend integration later

export const portfolioData = {
  // Hero Section
  hero: {
    name: "Alex Rivera",
    jobTitle: "Full-Stack Developer & UI/UX Designer",
    tagline: "Creating digital experiences that matter",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    backgroundImage: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=1920&h=1080&fit=crop",
    resumeUrl: "#",
    socialLinks: {
      linkedin: "https://linkedin.com/in/alexrivera",
      github: "https://github.com/alexrivera",
      twitter: "https://twitter.com/alexrivera",
      email: "alex@example.com"
    }
  },

  // About Me
  about: {
    title: "About Me",
    description: "I'm a passionate full-stack developer with 5+ years of experience building scalable web applications and intuitive user interfaces. I love turning complex problems into simple, beautiful designs.",
    longDescription: "When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or sharing knowledge through technical writing. I believe in continuous learning and staying ahead of industry trends.",
    location: "San Francisco, CA",
    yearsOfExperience: 5,
    projectsCompleted: 50,
    technologies: ["React", "Node.js", "Python", "AWS", "MongoDB"]
  },

  // Education
  education: [
    {
      id: 1,
      degree: "Master of Science in Computer Science",
      institution: "Stanford University",
      location: "Stanford, CA",
      duration: "2018 - 2020",
      gpa: "3.8/4.0",
      description: "Specialized in Machine Learning and Human-Computer Interaction"
    },
    {
      id: 2,
      degree: "Bachelor of Science in Software Engineering",
      institution: "UC Berkeley",
      location: "Berkeley, CA", 
      duration: "2014 - 2018",
      gpa: "3.7/4.0",
      description: "Magna Cum Laude, Dean's List for 6 semesters"
    }
  ],

  // Work Experience
  workExperience: [
    {
      id: 1,
      position: "Senior Full-Stack Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      duration: "2021 - Present",
      type: "Full-time",
      description: "Lead development of enterprise web applications serving 100K+ users. Architected microservices infrastructure and mentored junior developers.",
      achievements: [
        "Improved application performance by 40% through optimization",
        "Led a team of 5 developers on critical product launches",
        "Implemented CI/CD pipeline reducing deployment time by 60%"
      ],
      technologies: ["React", "Node.js", "AWS", "Docker", "MongoDB"]
    },
    {
      id: 2,
      position: "Frontend Developer",
      company: "StartupXYZ",
      location: "San Francisco, CA",
      duration: "2019 - 2021",
      type: "Full-time",
      description: "Developed responsive web applications and collaborated with design teams to create exceptional user experiences.",
      achievements: [
        "Built component library used across 10+ projects",
        "Increased user engagement by 25% through UX improvements",
        "Mentored 3 intern developers"
      ],
      technologies: ["React", "TypeScript", "Sass", "Jest"]
    }
  ],

  // Skills
  skills: {
    technical: [
      { name: "JavaScript", level: 95, category: "Programming" },
      { name: "React", level: 90, category: "Frontend" },
      { name: "Node.js", level: 85, category: "Backend" },
      { name: "Python", level: 80, category: "Programming" },
      { name: "TypeScript", level: 85, category: "Programming" },
      { name: "MongoDB", level: 75, category: "Database" },
      { name: "AWS", level: 70, category: "Cloud" },
      { name: "Docker", level: 75, category: "DevOps" },
      { name: "Git", level: 90, category: "Tools" },
      { name: "Figma", level: 80, category: "Design" }
    ],
    soft: [
      "Leadership", "Problem Solving", "Communication", "Team Collaboration", 
      "Project Management", "Mentoring", "Critical Thinking", "Adaptability"
    ]
  },

  // Projects
  projects: [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "A full-featured e-commerce platform with real-time inventory management, payment processing, and admin dashboard.",
      longDescription: "Built a scalable e-commerce solution handling 10K+ daily transactions with features like advanced search, recommendation engine, and comprehensive analytics.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
      technologies: ["React", "Node.js", "MongoDB", "Stripe", "AWS"],
      githubUrl: "https://github.com/alexrivera/ecommerce-platform",
      liveUrl: "https://ecommerce-demo.com",
      featured: true,
      category: "Web Application"
    },
    {
      id: 2,
      title: "Task Management App",
      description: "A collaborative task management application with real-time updates, team workspaces, and advanced filtering.",
      longDescription: "Developed a productivity app with drag-and-drop functionality, real-time collaboration, and integrations with popular tools like Slack and Google Calendar.",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop",
      technologies: ["React", "Firebase", "Material-UI", "Socket.io"],
      githubUrl: "https://github.com/alexrivera/task-manager",
      liveUrl: "https://taskmanager-demo.com",
      featured: true,
      category: "Productivity"
    },
    {
      id: 3,
      title: "Weather Analytics Dashboard",
      description: "A data visualization dashboard showing weather patterns and climate trends with interactive charts and maps.",
      longDescription: "Created an analytics platform processing weather data from multiple APIs, featuring interactive charts, heat maps, and predictive modeling.",
      image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&h=400&fit=crop",
      technologies: ["Python", "Django", "D3.js", "PostgreSQL"],
      githubUrl: "https://github.com/alexrivera/weather-dashboard",
      liveUrl: "https://weather-analytics.com",
      featured: false,
      category: "Data Visualization"
    }
  ],

  // Certifications
  certifications: [
    {
      id: 1,
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2023",
      credentialId: "AWS-SA-123456",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop"
    },
    {
      id: 2,
      name: "Google Cloud Professional Developer",
      issuer: "Google Cloud",
      date: "2022",
      credentialId: "GCP-PD-789012",
      image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&h=100&fit=crop"
    },
    {
      id: 3,
      name: "Certified Kubernetes Administrator",
      issuer: "Cloud Native Computing Foundation",
      date: "2023",
      credentialId: "CKA-345678",
      image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=100&h=100&fit=crop"
    }
  ],

  // Testimonials
  testimonials: [
    {
      id: 1,
      name: "Sarah Johnson",
      position: "Product Manager",
      company: "TechCorp Inc.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face",
      quote: "Alex is an exceptional developer who consistently delivers high-quality work. His attention to detail and problem-solving skills are outstanding.",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      position: "CTO",
      company: "StartupXYZ",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      quote: "Working with Alex was a game-changer for our product. His technical expertise and collaborative approach made our development process smooth and efficient.",
      rating: 5
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      position: "Design Lead",
      company: "CreativeAgency",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
      quote: "Alex has an incredible ability to translate design concepts into pixel-perfect implementations. His collaboration with our design team was seamless.",
      rating: 5
    }
  ],

  // Blog Articles
  blog: {
    enabled: true,
    articles: [
      {
        id: 1,
        title: "Building Scalable React Applications",
        excerpt: "Learn the best practices for building large-scale React applications that are maintainable and performant.",
        content: "Full article content here...",
        publishDate: "2024-01-15",
        readTime: "8 min read",
        tags: ["React", "JavaScript", "Architecture"],
        image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=600&h=300&fit=crop",
        featured: true
      },
      {
        id: 2,
        title: "The Future of Web Development",
        excerpt: "Exploring emerging trends and technologies that will shape the future of web development.",
        content: "Full article content here...",
        publishDate: "2024-01-08",
        readTime: "6 min read",
        tags: ["Web Development", "Trends", "Technology"],
        image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&h=300&fit=crop",
        featured: false
      }
    ]
  },

  // Site Settings
  settings: {
    theme: "light", // light, dark, auto
    primaryColor: "#000000",
    secondaryColor: "#666666",
    accentColor: "#0066cc",
    font: "Inter",
    language: "en",
    seo: {
      title: "Alex Rivera - Full-Stack Developer",
      description: "Experienced full-stack developer specializing in React, Node.js, and modern web technologies.",
      keywords: "full-stack developer, react, node.js, javascript, web development",
      ogImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=630&fit=crop"
    },
    analytics: {
      googleAnalyticsId: "",
      enabled: false
    }
  }
};