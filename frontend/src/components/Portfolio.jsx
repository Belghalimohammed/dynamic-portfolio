import React from 'react';
import Header from './portfolio/Header';
import Hero from './portfolio/Hero';
import About from './portfolio/About';
import Education from './portfolio/Education';
import Experience from './portfolio/Experience';
import Skills from './portfolio/Skills';
import Projects from './portfolio/Projects';
import Certifications from './portfolio/Certifications';
import Testimonials from './portfolio/Testimonials';
import Blog from './portfolio/Blog';
import Contact from './portfolio/Contact';
import Footer from './portfolio/Footer';
import { usePortfolioData } from '../hooks/usePortfolioData';

const Portfolio = () => {
  const { data, loading, error } = usePortfolioData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-black mb-2">Error Loading Portfolio</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Check if sections should be displayed based on settings
  const sectionSettings = data.settings?.sections || {};
  const getSectionConfig = (sectionName) => sectionSettings[sectionName] || { enabled: true, order: 0 };

  // Create array of sections with their configurations
  const sections = [
    { 
      name: 'hero', 
      component: <Hero key="hero" data={data.hero} />, 
      config: getSectionConfig('hero') 
    },
    { 
      name: 'about', 
      component: <About key="about" data={data.about} />, 
      config: getSectionConfig('about') 
    },
    { 
      name: 'experience', 
      component: <Experience key="experience" data={data.experience} />, 
      config: getSectionConfig('experience') 
    },
    { 
      name: 'education', 
      component: <Education key="education" data={data.education} />, 
      config: getSectionConfig('education') 
    },
    { 
      name: 'skills', 
      component: <Skills key="skills" data={data.skills} />, 
      config: getSectionConfig('skills') 
    },
    { 
      name: 'projects', 
      component: <Projects key="projects" data={data.projects} />, 
      config: getSectionConfig('projects') 
    },
    { 
      name: 'certifications', 
      component: <Certifications key="certifications" data={data.certifications} />, 
      config: getSectionConfig('certifications') 
    },
    { 
      name: 'testimonials', 
      component: <Testimonials key="testimonials" data={data.testimonials} />, 
      config: getSectionConfig('testimonials') 
    },
    { 
      name: 'blog', 
      component: data.settings?.blog_enabled ? <Blog key="blog" data={data.blog} /> : null, 
      config: getSectionConfig('blog') 
    },
    { 
      name: 'contact', 
      component: <Contact key="contact" />, 
      config: getSectionConfig('contact') 
    }
  ];

  // Filter enabled sections and sort by order
  const enabledSections = sections
    .filter(section => section.config.enabled && section.component)
    .sort((a, b) => a.config.order - b.config.order);

  return (
    <div className="min-h-screen bg-white" style={{
      '--primary-color': data.settings?.primary_color || '#000000',
      '--secondary-color': data.settings?.secondary_color || '#666666',
      '--accent-color': data.settings?.accent_color || '#0066cc'
    }}>
      <Header data={data.hero} />
      <main>
        {enabledSections.map(section => section.component)}
      </main>
      <Footer data={data.hero} />
    </div>
  );
};

export default Portfolio;