import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useToast } from '../../hooks/use-toast';
import { portfolioAPI, adminAPI } from '../../services/api';
import { Plus, Edit, Trash2, Save, X, Upload, ExternalLink, Github, Loader2, FolderOpen } from 'lucide-react';

const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    long_description: '',
    image: '',
    technologies: [],
    github_url: '',
    live_url: '',
    featured: false,
    category: '',
    order: 0
  });
  const [newTechnology, setNewTechnology] = useState('');
  const { toast } = useToast();

  const projectCategories = ['Web Application', 'Mobile App', 'Desktop App', 'API', 'Library', 'Tool', 'Game', 'Other'];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await portfolioAPI.getProjects();
      setProjects(response.data);
    } catch (error) {
      toast({
        title: "Error loading projects",
        description: "Failed to fetch projects data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      long_description: '',
      image: '',
      technologies: [],
      github_url: '',
      live_url: '',
      featured: false,
      category: '',
      order: projects.length
    });
    setEditingItem(null);
    setNewTechnology('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'order' ? parseInt(value) || 0 : value)
    }));
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    try {
      const response = await adminAPI.uploadFile(file, 'projects');
      setFormData(prev => ({
        ...prev,
        image: response.data.url
      }));
      toast({ title: "Image uploaded successfully" });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload project image",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
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
        await adminAPI.updateProject(editingItem.id, formData);
        toast({ title: "Project updated successfully" });
      } else {
        await adminAPI.createProject(formData);
        toast({ title: "Project added successfully" });
      }
      
      setDialogOpen(false);
      resetForm();
      fetchProjects();
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save project",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      long_description: item.long_description,
      image: item.image || '',
      technologies: item.technologies || [],
      github_url: item.github_url || '',
      live_url: item.live_url || '',
      featured: item.featured,
      category: item.category,
      order: item.order
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await adminAPI.deleteProject(id);
        toast({ title: "Project deleted successfully" });
        fetchProjects();
      } catch (error) {
        toast({
          title: "Delete failed",
          description: "Failed to delete project",
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
        <h1 className="text-3xl font-light text-black">Projects Management</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="bg-black text-white hover:bg-gray-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Project' : 'Add New Project'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Project Title *
                  </label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Amazing Project"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="">Select a category</option>
                    {projectCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Short Description *
                </label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the project"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Detailed Description *
                </label>
                <Textarea
                  name="long_description"
                  value={formData.long_description}
                  onChange={handleInputChange}
                  placeholder="Comprehensive description with features, challenges, and outcomes"
                  rows={4}
                />
              </div>

              {/* Project Image */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Project Image
                </label>
                {formData.image && (
                  <div className="mb-4">
                    <img
                      src={formData.image}
                      alt="Project"
                      className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                    />
                  </div>
                )}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploading}
                    className="pointer-events-none"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload Project Image'}
                  </Button>
                </label>
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

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    GitHub URL
                  </label>
                  <Input
                    name="github_url"
                    value={formData.github_url}
                    onChange={handleInputChange}
                    placeholder="https://github.com/username/project"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Live Demo URL
                  </label>
                  <Input
                    name="live_url"
                    value={formData.live_url}
                    onChange={handleInputChange}
                    placeholder="https://project-demo.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-black">
                      Featured Project
                    </label>
                    <p className="text-sm text-gray-600">
                      Show in featured section
                    </p>
                  </div>
                  <Switch
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
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
                  disabled={!formData.title || !formData.category}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <Card className="p-12 text-center">
          <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No Projects Added</h2>
          <p className="text-gray-500 mb-6">Start by adding your first project</p>
          <Button 
            onClick={() => {
              resetForm();
              setDialogOpen(true);
            }}
            className="bg-black text-white hover:bg-gray-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Project
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects
            .sort((a, b) => a.order - b.order)
            .map((project) => (
              <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-black">{project.title}</h3>
                    {project.featured && (
                      <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                    )}
                  </div>
                  
                  <Badge variant="outline" className="mb-3">{project.category}</Badge>
                  
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.technologies.slice(0, 3).map((tech, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.technologies.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-black"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-black"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(project)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-xs text-gray-500">
                    Order: {project.order}
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsManager;