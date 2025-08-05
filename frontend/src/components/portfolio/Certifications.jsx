import React from 'react';
import { Award, ExternalLink, Calendar } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

const Certifications = ({ data }) => {
  return (
    <section id="certifications" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-light text-black mb-6">Certifications</h2>
          <div className="w-24 h-1 bg-black mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(data || []).map((cert) => (
            <Card key={cert.id} className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start space-x-4 mb-4">
                <div className="p-3 bg-black rounded-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-black mb-2">{cert.name}</h3>
                  <p className="text-gray-600 mb-2">{cert.issuer}</p>
                  <div className="flex items-center space-x-2 text-gray-500 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>{cert.date}</span>
                  </div>
                  {cert.credentialId && (
                    <Badge variant="outline" className="mb-4">
                      ID: {cert.credentialId}
                    </Badge>
                  )}
                  <button className="flex items-center space-x-2 text-black hover:text-gray-600 transition-colors duration-200">
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm font-medium">View Certificate</span>
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;