import React from 'react';
import { Download, Github, Linkedin, Mail, Twitter } from 'lucide-react';
import { Button } from '../ui/button';

const Hero = ({ data }) => {
  const socialIcons = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    email: Mail
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white">
      {/* Background Image with Overlay */}
      {data?.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img 
            src={data.backgroundImage} 
            alt="" 
            className="w-full h-full object-cover opacity-5"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white"></div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Profile Image */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <img
                src={data?.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'}
                alt={data?.name || 'Profile'}
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white shadow-xl hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-black/5"></div>
            </div>
          </div>

          {/* Name and Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light text-black mb-4 tracking-tight">
            {data?.name || 'Your Name'}
          </h1>
          
          <h2 className="text-xl sm:text-2xl lg:text-3xl text-gray-600 mb-6 font-light">
            {data?.jobTitle || 'Your Job Title'}
          </h2>

          {/* Tagline */}
          <p className="text-lg sm:text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            {data?.tagline || 'Your professional tagline goes here'}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              className="px-8 py-3 bg-black text-white hover:bg-gray-800 transition-all duration-200 hover:scale-105"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Mail className="w-4 h-4 mr-2" />
              Get In Touch
            </Button>
            
            <Button 
              variant="outline" 
              className="px-8 py-3 border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-200 hover:scale-105"
              onClick={() => window.open(data?.resumeUrl || '#', '_blank')}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Resume
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-6">
            {Object.entries(data?.socialLinks || {}).map(([platform, url]) => {
              const Icon = socialIcons[platform];
              if (!Icon || !url) return null;
              
              return (
                <a
                  key={platform}
                  href={platform === 'email' ? `mailto:${url}` : url}
                  target={platform === 'email' ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all duration-200 hover:scale-110 hover:-translate-y-1"
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;