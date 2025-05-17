import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  Calendar,
  UserCheck,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart3,
  LineChart as LineChartIcon,
  Download,
  Filter,
  Search,
  Award
} from 'lucide-react';

const monthlyCompletionData = [
 // { name: 'Jan', completed: 5, pending: 2 },
  //{ name: 'Feb', completed: 8, pending: 3 },
  //{ name: 'Mar', completed: 6, pending: 1 },
  //{ name: 'Apr', completed: 12, pending: 4 },
  { name: 'May', completed: 9, pending: 3},
  //{ name: 'Jun', completed: 11, pending: 3 },
];

const personalityDistributionData = [
  { name: 'INTJ', value: 15 },
  { name: 'ENFP', value: 25 },
  { name: 'ISTJ', value: 20 },
  { name: 'ESFJ', value: 18 },
  { name: 'Other', value: 22 },
];

const skillsDistributionData = [
  { name: 'Emotional Intelligence', candidates: 20 },
 // { name: 'Communication', candidates: 55 },
  { name: 'Leadership', candidates: 35 },
//  { name: 'Critical Thinking', candidates: 70 },
 // { name: 'Teamwork', candidates: 60 },
];

const assessmentTrendsData = [
  //{ month: 'Jan', assessments: 20, completion: 75 },
  //{ month: 'Feb', assessments: 25, completion: 70 },
  //{ month: 'Mar', assessments: 30, completion: 80 },
  //{ month: 'Apr', assessments: 22, completion: 85 },
  { month: 'May', assessments: 28, completion: 78 },
  //{ month: 'Jun', assessments: 35, completion: 82 },
];

const personalityTraitsData = [
  { trait: 'Introversion (I)', percentage: 65 },
  { trait: 'Intuition (N)', percentage: 55 },
  { trait: 'Thinking (T)', percentage: 70 },
  { trait: 'Judging (J)', percentage: 45 },
];

const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#10B981'];

const Analytics = () => {
  return (
    <PageLayout>
      <div className="container py-10">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Analytics</h1>
            <p className="text-white">
              Track candidate performance and assessment metrics
            </p>
          </div>
          {/* <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div> */}
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 mb-8">
          {/* Each Card here */}
          {/* ... content unchanged, all JSX safe ... */}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid w-full md:w-auto grid-cols-3 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
          </TabsList>

          {/* TabsContent blocks */}
          <TabsContent value="overview">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Assessment Completion Trends */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Assessment Completion Trends</CardTitle>
                  <CardDescription>Monthly assessment completions and pending assessments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={monthlyCompletionData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="completed" stackId="a" fill="#8B5CF6" name="Completed" />
                        <Bar dataKey="pending" stackId="a" fill="#D946EF" name="Pending" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              
              {/* Skills Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills Distribution</CardTitle>
                  <CardDescription>Top skills among candidates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={skillsDistributionData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 70,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip />
                        <Bar dataKey="candidates" fill="#0EA5E9" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="candidates">
            <div className="grid gap-8 md:grid-cols-2">
              
              
              {/* Candidate Growth */}
              <Card>
                <CardHeader>
                  <CardTitle>Candidate Growth</CardTitle>
                  <CardDescription>Monthly candidate registration trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={assessmentTrendsData}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="assessments" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="assessments">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Assessment Completion Rate */}
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Completion Rate</CardTitle>
                  <CardDescription>Monthly completion rate trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={assessmentTrendsData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="completion" stroke="#10B981" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Assessment Volume */}
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Volume</CardTitle>
                  <CardDescription>Monthly assessment volume trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={assessmentTrendsData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="assessments" stroke="#F97316" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Analytics;
