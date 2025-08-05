import { useState, useEffect } from 'react';
import { portfolioAPI } from '../services/api';

export const usePortfolioData = () => {
  const [data, setData] = useState({
    hero: null,
    about: null,
    education: [],
    experience: [],
    skills: null,
    projects: [],
    certifications: [],
    testimonials: [],
    blog: [],
    settings: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        heroRes,
        aboutRes,
        educationRes,
        experienceRes,
        skillsRes,
        projectsRes,
        certificationsRes,
        testimonialsRes,
        blogRes,
        settingsRes
      ] = await Promise.all([
        portfolioAPI.getHero(),
        portfolioAPI.getAbout(),
        portfolioAPI.getEducation(),
        portfolioAPI.getExperience(),
        portfolioAPI.getSkills(),
        portfolioAPI.getProjects(),
        portfolioAPI.getCertifications(),
        portfolioAPI.getTestimonials(),
        portfolioAPI.getBlog(),
        portfolioAPI.getSettings()
      ]);

      setData({
        hero: heroRes.data,
        about: aboutRes.data,
        education: educationRes.data,
        experience: experienceRes.data,
        skills: skillsRes.data,
        projects: projectsRes.data,
        certifications: certificationsRes.data,
        testimonials: testimonialsRes.data,
        blog: blogRes.data,
        settings: settingsRes.data
      });
    } catch (err) {
      console.error('Error fetching portfolio data:', err);
      setError(err.message || 'Failed to load portfolio data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const refetch = () => {
    fetchAllData();
  };

  return {
    data,
    loading,
    error,
    refetch
  };
};