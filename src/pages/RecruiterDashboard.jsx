import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  Users,
  FileCheck,
  Activity,
  Settings,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Mock data for summary stats
const summaryStats = [
  {
    title: 'Total Candidates',
    value: 24,
    change: '+4',
    icon: Users,
    color: 'bg-recruiter-accent text-recruiter-primary',
  },
  {
    title: 'Assessments Completed',
    value: 18,
    change: '+2',
    icon: FileCheck,
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    title: 'Avg. Completion Rate',
    value: '75%',
    change: '+5%',
    icon: Activity,
    color: 'bg-amber-100 text-amber-600',
  },
  {
    title: 'Most Common Trait',
    value: 'Introversion',
    change: '',
    icon: BarChart3,
    color: 'bg-violet-100 text-violet-600',
  },
];

const RecruiterDashboard = () => {
  const { user } = useAuth();

  return (
    <PageLayout>
      <div className="container py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Hello, {user?.name || 'Recruiter'}</h1>
          <p className="text-gray-500">
            You are viewing the recruiter dashboard
          </p>
        </div>

        {/* Summary Statistics */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {summaryStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <div className="flex items-baseline mt-1">
                      <p className="text-2xl font-bold">{stat.value}</p>
                      {stat.change && (
                        <p className="ml-2 text-xs font-medium text-emerald-500">{stat.change}</p>
                      )}
                    </div>
                  </div>
                  <div className={`rounded-lg p-2 ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Links to other pages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:border-recruiter-primary transition-colors duration-200">
            <CardHeader className="pb-2">
              <CardTitle>View Candidates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Browse all candidates, view their assessments and results
              </p>
              <Button asChild>
                <Link to="/candidates">View Candidates</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-recruiter-primary transition-colors duration-200">
            <CardHeader className="pb-2">
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                View detailed analytics about candidates and assessments
              </p>
              <Button asChild>
                <Link to="/analytics">View Analytics</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-recruiter-primary transition-colors duration-200">
            <CardHeader className="pb-2">
              <CardTitle>Assessment Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Configure which modules to include in assessments
              </p>
              <Button asChild>
                <Link to="/assessment-config">Configure Assessments</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default RecruiterDashboard;
