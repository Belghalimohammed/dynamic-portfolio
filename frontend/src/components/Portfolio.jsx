import React, { useState, useEffect } from 'react';
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
import { portfolioData } from '../data/mock';

const Portfolio = () => {
  const [data, setData] = useState(portfolioData);
  const [loading, setLoading] = useState(false);

  // Mock data loading simulation
  useEffect(() => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

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

  return (
    <div className="min-h-screen bg-white">
      <Header data={data.hero} />
      <main>
        <Hero data={data.hero} />
        <About data={data.about} />
        <Experience data={data.workExperience} />
        <Education data={data.education} />
        <Skills data={data.skills} />
        <Projects data={data.projects} />
        <Certifications data={data.certifications} />
        <Testimonials data={data.testimonials} />
        {data.blog.enabled && <Blog data={data.blog} />}
        <Contact />
      </main>
      <Footer data={data.hero} />
    </div>
  );
};

export default Portfolio;