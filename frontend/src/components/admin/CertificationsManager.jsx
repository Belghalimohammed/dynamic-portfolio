import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useToast } from '../../hooks/use-toast';
import { portfolioAPI, adminAPI } from '../../services/api';
import { Plus, Edit, Trash2, Save, X, Upload, ExternalLink, Loader2, Award } from 'lucide-react';

const CertificationsManager = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    date: '',
    credential_id: '',
    image: '',
    url: '',
    order: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      const response = await portfolioAPI.getCertifications();
      setCertifications(response.data);
    } catch (error) {
      toast({
        title: "Error loading certifications",
        description: "Failed to fetch certifications data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      issuer: '',
      date: '',
      credential_id: '',
      image: '',
      url: '',
      order: certifications.length
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

  const handleImageUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    try {
      const response = await adminAPI.uploadFile(file, 'certifications');
      setFormData(prev => ({
        ...prev,
        image: response.data.url
      }));
      toast({ title: "Certificate image uploaded successfully" });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload certificate image",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingItem) {
        await adminAPI.updateCertification(editingItem.id, formData);
        toast({ title: "Certification updated successfully" });
      } else {
        await adminAPI.createCertification(formData);
        toast({ title: "Certification added successfully" });
      }
      
      setDialogOpen(false);
      resetForm();
      fetchCertifications();
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save certification",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      issuer: item.issuer,
      date: item.date,
      credential_id: item.credential_id || '',
      image: item.image || '',
      url: item.url || '',
      order: item.order
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      try {
        await adminAPI.deleteCertification(id);
        toast({ title: "Certification deleted successfully" });
        fetchCertifications();
      } catch (error) {
        toast({
          title: "Delete failed",
          description: "Failed to delete certification",
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
        <h1 className="text-3xl font-light text-black">Certifications Management</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="bg-black text-white hover:bg-gray-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Certification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Certification' : 'Add New Certification'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Certification Name *
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="AWS Certified Solutions Architect"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Issuing Organization *
                  </label>
                  <Input
                    name="issuer"
                    value={formData.issuer}
                    onChange={handleInputChange}
                    placeholder="Amazon Web Services"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Issue Date *
                  </label>
                  <Input
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    placeholder="2024 or March 2024"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Credential ID
                  </label>
                  <Input
                    name="credential_id"
                    value={formData.credential_id}
                    onChange={handleInputChange}
                    placeholder="AWS-SAA-123456"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Verification URL
                  </label>
                  <Input
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    placeholder="https://verify.example.com/cert/123456"
                  />
                </div>
              </div>

              {/* Certificate Badge/Image */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Certificate Badge/Image
                </label>
                {formData.image && (
                  <div className="mb-4">
                    <img
                      src={formData.image}
                      alt="Certificate"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
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
                    {uploading ? 'Uploading...' : 'Upload Certificate Badge'}
                  </Button>
                </label>
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
                  disabled={!formData.name || !formData.issuer || !formData.date}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {certifications.length === 0 ? (
        <Card className="p-12 text-center">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No Certifications Added</h2>
          <p className="text-gray-500 mb-6">Start by adding your professional certifications</p>
          <Button 
            onClick={() => {
              resetForm();
              setDialogOpen(true);
            }}
            className="bg-black text-white hover:bg-gray-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Certification
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications
            .sort((a, b) => a.order - b.order)
            .map((cert) => (
              <Card key={cert.id} className="p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    {cert.image ? (
                      <img
                        src={cert.image}
                        alt="Certificate"
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Award className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-black mb-1">{cert.name}</h3>
                      <p className="text-gray-600 text-sm">{cert.issuer}</p>
                      <p className="text-gray-500 text-sm">{cert.date}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(cert)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(cert.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {cert.credential_id && (
                  <div className="mb-3">
                    <span className="text-xs text-gray-500">Credential ID:</span>
                    <p className="text-sm font-mono text-gray-700">{cert.credential_id}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Order: {cert.order}
                  </div>
                  {cert.url && (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Verify</span>
                    </a>
                  )}
                </div>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};

export default CertificationsManager;