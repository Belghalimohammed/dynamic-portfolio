import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useToast } from '../../hooks/use-toast';
import { portfolioAPI, adminAPI } from '../../services/api';
import { Plus, Edit, Trash2, Save, X, Upload, Star, Loader2, MessageSquare } from 'lucide-react';

const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    company: '',
    avatar: '',
    quote: '',
    rating: 5,
    order: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await portfolioAPI.getTestimonials();
      setTestimonials(response.data);
    } catch (error) {
      toast({
        title: "Error loading testimonials",
        description: "Failed to fetch testimonials data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      company: '',
      avatar: '',
      quote: '',
      rating: 5,
      order: testimonials.length
    });
    setEditingItem(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order' || name === 'rating' ? parseInt(value) || 0 : value
    }));
  };

  const handleAvatarUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    try {
      const response = await adminAPI.uploadFile(file, 'testimonials');
      setFormData(prev => ({
        ...prev,
        avatar: response.data.url
      }));
      toast({ title: "Avatar uploaded successfully" });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload avatar",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingItem) {
        await adminAPI.updateTestimonial(editingItem.id, formData);
        toast({ title: "Testimonial updated successfully" });
      } else {
        await adminAPI.createTestimonial(formData);
        toast({ title: "Testimonial added successfully" });
      }
      
      setDialogOpen(false);
      resetForm();
      fetchTestimonials();
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save testimonial",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      position: item.position,
      company: item.company,
      avatar: item.avatar || '',
      quote: item.quote,
      rating: item.rating,
      order: item.order
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await adminAPI.deleteTestimonial(id);
        toast({ title: "Testimonial deleted successfully" });
        fetchTestimonials();
      } catch (error) {
        toast({
          title: "Delete failed",
          description: "Failed to delete testimonial",
          variant: "destructive"
        });
      }
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
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
        <h1 className="text-3xl font-light text-black">Testimonials Management</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="bg-black text-white hover:bg-gray-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Testimonial' : 'Add New Testimonial'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Full Name *
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Position *
                  </label>
                  <Input
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="CEO"
                  />
                </div>
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

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Testimonial Quote *
                </label>
                <Textarea
                  name="quote"
                  value={formData.quote}
                  onChange={handleInputChange}
                  placeholder="Working with [Your Name] was an exceptional experience..."
                  rows={4}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Rating (1-5 stars)
                  </label>
                  <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
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

              {/* Avatar Upload */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Client Avatar
                </label>
                {formData.avatar && (
                  <div className="mb-4">
                    <img
                      src={formData.avatar}
                      alt="Avatar"
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>
                )}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleAvatarUpload(e.target.files[0])}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploading}
                    className="pointer-events-none"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload Avatar'}
                  </Button>
                </label>
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
                  disabled={!formData.name || !formData.position || !formData.company || !formData.quote}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {testimonials.length === 0 ? (
        <Card className="p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No Testimonials Added</h2>
          <p className="text-gray-500 mb-6">Start by adding client testimonials and reviews</p>
          <Button 
            onClick={() => {
              resetForm();
              setDialogOpen(true);
            }}
            className="bg-black text-white hover:bg-gray-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Testimonial
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials
            .sort((a, b) => a.order - b.order)
            .map((testimonial) => (
              <Card key={testimonial.id} className="p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    {testimonial.avatar ? (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-semibold">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-black">{testimonial.name}</h3>
                      <p className="text-gray-600 text-sm">{testimonial.position}</p>
                      <p className="text-gray-500 text-sm">{testimonial.company}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(testimonial)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(testimonial.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-1 mb-3">
                  {renderStars(testimonial.rating)}
                </div>

                <blockquote className="text-gray-700 italic leading-relaxed mb-4">
                  "{testimonial.quote}"
                </blockquote>

                <div className="text-xs text-gray-500">
                  Order: {testimonial.order}
                </div>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};

export default TestimonialsManager;