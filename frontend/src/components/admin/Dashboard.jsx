import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Code, 
  FolderOpen, 
  Award, 
  MessageSquare, 
  FileText, 
  Settings,
  Eye,
  TrendingUp
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { data, loading } = usePortfolioData();

  const quickActions = [
    { path: '/admin/hero', icon: User, label: 'Edit Hero', color: 'bg-blue-500' },
    { path: '/admin/about', icon: User, label: 'Edit About', color: 'bg-green-500' },
    { path: '/admin/projects', icon: FolderOpen, label: 'Manage Projects', color: 'bg-purple-500' },
    { path: '/admin/settings', icon: Settings, label: 'Site Settings', color: 'bg-gray-500' },
  ];

  const stats = [
    {
      title: 'Education Entries',
      value: data.education?.length || 0,
      icon: GraduationCap,
      path: '/admin/education'
    },
    {
      title: 'Work Experience',
      value: data.experience?.length || 0,
      icon: Briefcase,
      path: '/admin/experience'
    },
    {
      title: 'Projects',
      value: data.projects?.length || 0,
      icon: FolderOpen,
      path: '/admin/projects'
    },
    {
      title: 'Certifications',
      value: data.certifications?.length || 0,
      icon: Award,
      path: '/admin/certifications'
    },
    {
      title: 'Testimonials',
      value: data.testimonials?.length || 0,
      icon: MessageSquare,
      path: '/admin/testimonials'
    },
    {
      title: 'Blog Articles',
      value: data.blog?.length || 0,
      icon: FileText,
      path: '/admin/blog'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white rounded-lg p-8">
        <h1 className="text-3xl font-light mb-2">Welcome to Your Portfolio Admin</h1>
        <p className="text-gray-300 mb-6">
          Manage all aspects of your portfolio from this dashboard. Click on any section to start editing.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() => window.open('/', '_blank')}
            variant="secondary"
            className="bg-white text-black hover:bg-gray-100"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Live Portfolio
          </Button>
          <Button
            onClick={() => navigate('/admin/settings')}
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-black"
          >
            <Settings className="w-4 h-4 mr-2" />
            Site Settings
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1"
              onClick={() => navigate(stat.path)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-black">{stat.value}</p>
                </div>
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Icon className="w-6 h-6 text-gray-700" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-light text-black mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.path}
                onClick={() => navigate(action.path)}
                variant="outline"
                className="h-20 flex flex-col space-y-2 hover:shadow-lg transition-all duration-200"
              >
                <div className={`p-2 rounded-lg ${action.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-black mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Portfolio Overview
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Hero Section</span>
            <span className="text-sm text-gray-500">
              {data.hero?.name ? `Configured as: ${data.hero.name}` : 'Not configured'}
            </span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-700">About Section</span>
            <span className="text-sm text-gray-500">
              {data.about?.description ? 'Configured' : 'Not configured'}
            </span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Skills</span>
            <span className="text-sm text-gray-500">
              {data.skills?.technical?.length || 0} technical, {data.skills?.soft?.length || 0} soft skills
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;