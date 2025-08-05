import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useToast } from '../../hooks/use-toast';
import { portfolioAPI, adminAPI } from '../../services/api';
import { Plus, Edit, Trash2, Save, X, Loader2, GraduationCap } from 'lucide-react';

const EducationManager = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    location: '',
    duration: '',
    gpa: '',
    description: '',
    order: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const response = await portfolioAPI.getEducation();
      setEducation(response.data);
    } catch (error) {
      toast({
        title: "Error loading education",
        description: "Failed to fetch education data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      degree: '',
      institution: '',
      location: '',
      duration: '',
      gpa: '',
      description: '',
      order: education.length
    });
    setEditingItem(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) || 0 : value
    }));
  };

  const handleSave = async () => {
    try {
      if (editingItem) {
        await adminAPI.updateEducation(editingItem.id, formData);
        toast({ title: "Education updated successfully" });
      } else {
        await adminAPI.createEducation(formData);
        toast({ title: "Education added successfully" });
      }
      
      setDialogOpen(false);
      resetForm();
      fetchEducation();
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save education entry",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      degree: item.degree,
      institution: item.institution,
      location: item.location,
      duration: item.duration,
      gpa: item.gpa || '',
      description: item.description,
      order: item.order
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      try {
        await adminAPI.deleteEducation(id);
        toast({ title: "Education deleted successfully" });
        fetchEducation();
      } catch (error) {
        toast({
          title: "Delete failed",
          description: "Failed to delete education entry",
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
        <h1 className="text-3xl font-light text-black">Education Management</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="bg-black text-white hover:bg-gray-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Education' : 'Add New Education'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Degree *
                  </label>
                  <Input
                    name="degree"
                    value={formData.degree}
                    onChange={handleInputChange}
                    placeholder="Bachelor of Science in Computer Science"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Institution *
                  </label>
                  <Input
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    placeholder="University Name"
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
                    placeholder="City, State"
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
                    placeholder="2018 - 2022"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    GPA
                  </label>
                  <Input
                    name="gpa"
                    value={formData.gpa}
                    onChange={handleInputChange}
                    placeholder="3.8/4.0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Description
                </label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Additional details, honors, relevant coursework, etc."
                  rows={3}
                />
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

      {education.length === 0 ? (
        <Card className="p-12 text-center">
          <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No Education Added</h2>
          <p className="text-gray-500 mb-6">Start by adding your educational background</p>
          <Button 
            onClick={() => {
              resetForm();
              setDialogOpen(true);
            }}
            className="bg-black text-white hover:bg-gray-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Education Entry
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6">
          {education
            .sort((a, b) => a.order - b.order)
            .map((item) => (
              <Card key={item.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-black">{item.degree}</h3>
                    <p className="text-lg text-gray-700">{item.institution}</p>
                    <div className="flex items-center space-x-4 text-gray-600 mt-2">
                      <span>{item.location}</span>
                      <span>•</span>
                      <span>{item.duration}</span>
                      {item.gpa && (
                        <>
                          <span>•</span>
                          <span>GPA: {item.gpa}</span>
                        </>
                      )}
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
                {item.description && (
                  <p className="text-gray-700 leading-relaxed">{item.description}</p>
                )}
                <div className="mt-4 text-sm text-gray-500">
                  Order: {item.order}
                </div>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};

export default EducationManager;