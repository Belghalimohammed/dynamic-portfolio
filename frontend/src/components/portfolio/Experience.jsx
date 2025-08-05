import React from 'react';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

const Experience = ({ data }) => {
  return (
    <section id="experience" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-light text-black mb-6">Work Experience</h2>
          <div className="w-24 h-1 bg-black mx-auto"></div>
        </div>

        <div className="space-y-8">
          {(data || []).map((job, index) => (
            <Card key={job.id} className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                <div className="mb-4 lg:mb-0">
                  <h3 className="text-2xl font-semibold text-black mb-2">{job.position}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-gray-600 mb-2">
                    <span className="font-medium text-black">{job.company}</span>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{job.duration}</span>
                    <Badge variant="secondary" className="ml-2">{job.type}</Badge>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">{job.description}</p>

              {/* Achievements */}
              {job.achievements && job.achievements.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-black mb-3">Key Achievements</h4>
                  <ul className="space-y-2">
                    {job.achievements.map((achievement, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <ArrowRight className="w-4 h-4 text-black mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technologies */}
              {job.technologies && job.technologies.length > 0 && (
                <div>
                  <h4 className="font-semibold text-black mb-3">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.technologies.map((tech, idx) => (
                      <Badge key={idx} variant="outline" className="hover:bg-black hover:text-white transition-colors duration-200">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;