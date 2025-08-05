import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { 
  Home, 
  User, 
  GraduationCap, 
  Briefcase, 
  Code, 
  FolderOpen, 
  Award, 
  MessageSquare, 
  FileText, 
  Settings, 
  Mail, 
  LogOut, 
  Menu, 
  X,
  Eye
} from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: Home, label: 'Dashboard' },
    { path: '/admin/hero', icon: User, label: 'Hero Section' },
    { path: '/admin/about', icon: User, label: 'About Me' },
    { path: '/admin/education', icon: GraduationCap, label: 'Education' },
    { path: '/admin/experience', icon: Briefcase, label: 'Experience' },
    { path: '/admin/skills', icon: Code, label: 'Skills' },
    { path: '/admin/projects', icon: FolderOpen, label: 'Projects' },
    { path: '/admin/certifications', icon: Award, label: 'Certifications' },
    { path: '/admin/testimonials', icon: MessageSquare, label: 'Testimonials' },
    { path: '/admin/blog', icon: FileText, label: 'Blog' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
    { path: '/admin/messages', icon: Mail, label: 'Messages' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const viewPortfolio = () => {
    window.open('/', '_blank');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-16'
      } lg:w-64`}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h1 className={`font-bold text-xl text-black transition-opacity duration-300 ${
              sidebarOpen ? 'opacity-100' : 'opacity-0'
            } lg:opacity-100`}>
              Admin Panel
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <nav className="px-2 pb-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 transition-all duration-200 ${
                  isActive
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className={`transition-opacity duration-300 ${
                  sidebarOpen ? 'opacity-100' : 'opacity-0'
                } lg:opacity-100`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <Button
            onClick={viewPortfolio}
            variant="outline"
            className={`w-full mb-2 justify-start ${
              sidebarOpen ? '' : 'px-2'
            } lg:justify-start lg:px-4`}
          >
            <Eye className="w-4 h-4 flex-shrink-0" />
            <span className={`ml-2 transition-opacity duration-300 ${
              sidebarOpen ? 'opacity-100' : 'opacity-0'
            } lg:opacity-100`}>
              View Portfolio
            </span>
          </Button>
          
          <Button
            onClick={handleLogout}
            variant="outline"
            className={`w-full text-red-600 border-red-200 hover:bg-red-50 justify-start ${
              sidebarOpen ? '' : 'px-2'
            } lg:justify-start lg:px-4`}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className={`ml-2 transition-opacity duration-300 ${
              sidebarOpen ? 'opacity-100' : 'opacity-0'
            } lg:opacity-100`}>
              Logout
            </span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-light text-black">Portfolio Admin</h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={viewPortfolio}
                variant="outline"
                className="hidden sm:flex"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Portfolio
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;