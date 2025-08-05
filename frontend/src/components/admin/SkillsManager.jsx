import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useToast } from '../../hooks/use-toast';
import { portfolioAPI, adminAPI } from '../../services/api';
import { Plus, Edit, Trash2, Save, X, Loader2, Code } from 'lucide-react';

const SkillsManager = () => {
  const [skills, setSkills] = useState({
    technical: [],
    soft: []
  });
  const [loading, setLoading] = useState(true);
  const [editingTechnical, setEditingTechnical] = useState(null);
  const [technicalDialogOpen, setTechnicalDialogOpen] = useState(false);
  const [technicalFormData, setTechnicalFormData] = useState({
    name: '',
    level: 50,
    category: ''
  });
  const [newSoftSkill, setNewSoftSkill] = useState('');
  const { toast } = useToast();

  const categories = ['Programming', 'Frontend', 'Backend', 'Database', 'Cloud', 'DevOps', 'Design', 'Tools', 'Other'];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await portfolioAPI.getSkills();
      setSkills(response.data);
    } catch (error) {
      toast({
        title: "Error loading skills",
        description: "Failed to fetch skills data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetTechnicalForm = () => {
    setTechnicalFormData({
      name: '',
      level: 50,
      category: ''
    });
    setEditingTechnical(null);
  };

  const handleTechnicalInputChange = (e) => {
    const { name, value } = e.target;
    setTechnicalFormData(prev => ({
      ...prev,
      [name]: name === 'level' ? parseInt(value) || 0 : value
    }));
  };

  const saveTechnicalSkill = async () => {
    try {
      let updatedTechnical;
      
      if (editingTechnical) {
        // Update existing skill
        updatedTechnical = skills.technical.map(skill =>
          skill.id === editingTechnical.id
            ? { ...skill, ...technicalFormData }
            : skill
        );
      } else {
        // Add new skill
        const newSkill = {
          id: Date.now().toString(),
          ...technicalFormData
        };
        updatedTechnical = [...skills.technical, newSkill];
      }

      const updatedSkills = {
        ...skills,
        technical: updatedTechnical
      };

      await adminAPI.updateSkills(updatedSkills);
      setSkills(updatedSkills);
      
      toast({ 
        title: editingTechnical ? "Technical skill updated" : "Technical skill added",
        description: "Skills have been updated successfully"
      });
      
      setTechnicalDialogOpen(false);
      resetTechnicalForm();
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save technical skill",
        variant: "destructive"
      });
    }
  };

  const editTechnicalSkill = (skill) => {
    setEditingTechnical(skill);
    setTechnicalFormData({
      name: skill.name,
      level: skill.level,
      category: skill.category
    });
    setTechnicalDialogOpen(true);
  };

  const deleteTechnicalSkill = async (skillId) => {
    try {
      const updatedTechnical = skills.technical.filter(skill => skill.id !== skillId);
      const updatedSkills = {
        ...skills,
        technical: updatedTechnical
      };

      await adminAPI.updateSkills(updatedSkills);
      setSkills(updatedSkills);
      
      toast({ title: "Technical skill deleted successfully" });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete technical skill",
        variant: "destructive"
      });
    }
  };

  const addSoftSkill = async () => {
    if (newSoftSkill.trim() && !skills.soft.includes(newSoftSkill.trim())) {
      try {
        const updatedSkills = {
          ...skills,
          soft: [...skills.soft, newSoftSkill.trim()]
        };

        await adminAPI.updateSkills(updatedSkills);
        setSkills(updatedSkills);
        setNewSoftSkill('');
        
        toast({ title: "Soft skill added successfully" });
      } catch (error) {
        toast({
          title: "Save failed",
          description: "Failed to add soft skill",
          variant: "destructive"
        });
      }
    }
  };

  const removeSoftSkill = async (skillToRemove) => {
    try {
      const updatedSkills = {
        ...skills,
        soft: skills.soft.filter(skill => skill !== skillToRemove)
      };

      await adminAPI.updateSkills(updatedSkills);
      setSkills(updatedSkills);
      
      toast({ title: "Soft skill removed successfully" });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to remove soft skill",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Group technical skills by category
  const groupedTechnical = skills.technical.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-light text-black">Skills Management</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Technical Skills */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Technical Skills</h2>
            <Dialog open={technicalDialogOpen} onOpenChange={setTechnicalDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={resetTechnicalForm}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Technical Skill
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingTechnical ? 'Edit Technical Skill' : 'Add Technical Skill'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Skill Name *
                    </label>
                    <Input
                      name="name"
                      value={technicalFormData.name}
                      onChange={handleTechnicalInputChange}
                      placeholder="e.g., React, Node.js, Python"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Proficiency Level: {technicalFormData.level}%
                    </label>
                    <input
                      type="range"
                      name="level"
                      min="0"
                      max="100"
                      value={technicalFormData.level}
                      onChange={handleTechnicalInputChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={technicalFormData.category}
                      onChange={handleTechnicalInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setTechnicalDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={saveTechnicalSkill}
                      className="bg-black text-white hover:bg-gray-800"
                      disabled={!technicalFormData.name || !technicalFormData.category}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {Object.keys(groupedTechnical).length === 0 ? (
            <div className="text-center py-8">
              <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No technical skills added yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedTechnical).map(([category, categorySkills]) => (
                <div key={category}>
                  <h3 className="font-semibold text-black mb-3">{category}</h3>
                  <div className="space-y-3">
                    {categorySkills.map((skill) => (
                      <div key={skill.id} className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-black">{skill.name}</span>
                            <span className="text-sm text-gray-600">{skill.level}%</span>
                          </div>
                          <Progress value={skill.level} className="h-2" />
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editTechnicalSkill(skill)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTechnicalSkill(skill.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Soft Skills */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Soft Skills</h2>
          
          <div className="space-y-4">
            {/* Current Soft Skills */}
            <div className="flex flex-wrap gap-2">
              {skills.soft.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center space-x-2 px-3 py-1"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => removeSoftSkill(skill)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>

            {/* Add New Soft Skill */}
            <div className="flex space-x-2">
              <Input
                value={newSoftSkill}
                onChange={(e) => setNewSoftSkill(e.target.value)}
                placeholder="Add a soft skill (e.g., Leadership, Communication)"
                onKeyPress={(e) => e.key === 'Enter' && addSoftSkill()}
                className="flex-1"
              />
              <Button
                onClick={addSoftSkill}
                variant="outline"
                disabled={!newSoftSkill.trim()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>

            {skills.soft.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No soft skills added yet</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SkillsManager;