import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';

const Skills = ({ data }) => {
  const [activeCategory, setActiveCategory] = useState('all');

  // Group technical skills by category
  const skillCategories = data?.technical ? 
    [...new Set(data.technical.map(skill => skill.category))] : [];

  const filteredSkills = activeCategory === 'all' 
    ? data?.technical || []
    : (data?.technical || []).filter(skill => skill.category === activeCategory);

  return (
    <section id="skills" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-light text-black mb-6">Skills & Expertise</h2>
          <div className="w-24 h-1 bg-black mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Technical Skills */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-semibold text-black mb-6">Technical Skills</h3>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === 'all'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {skillCategories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeCategory === category
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Skills List */}
            <div className="space-y-6">
              {filteredSkills.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-black">{skill.name}</span>
                    <span className="text-sm text-gray-600">{skill.level}%</span>
                  </div>
                  <Progress 
                    value={skill.level} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Soft Skills */}
          <div>
            <h3 className="text-2xl font-semibold text-black mb-6">Soft Skills</h3>
            <Card className="p-6">
              <div className="flex flex-wrap gap-2">
                {(data?.soft || []).map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    className="hover:bg-black hover:text-white transition-colors duration-200 cursor-default"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;