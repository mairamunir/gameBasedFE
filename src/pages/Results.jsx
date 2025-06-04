import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import api from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription
} from '@/components/ui/alert-dialog';

export default function Results() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [incompleteDialogOpen, setIncompleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user?.id) return;

    Promise.all([
      api.get(`/api/moduleResult/user/${user.id}`),
      api.get('/api/modules/active')
    ])
      .then(async ([resR, resM]) => {
        const results = resR.data.module_results;
        const modules = resM.data.modules;

        if (!results.length || results.length < modules.length) {
          setIncompleteDialogOpen(true); // show dialog if no results
        }

        const chart = await Promise.all(results.map(async (r) => {
          const mod = modules.find(m => m._id === r.module_id);
          let benchmarkDescriptions = [];

          if (mod) {
            try {
              const resB = await api.get(`/api/modules/benchmarks/${mod._id}`);
              benchmarkDescriptions = resB.data.benchmarks;
            } catch (err) {
              console.error("Error fetching benchmarks", err);
            }
          }

          const matchedBenchmark = benchmarkDescriptions.find(b => r.ModuleScore >= b.min_score && r.ModuleScore <= b.max_score);

          return {
            module_id: mod?._id,
            name: mod?.name || 'Unknown',
            score: r.ModuleScore,
            maxScore: mod?.max_score || 0,
            pct: mod?.max_score ? Math.round(r.ModuleScore / mod.max_score * 100) : 0,
            description: matchedBenchmark?.description || "No interpretation available.",
            keyStrengths: matchedBenchmark?.keyStrengths || [],
            potentialChallenges: matchedBenchmark?.potentialChallenges || [],
            developmentRecommendations: matchedBenchmark?.developmentRecommendations || [],
            careerRecommendations: matchedBenchmark?.careerRecommendations || []
          };
        }));

        setData(chart);
      })
      .catch(err => {
        console.error(err);
        setError("Could not load results");
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <PageLayout><p>Loading...</p></PageLayout>;
  if (error) return <PageLayout><p className="text-red-500">{error}</p></PageLayout>;

  return (
    <PageLayout>
      {/* Incomplete assessments popup */}
      <AlertDialog open={incompleteDialogOpen} onOpenChange={setIncompleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Incomplete Assessments</AlertDialogTitle>
            <AlertDialogDescription>
              You need to complete all assessments to access your results.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {/* <AlertDialogCancel onClick={() => setIncompleteDialogOpen(false)}>
              Close
            </AlertDialogCancel> */}
            <AlertDialogAction onClick={() => navigate("/assessments")}>
              Go to Assessments
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {data.length > 0 && (
        <div className="container py-8 space-y-8">
          <div className="grid gap-6 lg:grid-cols-3 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>Your Assessment Overview</CardTitle>
                <CardDescription>Your unique personality profile</CardDescription>
              </CardHeader>
              <CardContent>
                {data.map((d, i) => (
                  <p key={i} className="mb-4 text-gray-700">
                    <strong>{d.name}:</strong> {d.description}
                  </p>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Skill Breakdown</CardTitle>
                <CardDescription>Your preferences on each scale</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.map((d, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{d.name}</span>
                      <span className="text-sm font-medium">{d.pct}%</span>
                    </div>
                    <Progress value={d.pct} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="career">Career Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Strengths</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.flatMap(d => d.keyStrengths).length ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {data.flatMap(d => d.keyStrengths).map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    ) : <p>No strengths identified.</p>}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Potential Challenges</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.flatMap(d => d.potentialChallenges).length ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {data.flatMap(d => d.potentialChallenges).map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    ) : <p>No challenges identified.</p>}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="career">
              <div className="grid gap-6 md:grid-cols-2"> 
                <Card>
                  <CardHeader>
                    <CardTitle>Development Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.flatMap(d => d.developmentRecommendations).length ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {data.flatMap(d => d.developmentRecommendations).map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    ) : <p>No recommendations available.</p>}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Career Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.flatMap(d => d.careerRecommendations).length ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {data.flatMap(d => d.careerRecommendations).map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    ) : <p>No career insights yet.</p>}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </PageLayout>
  );
}


