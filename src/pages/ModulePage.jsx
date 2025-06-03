// src/pages/ModulePage.jsx
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Clock,
  PlayCircle,
  CheckCircle2,
  Brain,
  Users,
  HeartHandshake,
  Lightbulb,
  ShieldCheck,
} from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext'; // <-- to get user id

// Map each module name to a Lucide icon
const moduleIcons = {
  'Leadership' : ShieldCheck,
  'Emotional Intelligence': HeartHandshake,
  'Decision Making': Brain,
  'Teamwork' : Users,
  'Creativity': Lightbulb,
};

const ModulePage = () => {
  const [modules, setModules] = useState([]);
  const [moduleResults, setModuleResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth(); // <-- get logged-in user
  console.log(user.id);

  // 1) Fetch all modules from backend
  const fetchModules = async () => {
    try {
      const response = await api.get('/api/modules');
      // response.data.modules is an array of module objects
      return response.data.modules;
    } catch (err) {
      setError('Failed to load modules');
      return [];
    }
  };

  // 2) Fetch module results for this user
  const fetchModuleResults = async () => {
    try {
      const res = await api.get(`/api/moduleResult/user/${user.id}`);
      // Assuming res.data.module_results is an array of results,
      // each having a module_id property
      return res.data.module_results;
    } catch (err) {
      console.error('Failed to fetch module results', err);
      return [];
    }
  };

  // 3) Load data on mount (modules + results) :contentReference[oaicite:0]{index=0}
  const loadData = async () => {
    setLoading(true);
    try {
      const [modulesData, resultsData] = await Promise.all([
        fetchModules(),
        fetchModuleResults(),
      ]);

      // 4) Filter only modules with status === 'active'
      const activeModules = modulesData.filter(
        (m) => m.status === 'active'
      ); 

      // 5) Combine with results to set status/completion
      const formattedModules = activeModules.map((module) => {
        const result = resultsData.find((r) => r.module_id === module._id);
        return {
          id: module._id,
          title: module.name,
          description: module.description,
          // If your Module schema has average_time field
          duration: module.average_time
            ? `${module.average_time} mins`
            : 'N/A',
          status: result ? 'completed' : 'not_started',
          progress: 0, // placeholder if you track progress
        };
      });

      setModules(formattedModules);
      setModuleResults(resultsData);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  // 6) Render correct action button per module status
  const getModuleStatusElement = (status, progress, id) => {
    switch (status) {
      case 'not_started':
      case 'started':
        return (
          <Button asChild>
            <Link to={`/assessment/${id}`} className="inline-flex items-center">
              <PlayCircle className="mr-2 h-4 w-4" />
              Start
            </Link>
          </Button>
        );
      case 'completed':
        return (
          <div className="flex items-center justify-center text-emerald-600 font-semibold border rounded px-3 py-1">
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Completed
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <PageLayout>
      <div className="container py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Assessments
          </h1>
          <p className="text-white">
            Complete assessments to discover your strengths and personality
            traits.
          </p>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <Card
              key={module.id}
              className={`game-card candidate-card ${
                module.status === 'completed'
                  ? 'border-emerald-200'
                  : module.status === 'started'
                  ? 'border-amber-200'
                  : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 rounded-lg bg-candidate-accent flex items-center justify-center mb-4">
                    {(() => {
                      // 7) Dynamically pick icon based on module title :contentReference[oaicite:2]{index=2}
                      const Icon =
                        moduleIcons[module.title] || Lightbulb;
                      return <Icon className="h-5 w-5" />;
                    })()}
                  </div>
                  <div className="flex items-center text-sm text-black">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{module.duration}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                <p className="text-black mb-6 text-sm">
                  {module.description}
                </p>
                {getModuleStatusElement(
                  module.status,
                  module.progress,
                  module.id
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default ModulePage;

