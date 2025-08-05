import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useToast } from '../../hooks/use-toast';
import { portfolioAPI, adminAPI } from '../../services/api';
import { Plus, Edit, Trash2, Save, X, Loader2, Briefcase } from 'lucide-react';

const ExperienceManager = () => {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    position: '',
    company: '',
    location: '',
    duration: '',
    type: 'Full-time',
    description: '',
    achievements: [],
    technologies: [],
    order: 0
  });
  const [newAchievement, setNewAchievement] = useState('');
  const [newTechnology, setNewTechnology] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const response = await portfolioAPI.getExperience();
      setExperience(response.data);
    } catch (error) {
      toast({
        title: "Error loading experience",
        description: "Failed to fetch experience data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      position: '',
      company: '',
      location: '',
      duration: '',
      type: 'Full-time',
      description: '',
      achievements: [],
      technologies: [],
      order: experience.length
    });
    setEditingItem(null);
    setNewAchievement('');
    setNewTechnology('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) || 0 : value
    }));
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const removeAchievement = (index) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const addTechnology = () => {
    if (newTechnology.trim() && !formData.technologies.includes(newTechnology.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()]
      }));
      setNewTechnology('');
    }
  };

  const removeTechnology = (tech) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const handleSave = async () => {
    try {
      if (editingItem) {
        await adminAPI.updateExperience(editingItem.id, formData);
        toast({ title: "Experience updated successfully" });
      } else {
        await adminAPI.createExperience(formData);
        toast({ title: "Experience added successfully" });
      }
      
      setDialogOpen(false);
      resetForm();
      fetchExperience();
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save experience entry",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      position: item.position,
      company: item.company,
      location: item.location,
      duration: item.duration,
      type: item.type,
      description: item.description,
      achievements: item.achievements || [],
      technologies: item.technologies || [],
      order: item.order
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience entry?')) {
      try {
        await adminAPI.deleteExperience(id);
        toast({ title: "Experience deleted successfully" });
        fetchExperience();
      } catch (error) {
        toast({
          title: "Delete failed",
          description: "Failed to delete experience entry",
          variant: "destructive"
        });
      }
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
        <h1 className="text-3xl font-light text-black">Experience Management</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="bg-black text-white hover:bg-gray-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Experience' : 'Add New Experience'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Position *
                  </label>
                  <Input
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="Senior Software Developer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Company *
                  </label>
                  <Input
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Tech Company Inc."
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Location *
                  </label>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Duration *
                  </label>
                  <Input
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="2021 - Present"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Employment Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Job Description *
                </label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of your role and responsibilities"
                  rows={4}
                />
              </div>

              {/* Achievements */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Key Achievements
                </label>
                <div className="space-y-2 mb-4">
                  {formData.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">{achievement}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAchievement(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    placeholder="Add an achievement..."
                    onKeyPress={(e) => e.key === 'Enter' && addAchievement()}
                    className="flex-1"
                  />
                  <Button
                    onClick={addAchievement}
                    variant="outline"
                    disabled={!newAchievement.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Technologies Used
                </label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.technologies.map((tech, index) => (
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
                <div className="flex space-x-2">
                  <Input
                    value={newTechnology}
                    onChange={(e) => setNewTechnology(e.target.value)}
                    placeholder="Add a technology..."
                    onKeyPress={(e) => e.key === 'Enter' && addTechnology()}
                    className="flex-1"
                  />
                  <Button
                    onClick={addTechnology}
                    variant="outline"
                    disabled={!newTechnology.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Display Order
                </label>
                <Input
                  name="order"
                  type="number"
                  value={formData.order}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {experience.length === 0 ? (
        <Card className="p-12 text-center">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No Experience Added</h2>
          <p className="text-gray-500 mb-6">Start by adding your work experience</p>
          <Button 
            onClick={() => {
              resetForm();
              setDialogOpen(true);
            }}
            className="bg-black text-white hover:bg-gray-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Experience
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6">
          {experience
            .sort((a, b) => a.order - b.order)
            .map((item) => (
              <Card key={item.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-black">{item.position}</h3>
                    <p className="text-lg text-gray-700">{item.company}</p>
                    <div className="flex items-center space-x-4 text-gray-600 mt-2">
                      <span>{item.location}</span>
                      <span>•</span>
                      <span>{item.duration}</span>
                      <span>•</span>
                      <Badge variant="secondary">{item.type}</Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 leading-relaxed">{item.description}</p>
                
                {item.achievements && item.achievements.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-black mb-2">Key Achievements:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {item.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {item.technologies && item.technologies.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-black mb-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {item.technologies.map((tech, index) => (
                        <Badge key={index} variant="outline">{tech}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="text-sm text-gray-500">
                  Order: {item.order}
                </div>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceManager;