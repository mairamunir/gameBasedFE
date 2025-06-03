import React, { useEffect, useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, FileText, Clock, Activity, BarChart3 } from 'lucide-react';
import api from '@/lib/api'; // your axios instance
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

export default function AdminDashboard() {
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [totalModules, setTotalModules]       = useState(0);
  const [completedAssessments, setCompleted]  = useState(0);
  const [avgRate, setAvgRate]                 = useState({ completed: 0, inProgress: 0, completionRate: 0 });
  const [modules, setModules]                 = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          candRes,
          modCountRes,
          compCountRes,
          avgRateRes,
          modulesRes
        ] = await Promise.all([
          api.get('/api/auth/usersAll'),
          api.get('/api/modules/total-modules'),
          api.get('/api/moduleResult/dashboard/completed'),
          api.get('/api/moduleResult/dashboard/completion-rate'),
          api.get('/api/modules')
        ]);

        setTotalCandidates(candRes.data.totalUsers);
        setTotalModules(modCountRes.data.totalModules);
        setCompleted(compCountRes.data.completedCount);
        setAvgRate({
          completed: avgRateRes.data.completed,
          inProgress: avgRateRes.data.inProgress,
          completionRate: parseFloat(avgRateRes.data.completionRate)
        });
        setModules(modulesRes.data.modules);
      } catch (err) {
        console.error('Error loading admin dashboard data', err);
      }
    }
    fetchData();
  }, []);

  return (
    <PageLayout>
      <div className="container py-10 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader><CardTitle>Total Users</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-2xl font-bold">{totalCandidates}</p>
              <Users className="h-6 w-6 text-gray-500" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Total Modules</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-2xl font-bold">{totalModules}</p>
              <FileText className="h-6 w-6 text-gray-500" />
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader><CardTitle>Assessments Completed</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-2xl font-bold">{completedAssessments}</p>
              <Clock className="h-6 w-6 text-gray-500" />
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader><CardTitle>Avg. Completion Rate</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-2xl font-bold">{avgRate.completionRate}%</p>
              <Activity className="h-6 w-6 text-gray-500" />
            </CardContent>
          </Card>
        </div>

        {/* Modules Table */}
        <Card>
          <CardHeader><CardTitle>Assessment Modules</CardTitle></CardHeader>
          <CardContent className="p-0 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Max Score</TableHead>
                  {/* <TableHead>Created At</TableHead> */}
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.map(mod => (
                  <TableRow key={mod._id}>
                    <TableCell>{mod.name}</TableCell>
                    <TableCell>{mod.max_score || '—'}</TableCell>
                    {/* <TableCell>{new Date(mod.createdAt).toLocaleDateString()}</TableCell> */}
                    <TableCell>
                      {mod.webgl_url
                        ? <span className="text-green-600">{mod.status}</span>
                        : <span className="text-red-600">Missing WebGL</span>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
