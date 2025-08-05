import React from 'react';
import { MapPin, Clock, Trophy, Code } from 'lucide-react';
import { Card } from '../ui/card';

const About = ({ data }) => {
  const stats = [
    {
      icon: Clock,
      value: `${data?.yearsOfExperience || 5}+`,
      label: 'Years Experience'
    },
    {
      icon: Trophy,
      value: `${data?.projectsCompleted || 50}+`,
      label: 'Projects Completed'
    },
    {
      icon: Code,
      value: `${data?.technologies?.length || 10}+`,
      label: 'Technologies'
    }
  ];

  return (
    <section id="about" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-light text-black mb-6">
            {data?.title || 'About Me'}
          </h2>
          <div className="w-24 h-1 bg-black mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              {data?.description || 'Your professional description goes here...'}
            </p>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              {data?.longDescription || 'Additional details about your background and interests...'}
            </p>

            {/* Location */}
            {data?.location && (
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span>{data.location}</span>
              </div>
            )}

            {/* Technologies */}
            {data?.technologies && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-black mb-4">Core Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {data.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-black transition-colors duration-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="space-y-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-black rounded-lg">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-black">{stat.value}</div>
                      <div className="text-gray-600">{stat.label}</div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;