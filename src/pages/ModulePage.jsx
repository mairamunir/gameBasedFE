import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Brain, Clock, PlayCircle, CheckCircle2, Gamepad2 } from 'lucide-react';

// Mock data for modules - moved from CandidateDashboard
const assessmentModules = [
  {
    id: 1,
    title: 'Leadership',
    description: 'Identify your leadership style through strategic decision-making scenarios.',
    duration: '25 mins',
    progress: 0,
    status: 'not_started',
    icon: Gamepad2,
    isUnity: true,
  },
  {
    id: 2,
    title: 'Professionalism',
    description: 'Measure key personality traits that influence your workplace behavior and reliability.',
    duration: '30 mins',
    progress: 65,
    status: 'in_progress',
    icon: Brain,
    isUnity: false,
  },
  {
    id: 3,
    title: 'Teamwork',
    description: 'Assess your ability to collaborate, communicate, and contribute effectively in team settings.',
    duration: '20 mins',
    progress: 100,
    status: 'completed',
    icon: Brain,
    isUnity: false,
  },
];

const ModulePage = () => {
  const getModuleStatusElement = (status, progress, isUnity) => {
    switch (status) {
      case 'not_started':
        return (
          <Button asChild>
            <Link to={`/assessment/1`} className="inline-flex items-center">
              <PlayCircle className="mr-2 h-4 w-4" />
              {isUnity ? 'Start Game' : 'Start'}
            </Link>
          </Button>
        );
      case 'in_progress':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <Button asChild variant="outline" size="sm" className="mt-2 w-full">
              <Link to={`/assessment/2`}>
                Continue {isUnity && 'Game'}
              </Link>
            </Button>
          </div>
        );
      case 'completed':
        return (
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center text-emerald-600">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              <span>Completed</span>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to={`/results/3`}>
                View Results
              </Link>
            </Button>
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
          <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
          <p className="text-gray-500">
            Complete assessments to discover your strengths and personality traits.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assessmentModules.map((module) => (
            <Card 
              key={module.id} 
              className={`game-card candidate-card ${
                module.status === 'completed' 
                  ? 'border-emerald-200' 
                  : module.status === 'in_progress' 
                    ? 'border-amber-200' 
                    : ''
              } ${
                module.isUnity ? 'relative overflow-hidden' : ''
              }`}
            >
              
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`h-10 w-10 rounded-lg ${module.isUnity ? 'bg-orange-100 text-orange-600' : 'bg-candidate-accent text-candidate-primary'} flex items-center justify-center`}>
                    <module.icon className="h-5 w-5" />
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{module.duration}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                <p className="text-gray-600 mb-6 text-sm">{module.description}</p>
                {getModuleStatusElement(module.status, module.progress, module.isUnity)}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default ModulePage;
