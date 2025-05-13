import React, { useState, useEffect } from 'react'; 
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Clock, PlayCircle, CheckCircle2, Brain, Users, HeartHandshake, Lightbulb, ShieldCheck } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '@/contexts/AuthContext'; // <-- to get user id

const moduleIcons = {
  "Leadership": ShieldCheck,
  "Emotional Intelligence": HeartHandshake,
  "Critical Thinking": Brain,
  "Teamwork": Users,
  "Creativity": Lightbulb,
};

const ModulePage = () => {
  const [modules, setModules] = useState([]);
  const [moduleResults, setModuleResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth(); // <-- get logged-in user
  console.log(user.id)

  const fetchModules = async () => {
    try {
      const response = await api.get('/api/modules');
      const modules = response.data.modules;
      return modules;
    } catch (err) {
      setError('Failed to load modules');
      return [];
    }
  };

  const fetchModuleResults = async () => {
    try {
      const res = await api.get(`/api/moduleResult/user/${user.id}`);
      return res.data.module_results;
    } catch (err) {
      console.error('Failed to fetch module results', err);
      return [];
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [modulesData, resultsData] = await Promise.all([
        fetchModules(),
        fetchModuleResults()
      ]);

      const formattedModules = modulesData.map((module) => {
        const result = resultsData.find(r => r.module_id === module._id);

        return {
          id: module._id,
          title: module.name,
          description: module.description,
          duration: module.average_time ? `${module.average_time} mins` : 'N/A',
          status: result ? 'completed' : 'not_started',
          progress: 0, // optionally track progress
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
          <h1 className="text-3xl font-bold tracking-tight text-white">Assessments</h1>
          <p className="text-white">
            Complete assessments to discover your strengths and personality traits.
          </p>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <Card
              key={module.id}
              className={`game-card candidate-card ${
                module.status === 'completed' ? 'border-emerald-200' : 
                module.status === 'started' ? 'border-amber-200' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 rounded-lg bg-candidate-accent flex items-center justify-center mb-4">
                    {
                      (() => {
                        const Icon = moduleIcons[module.title] || Lightbulb;
                        return <Icon className="h-5 w-5" />;
                      })()
                    }
                  </div>
                  <div className="flex items-center text-sm text-black">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{module.duration}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                <p className="text-black mb-6 text-sm">{module.description}</p>
                {getModuleStatusElement(module.status, module.progress, module.id)}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default ModulePage;


