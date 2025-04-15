import { useState } from 'react';

import Index from './pages/index';
import Signup from './pages/signup';
import Login from './pages/login';
import Modulepage from './pages/ModulePage';
import ModuleLayoutPage from './pages/ModuleLayoutPage';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import './App.css';
import { TooltipProvider } from './components/ui/tooltip';



function App() {
  const queryClient = new QueryClient();

  return (
    // <div className="bg-blue-500 text-white p-4">Hello Tailwind</div>

    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/assessments" element={<Modulepage />} />
          <Route path="/assessment/:assessmentId" element={<ModuleLayoutPage />} />


            {/* <Route path="/" element={<Index />} />
            <Route path="signup" element={<Signup/>} />
            <Route path="login" element={<Login/>} /> */}
          </Routes>
          
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
   
  );
}

export default App;
