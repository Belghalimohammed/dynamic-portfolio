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
import { Plus, Edit, Trash2, Save, X, Upload, Eye, Calendar, Clock, Loader2, FileText } from 'lucide-react';

const BlogManager = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    publish_date: new Date().toISOString().split('T')[0],
    read_time: '',
    tags: [],
    image: '',
    featured: false,
    published: true
  });
  const [newTag, setNewTag] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await portfolioAPI.getBlog();
      setArticles(response.data);
    } catch (error) {
      toast({
        title: "Error loading articles",
        description: "Failed to fetch blog articles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      publish_date: new Date().toISOString().split('T')[0],
      read_time: '',
      tags: [],
      image: '',
      featured: false,
      published: true
    });
    setEditingItem(null);
    setNewTag('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    try {
      const response = await adminAPI.uploadFile(file, 'blog');
      setFormData(prev => ({
        ...prev,
        image: response.data.url
      }));
      toast({ title: "Article image uploaded successfully" });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload article image",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSave = async () => {
    try {
      if (editingItem) {
        await adminAPI.updateBlogArticle(editingItem.id, formData);
        toast({ title: "Article updated successfully" });
      } else {
        await adminAPI.createBlogArticle(formData);
        toast({ title: "Article created successfully" });
      }
      
      setDialogOpen(false);
      resetForm();
      fetchArticles();
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save article",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      publish_date: item.publish_date ? item.publish_date.split('T')[0] : new Date().toISOString().split('T')[0],
      read_time: item.read_time,
      tags: item.tags || [],
      image: item.image || '',
      featured: item.featured,
      published: item.published
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await adminAPI.deleteBlogArticle(id);
        toast({ title: "Article deleted successfully" });
        fetchArticles();
      } catch (error) {
        toast({
          title: "Delete failed",
          description: "Failed to delete article",
          variant: "destructive"
        });
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
        <h1 className="text-3xl font-light text-black">Blog Management</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="bg-black text-white hover:bg-gray-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Article' : 'Create New Article'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Article Title *
                </label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Building Scalable React Applications"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Excerpt *
                </label>
                <Textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="Brief description of the article that will appear in previews"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Article Content *
                </label>
                <Textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Write your full article content here..."
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>

              {/* Article Image */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Featured Image
                </label>
                {formData.image && (
                  <div className="mb-4">
                    <img
                      src={formData.image}
                      alt="Article"
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
                    {uploading ? 'Uploading...' : 'Upload Featured Image'}
                  </Button>
                </label>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Publish Date
                  </label>
                  <Input
                    name="publish_date"
                    type="date"
                    value={formData.publish_date}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Read Time
                  </label>
                  <Input
                    name="read_time"
                    value={formData.read_time}
                    onChange={handleInputChange}
                    placeholder="5 min read"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center space-x-2 px-3 py-1"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag..."
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    className="flex-1"
                  />
                  <Button
                    onClick={addTag}
                    variant="outline"
                    disabled={!newTag.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div className="flex space-x-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-black">
                      Featured Article
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
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-black">
                      Published
                    </label>
                    <p className="text-sm text-gray-600">
                      Make article public
                    </p>
                  </div>
                  <Switch
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
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
                  disabled={!formData.title || !formData.excerpt || !formData.content}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingItem ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {articles.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No Articles Published</h2>
          <p className="text-gray-500 mb-6">Start sharing your thoughts and expertise through blog articles</p>
          <Button 
            onClick={() => {
              resetForm();
              setDialogOpen(true);
            }}
            className="bg-black text-white hover:bg-gray-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Write First Article
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles
            .sort((a, b) => new Date(b.publish_date) - new Date(a.publish_date))
            .map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                {article.image && (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex space-x-2">
                      {article.featured && (
                        <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                      )}
                      {!article.published && (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(article)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(article.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-black mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                  
                  <div className="flex items-center space-x-4 text-gray-500 text-sm mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(article.publish_date)}</span>
                    </div>
                    {article.read_time && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{article.read_time}</span>
                      </div>
                    )}
                  </div>
                  
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {article.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{article.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};

export default BlogManager;