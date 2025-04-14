import { useState } from 'react';

import Index from './pages/index';

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
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
   
  );
}

export default App;
