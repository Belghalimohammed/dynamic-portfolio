import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import { portfolioAPI, adminAPI } from '../../services/api';
import { Save, Palette, Settings, Search, BarChart, Eye, Loader2 } from 'lucide-react';

const SettingsManager = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    primary_color: '#000000',
    secondary_color: '#666666',
    accent_color: '#0066cc',
    font: 'Inter',
    language: 'en',
    seo: {
      title: 'Portfolio',
      description: 'Personal portfolio website',
      keywords: 'portfolio, developer, web development',
      og_image: ''
    },
    analytics: {
      google_analytics_id: '',
      enabled: false
    },
    blog_enabled: true,
    sections: {}
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'auto', label: 'Auto' }
  ];

  const fontOptions = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Poppins', label: 'Poppins' }
  ];

  const sectionsList = [
    { key: 'hero', name: 'Hero Section' },
    { key: 'about', name: 'About Me' },
    { key: 'experience', name: 'Work Experience' },
    { key: 'education', name: 'Education' },
    { key: 'skills', name: 'Skills' },
    { key: 'projects', name: 'Projects' },
    { key: 'certifications', name: 'Certifications' },
    { key: 'testimonials', name: 'Testimonials' },
    { key: 'blog', name: 'Blog' },
    { key: 'contact', name: 'Contact' }
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await portfolioAPI.getSettings();
      setSettings(response.data);
    } catch (error) {
      toast({
        title: "Error loading settings",
        description: "Failed to fetch site settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name, value) => {
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleSectionChange = (sectionKey, field, value) => {
    setSettings(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: {
          ...prev.sections[sectionKey],
          [field]: value
        }
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      await adminAPI.updateSettings(settings);
      toast({
        title: "Settings updated",
        description: "Site settings have been saved successfully"
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save settings",
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
        <h1 className="text-3xl font-light text-black">Site Settings</h1>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-black text-white hover:bg-gray-800"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Theme & Design */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Theme & Design
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Theme
              </label>
              <Select
                value={settings.theme}
                onValueChange={(value) => handleInputChange('theme', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {themeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Primary Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={settings.primary_color}
                    onChange={(e) => handleInputChange('primary_color', e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={settings.primary_color}
                    onChange={(e) => handleInputChange('primary_color', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={settings.secondary_color}
                    onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={settings.secondary_color}
                    onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Accent Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={settings.accent_color}
                    onChange={(e) => handleInputChange('accent_color', e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={settings.accent_color}
                    onChange={(e) => handleInputChange('accent_color', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Font Family
              </label>
              <Select
                value={settings.font}
                onValueChange={(value) => handleInputChange('font', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* SEO Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Search className="w-5 h-5 mr-2" />
            SEO Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Site Title
              </label>
              <Input
                value={settings.seo.title}
                onChange={(e) => handleNestedChange('seo', 'title', e.target.value)}
                placeholder="Your Portfolio"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Meta Description
              </label>
              <Textarea
                value={settings.seo.description}
                onChange={(e) => handleNestedChange('seo', 'description', e.target.value)}
                placeholder="Brief description of your portfolio"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Keywords
              </label>
              <Input
                value={settings.seo.keywords}
                onChange={(e) => handleNestedChange('seo', 'keywords', e.target.value)}
                placeholder="portfolio, developer, web development"
              />
            </div>
          </div>
        </Card>

        {/* Analytics */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <BarChart className="w-5 h-5 mr-2" />
            Analytics
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-black">
                  Enable Analytics
                </label>
                <p className="text-sm text-gray-600">
                  Track visitors with Google Analytics
                </p>
              </div>
              <Switch
                checked={settings.analytics.enabled}
                onCheckedChange={(checked) => handleNestedChange('analytics', 'enabled', checked)}
              />
            </div>

            {settings.analytics.enabled && (
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Google Analytics ID
                </label>
                <Input
                  value={settings.analytics.google_analytics_id}
                  onChange={(e) => handleNestedChange('analytics', 'google_analytics_id', e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
            )}
          </div>
        </Card>

        {/* Blog Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Features
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-black">
                  Enable Blog Section
                </label>
                <p className="text-sm text-gray-600">
                  Show blog/articles section on the portfolio
                </p>
              </div>
              <Switch
                checked={settings.blog_enabled}
                onCheckedChange={(checked) => handleInputChange('blog_enabled', checked)}
              />
            </div>
          </div>
        </Card>

        {/* Section Management */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Section Visibility & Order
          </h2>
          <div className="space-y-4">
            {sectionsList.map((section) => {
              const sectionConfig = settings.sections[section.key] || { enabled: true, order: 0 };
              return (
                <div key={section.key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Switch
                      checked={sectionConfig.enabled}
                      onCheckedChange={(checked) => handleSectionChange(section.key, 'enabled', checked)}
                    />
                    <span className="font-medium">{section.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600">Order:</label>
                    <Input
                      type="number"
                      value={sectionConfig.order}
                      onChange={(e) => handleSectionChange(section.key, 'order', parseInt(e.target.value) || 0)}
                      className="w-20"
                      min="0"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsManager;