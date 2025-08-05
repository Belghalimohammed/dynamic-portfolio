import React from 'react';
import { GraduationCap, MapPin, Calendar } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

const Education = ({ data }) => {
  return (
    <section id="education" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-light text-black mb-6">Education</h2>
          <div className="w-24 h-1 bg-black mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {(data || []).map((edu, index) => (
            <Card key={edu.id} className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start space-x-4 mb-6">
                <div className="p-3 bg-black rounded-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-black mb-2">{edu.degree}</h3>
                  <div className="text-lg font-medium text-gray-800 mb-2">{edu.institution}</div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{edu.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{edu.duration}</span>
                    </div>
                  </div>

                  {edu.gpa && (
                    <Badge variant="secondary" className="mb-4">
                      GPA: {edu.gpa}
                    </Badge>
                  )}

                  <p className="text-gray-700 leading-relaxed">{edu.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;