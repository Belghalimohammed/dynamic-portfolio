import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useToast } from '../../hooks/use-toast';
import { portfolioAPI, adminAPI } from '../../services/api';
import { Upload, Save, Eye, Loader2 } from 'lucide-react';

const HeroManager = () => {
  const [data, setData] = useState({
    name: '',
    job_title: '',
    tagline: '',
    profile_image: '',
    background_image: '',
    resume_url: '',
    social_links: {
      linkedin: '',
      github: '',
      twitter: '',
      email: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState({ profile: false, background: false });
  const { toast } = useToast();

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const response = await portfolioAPI.getHero();
      setData(response.data);
    } catch (error) {
      toast({
        title: "Error loading hero data",
        description: "Failed to fetch hero section data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social_')) {
      const socialKey = name.replace('social_', '');
      setData(prev => ({
        ...prev,
        social_links: {
          ...prev.social_links,
          [socialKey]: value
        }
      }));
    } else {
      setData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = async (file, type) => {
    if (!file) return;

    setUploading(prev => ({ ...prev, [type]: true }));
    
    try {
      const response = await adminAPI.uploadFile(file, 'hero');
      const imageUrl = response.data.url;
      
      const fieldName = type === 'profile' ? 'profile_image' : 'background_image';
      setData(prev => ({
        ...prev,
        [fieldName]: imageUrl
      }));
      
      toast({
        title: "Image uploaded successfully",
        description: `${type} image has been uploaded`
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: `Failed to upload ${type} image`,
        variant: "destructive"
      });
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      await adminAPI.updateHero(data);
      toast({
        title: "Hero section updated",
        description: "Changes have been saved successfully"
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save hero section",
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
        <h1 className="text-3xl font-light text-black">Hero Section</h1>
        <div className="flex space-x-4">
          <Button
            onClick={() => window.open('/', '_blank')}
            variant="outline"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-black text-white hover:bg-gray-800"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Full Name *
              </label>
              <Input
                name="name"
                value={data.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Job Title *
              </label>
              <Input
                name="job_title"
                value={data.job_title}
                onChange={handleInputChange}
                placeholder="e.g., Full-Stack Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Tagline
              </label>
              <Textarea
                name="tagline"
                value={data.tagline}
                onChange={handleInputChange}
                placeholder="Brief description or tagline"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Resume URL
              </label>
              <Input
                name="resume_url"
                value={data.resume_url}
                onChange={handleInputChange}
                placeholder="https://example.com/resume.pdf"
              />
            </div>
          </div>
        </Card>

        {/* Images */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Images</h2>
          <div className="space-y-6">
            {/* Profile Image */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Profile Image
              </label>
              {data.profile_image && (
                <div className="mb-4">
                  <img
                    src={data.profile_image}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                  />
                </div>
              )}
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0], 'profile')}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploading.profile}
                    className="pointer-events-none"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading.profile ? 'Uploading...' : 'Upload Profile Image'}
                  </Button>
                </label>
              </div>
            </div>

            {/* Background Image */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Background Image
              </label>
              {data.background_image && (
                <div className="mb-4">
                  <img
                    src={data.background_image}
                    alt="Background"
                    className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                  />
                </div>
              )}
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0], 'background')}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploading.background}
                    className="pointer-events-none"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading.background ? 'Uploading...' : 'Upload Background Image'}
                  </Button>
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* Social Links */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Social Media Links</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                LinkedIn Profile
              </label>
              <Input
                name="social_linkedin"
                value={data.social_links.linkedin}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                GitHub Profile
              </label>
              <Input
                name="social_github"
                value={data.social_links.github}
                onChange={handleInputChange}
                placeholder="https://github.com/yourusername"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Twitter Profile
              </label>
              <Input
                name="social_twitter"
                value={data.social_links.twitter}
                onChange={handleInputChange}
                placeholder="https://twitter.com/yourusername"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Email Address
              </label>
              <Input
                name="social_email"
                value={data.social_links.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HeroManager;