import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { useToast } from '../../hooks/use-toast';
import { portfolioAPI, adminAPI } from '../../services/api';
import { Save, Plus, X, Loader2 } from 'lucide-react';

const AboutManager = () => {
  const [data, setData] = useState({
    title: 'About Me',
    description: '',
    long_description: '',
    location: '',
    years_of_experience: 0,
    projects_completed: 0,
    technologies: []
  });
  const [newTech, setNewTech] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await portfolioAPI.getAbout();
      setData(response.data);
    } catch (error) {
      toast({
        title: "Error loading about data",
        description: "Failed to fetch about section data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: name.includes('experience') || name.includes('completed') ? parseInt(value) || 0 : value
    }));
  };

  const addTechnology = () => {
    if (newTech.trim() && !data.technologies.includes(newTech.trim())) {
      setData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTech.trim()]
      }));
      setNewTech('');
    }
  };

  const removeTechnology = (tech) => {
    setData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      await adminAPI.updateAbout(data);
      toast({
        title: "About section updated",
        description: "Changes have been saved successfully"
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save about section",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-light text-black">About Section</h1>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-black text-white hover:bg-gray-800"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Section Title
              </label>
              <Input
                name="title"
                value={data.title}
                onChange={handleInputChange}
                placeholder="About Me"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Description *
              </label>
              <Textarea
                name="description"
                value={data.description}
                onChange={handleInputChange}
                placeholder="Brief professional description"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Extended Description
              </label>
              <Textarea
                name="long_description"
                value={data.long_description}
                onChange={handleInputChange}
                placeholder="Additional details about yourself"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Location
              </label>
              <Input
                name="location"
                value={data.location}
                onChange={handleInputChange}
                placeholder="City, Country"
              />
            </div>
          </div>
        </Card>

        {/* Statistics */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Statistics</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Years of Experience
              </label>
              <Input
                name="years_of_experience"
                type="number"
                value={data.years_of_experience}
                onChange={handleInputChange}
                placeholder="5"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Projects Completed
              </label>
              <Input
                name="projects_completed"
                type="number"
                value={data.projects_completed}
                onChange={handleInputChange}
                placeholder="50"
                min="0"
              />
            </div>
          </div>
        </Card>

        {/* Core Technologies */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Core Technologies</h2>
          
          {/* Current Technologies */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {data.technologies.map((tech, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center space-x-2 px-3 py-1"
                >
                  <span>{tech}</span>
                  <button
                    onClick={() => removeTechnology(tech)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Add New Technology */}
          <div className="flex space-x-2">
            <Input
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              placeholder="Add a technology (e.g., React, Node.js)"
              onKeyPress={(e) => e.key === 'Enter' && addTechnology()}
              className="flex-1"
            />
            <Button
              onClick={addTechnology}
              variant="outline"
              disabled={!newTech.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AboutManager;