import { useState } from 'react';

import Index from './pages/index';
import Signup from './pages/signup';
import Login from './pages/login';
import Modulepage from './pages/ModulePage';
import ModuleLayoutPage from './pages/ModuleLayoutPage';
import ModuleConfig from './pages/ModuleConfig';
import CandidateDashboard from "./pages/CandidateDashboard";
import Candidates from "./pages/Candidates";
import Analytics from "./pages/Analytics";
import Results from "./pages/Results";
import Profile from "./pages/Profile";

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import './App.css';
import { TooltipProvider } from './components/ui/tooltip';
import ProtectedRoute from "./components/auth/ProtectedRoute";


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
          <Route path="/results" element={<Results/>} />

          {/* <Route path="/candidate-dashboard" element={<ProtectedRoute><CandidateDashboard />  </ProtectedRoute>} />

          <Route path="/assessments" element={<ProtectedRoute><Modulepage /></ProtectedRoute>} />
          <Route path="/assessment/:assessmentId" element={<ProtectedRoute><ModuleLayoutPage/></ProtectedRoute>} />
          <Route path="/assessment-config" element={<ProtectedRoute><ModuleConfig /></ProtectedRoute>} />
         
          <Route path="/candidates" element={<ProtectedRoute><Candidates /></ProtectedRoute>} /> 
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />  
          <Route path="/results/:assessmentId" element={<ProtectedRoute><Results /></ProtectedRoute>} /> 
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />         */}

<Route path="/assessments" element={<Modulepage />} />
          <Route path="/assessment/:assessmentId" element={<ModuleLayoutPage />} />
          <Route path="/assessment-config" element={<ModuleConfig />} />
          <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
          <Route path="/candidates" element={<Candidates />} /> 
          <Route path="/analytics" element={<Analytics />} />  
          <Route path="/results/:assessmentId" element={<Results />} /> 
          <Route path="/profile" element={<Profile />} />   
          </Routes>
          
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
   
  );
}

export default App;
