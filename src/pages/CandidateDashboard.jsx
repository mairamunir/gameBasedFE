import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, Award, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

// // Mock data for badges
// const badges = [
//   {
//     id: 1,
//     name: 'First Assessment',
//     description: 'Completed your first assessment',
//     unlocked: true,
//   },
//   {
//     id: 2,
//     name: 'Quick Thinker',
//     description: 'Completed an assessment in record time',
//     unlocked: true,
//   },
//   {
//     id: 3,
//     name: 'Perfectionist',
//     description: 'Achieved 100% completion',
//     unlocked: false,
//   },
// ];

const CandidateDashboard = () => {
  const { user } = useAuth();

  return (
    <PageLayout>
      <div className="container py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Candidate Dashboard</h1>
          <p className="text-gray-500">
            Welcome back, {user?.name}! Continue your assessment journey.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Assessment Progress</CardTitle>
              <CardDescription>Your overall completion rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall</span>
                  <span className="text-sm font-medium">55%</span>
                </div>
                <Progress value={55} className="h-2" />
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="mr-1 h-2 w-2 rounded-full bg-candidate-primary"></div>
                    <span>Completed: 1</span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-1 h-2 w-2 rounded-full bg-amber-500"></div>
                    <span>In Progress: 1</span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-1 h-2 w-2 rounded-full bg-gray-300"></div>
                    <span>Not Started: 1</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/assessments" className="flex items-center justify-center">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    View All Assessments
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader className="pb-2">
              <CardTitle>Badges Earned</CardTitle>
              <CardDescription>Your achievements so far</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                {badges.map((badge) => (
                  <div key={badge.id} className="flex flex-col items-center">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${badge.unlocked ? 'bg-candidate-accent text-candidate-primary' : 'bg-gray-200 text-gray-400'}`}>
                      <Award className="h-6 w-6" />
                    </div>
                    <span className="mt-2 text-xs font-medium text-center">{badge.name}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link to="/badges" className="text-sm text-blue-600 hover:underline">
                  View all badges
                </Link>
              </div>
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Time Spent</CardTitle>
              <CardDescription>Your assessment activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Total Time</p>
                    <p className="text-2xl font-bold">45 minutes</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Average per assessment:</span>
                  <span className="font-medium">22.5 mins</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Last activity:</span>
                  <span className="font-medium">Today, 2:30 PM</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default CandidateDashboard;
