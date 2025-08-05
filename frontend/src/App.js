import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import Portfolio from './components/Portfolio';
import './App.css';

// Backend URL from environment
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/admin/*" element={<div className="p-8 text-center">Admin Panel - Coming Soon!</div>} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;