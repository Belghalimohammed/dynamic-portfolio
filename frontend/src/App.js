import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';
import Portfolio from './components/Portfolio';
import Login from './components/admin/Login';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import HeroManager from './components/admin/HeroManager';
import ProtectedRoute from './components/admin/ProtectedRoute';
import './App.css';

// Lazy load admin components for better performance
const AboutManager = React.lazy(() => import('./components/admin/AboutManager'));
const EducationManager = React.lazy(() => import('./components/admin/EducationManager'));
const ExperienceManager = React.lazy(() => import('./components/admin/ExperienceManager'));
const SkillsManager = React.lazy(() => import('./components/admin/SkillsManager'));
const ProjectsManager = React.lazy(() => import('./components/admin/ProjectsManager'));
const CertificationsManager = React.lazy(() => import('./components/admin/CertificationsManager'));
const TestimonialsManager = React.lazy(() => import('./components/admin/TestimonialsManager'));
const BlogManager = React.lazy(() => import('./components/admin/BlogManager'));
const SettingsManager = React.lazy(() => import('./components/admin/SettingsManager'));
const MessagesManager = React.lazy(() => import('./components/admin/MessagesManager'));

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Portfolio */}
            <Route path="/" element={<Portfolio />} />
            
            {/* Admin Login */}
            <Route path="/admin/login" element={<Login />} />
            
            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="hero" element={<HeroManager />} />
              <Route
                path="about"
                element={
                  <React.Suspense fallback={<div className="p-8">Loading...</div>}>
                    <AboutManager />
                  </React.Suspense>
                }
              />
              <Route
                path="education"
                element={
                  <React.Suspense fallback={<div className="p-8">Loading...</div>}>
                    <EducationManager />
                  </React.Suspense>
                }
              />
              <Route
                path="experience"
                element={
                  <React.Suspense fallback={<div className="p-8">Loading...</div>}>
                    <ExperienceManager />
                  </React.Suspense>
                }
              />
              <Route
                path="skills"
                element={
                  <React.Suspense fallback={<div className="p-8">Loading...</div>}>
                    <SkillsManager />
                  </React.Suspense>
                }
              />
              <Route
                path="projects"
                element={
                  <React.Suspense fallback={<div className="p-8">Loading...</div>}>
                    <ProjectsManager />
                  </React.Suspense>
                }
              />
              <Route
                path="certifications"
                element={
                  <React.Suspense fallback={<div className="p-8">Loading...</div>}>
                    <CertificationsManager />
                  </React.Suspense>
                }
              />
              <Route
                path="testimonials"
                element={
                  <React.Suspense fallback={<div className="p-8">Loading...</div>}>
                    <TestimonialsManager />
                  </React.Suspense>
                }
              />
              <Route
                path="blog"
                element={
                  <React.Suspense fallback={<div className="p-8">Loading...</div>}>
                    <BlogManager />
                  </React.Suspense>
                }
              />
              <Route
                path="settings"
                element={
                  <React.Suspense fallback={<div className="p-8">Loading...</div>}>
                    <SettingsManager />
                  </React.Suspense>
                }
              />
              <Route
                path="messages"
                element={
                  <React.Suspense fallback={<div className="p-8">Loading...</div>}>
                    <MessagesManager />
                  </React.Suspense>
                }
              />
            </Route>
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;