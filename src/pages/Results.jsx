// src/pages/Results.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PageLayout from '@/components/layout/PageLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent
} from '@/components/ui/card';
import {
  ResponsiveContainer,
  BarChart, Bar, Cell,
  PieChart, Pie,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend
} from 'recharts';
import api from '@/lib/api';

const COLORS = ['#F97316', '#0EA5E9', '#4F46E5', '#2E5BFF'];

export default function Results() {
  const { user }        = useAuth();
  const [tab, setTab]   = useState('skills');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    Promise.all([
      api.get(`/api/moduleResult/user/${user.id}`),
      api.get('/api/modules')
    ])
    .then(([resR, resM]) => {
      const results = resR.data.module_results; // [{ module_id, ModuleScore }]
      const modules = resM.data.modules;         // [{ _id, name, max_score }]

      // join
      const chart = results.map((r,i) => {
        const mod = modules.find(m => m._id === r.module_id);
        return {
          name:     mod?.name       || 'Unknown',
          score:    r.ModuleScore,
          maxScore: mod?.max_score  || 0,
          color:    COLORS[i % COLORS.length],
          pct:      mod?.max_score
            ? Math.round(r.ModuleScore / mod.max_score * 100)
            : 0
        };
      });
      setData(chart);
    })
    .catch(err => {
      console.error(err);
      setError("Could not load results");
    })
    .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <PageLayout><p>Loading...</p></PageLayout>;
  if (error)   return <PageLayout><p className="text-red-500">{error}</p></PageLayout>;
  if (!data.length)
    return <PageLayout><p>No completed modules yet.</p></PageLayout>;

  return (
    <PageLayout>
      <div className="container py-8">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="skills">Skill Breakdown</TabsTrigger>
          </TabsList>

          <TabsContent value="skills">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Your Scores</CardTitle>
                <CardDescription>Completed modules</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top:20, right:30, left:100, bottom:5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis type="number" domain={[0,'dataMax']}/>
                    <YAxis dataKey="name" type="category" width={120}/>
                    <Tooltip/>
                    <Legend/>
                    <Bar dataKey="score" name="Score" radius={[0,4,4,0]}>
                      {data.map((_,i) => (
                        <Cell key={i} fill={data[i].color}/>
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              {data.map((d,i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle>{d.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p><strong>Score:</strong> {d.score} / {d.maxScore}</p>
                    <p className="mt-2"><strong>Percent:</strong> {d.pct}%</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-10">
              <Card>
                <CardHeader>
                  <CardTitle>Proportion</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data}
                        dataKey="score"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {data.map((_,i) => (
                          <Cell key={i} fill={data[i].color}/>
                        ))}
                      </Pie>
                      <Tooltip/>
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}


//-------------------------------------------

// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from '@/components/ui/tabs';
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from '@/components/ui/card';
// import {
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
// } from 'recharts';
// import PageLayout from '@/components/layout/PageLayout';

// // Dummy data
// const skillResults = [
//   {
//     name: 'Leadership',
//     score: 22,
//     maxScore: 25,
//     color: '#4F46E5',
//   },
//   {
//     name: 'Emotional Intelligence',
//     score: 18,
//     maxScore: 25,
//     color: '#10b981',
//   },
// ];

// const getInterpretation = (name, score) => {
//   if (name === 'Leadership') {
//     if (score < 14) return 'Concerning – lacks leadership.';
//     if (score < 18) return 'Mixed – needs coaching on ethics.';
//     if (score < 22) return 'Solid – minor improvement areas.';
//     return 'Excellent – strong leadership skills.';
//   } else if (name === 'Emotional Intelligence') {
//     if (score < 14) return 'Low – struggles with empathy and regulation.';
//     if (score < 18) return 'Developing – some emotional insight.';
//     if (score < 22) return 'Good – emotionally aware and stable.';
//     return 'Excellent – highly emotionally intelligent.';
//   }
//   return 'No interpretation available.';
// };

// const Results = () => {
//   const { assessmentId } = useParams();
//   const [activeTab, setActiveTab] = useState('skills');

//   useEffect(() => {
//     console.log('Fetching results for assessment:', assessmentId);
//     // TODO: fetch real data here and set into state instead of using dummy skillResults
//   }, [assessmentId]);

//   return (
//     <PageLayout>
//       <div className="container py-8">
//         <Tabs value={activeTab} onValueChange={setActiveTab}>
//           <TabsList className="mb-6">
//             <TabsTrigger value="skills">Skill Breakdown</TabsTrigger>
//           </TabsList>

//           <TabsContent value="skills">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Assessment Results</CardTitle>
//                 <CardDescription>
//                   Your performance across assessed skill domains
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="h-96">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart
//                     data={skillResults}
//                     layout="vertical"
//                     margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis type="number" domain={[0, 25]} />
//                     <YAxis dataKey="name" type="category" width={120} />
//                     <Tooltip />
//                     <Legend />
//                     <Bar
//                       dataKey="score"
//                       name="Score"
//                       radius={[0, 4, 4, 0]}
//                     >
//                       {skillResults.map((entry, index) => (
//                         <Cell
//                           key={`cell-${index}`}
//                           fill={entry.color}
//                         />
//                       ))}
//                     </Bar>
//                   </BarChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>

//             <div className="grid gap-6 mt-6 md:grid-cols-2">
//               {skillResults.map((skill, idx) => (
//                 <Card key={idx}>
//                   <CardHeader>
//                     <CardTitle>{skill.name}</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <p className="text-gray-700">
//                       <strong>Score:</strong> {skill.score} / {skill.maxScore}
//                     </p>
//                     <p className="mt-2 text-gray-600">
//                       <strong>Interpretation:</strong>{' '}
//                       {getInterpretation(skill.name, skill.score)}
//                     </p>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>

//             <div className="mt-10">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Skill Proportion</CardTitle>
//                 </CardHeader>
//                 <CardContent className="h-80">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={skillResults}
//                         dataKey="score"
//                         nameKey="name"
//                         cx="50%"
//                         cy="50%"
//                         outerRadius={100}
//                         label
//                       >
//                         {skillResults.map((entry, index) => (
//                           <Cell
//                             key={`cell-${index}`}
//                             fill={entry.color}
//                           />
//                         ))}
//                       </Pie>
//                       <Tooltip />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </PageLayout>
//   );
// };

// export default Results;

//---------------------------------------------------------------------

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import PageLayout from '@/components/layout/PageLayout';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Badge } from '@/components/ui/badge';
// import { Progress } from '@/components/ui/progress';
// import { Button } from '@/components/ui/button';
// import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { Download, Mail, FileText, Share2, Brain, Award } from 'lucide-react';

// const personalityResults = {
//   mbti: 'ENFJ',
//   description: 'The Protagonist (ENFJ) is a charismatic and inspiring leader, able to mesmerize their listeners. They are often politicians, coaches and teachers. They usually see the potential in everyone and help others fulfill their potential.',
//   traits: [
//     { name: 'Extraversion', value: 65, color: '#F97316' },
//     { name: 'Introversion', value: 35, color: '#94a3b8' },
//     { name: 'Intuition', value: 70, color: '#0EA5E9' },
//     { name: 'Sensing', value: 30, color: '#94a3b8' },
//     { name: 'Feeling', value: 75, color: '#4F46E5' },
//     { name: 'Thinking', value: 25, color: '#94a3b8' },
//     { name: 'Judging', value: 60, color: '#2E5BFF' },
//     { name: 'Perceiving', value: 40, color: '#94a3b8' },
//   ],
//   bigFive: [
//     { name: 'Openness', value: 80, color: '#F97316' },
//     { name: 'Conscientiousness', value: 65, color: '#0EA5E9' },
//     { name: 'Extraversion', value: 70, color: '#4F46E5' },
//     { name: 'Agreeableness', value: 85, color: '#10b981' },
//     { name: 'Neuroticism', value: 40, color: '#8b5cf6' },
//   ],
//   strengths: [
//     'Natural leaders and passionate enthusiasts',
//     'Excellent communicators who speak with conviction',
//     'Altruistic and driven to help others succeed',
//     'Reliable and eager to do right by others',
//   ],
//   weaknesses: [
//     'Can be overly idealistic and too selfless',
//     'May struggle with criticism and conflict',
//     'Might have difficulty making tough decisions',
//     'Can experience burnout from over-commitment',
//   ],
//   careerFit: [
//     'Human Resources Manager',
//     'Teacher or Educator',
//     'Healthcare Administrator',
//     'Marketing Manager',
//     'Public Relations Specialist',
//   ],
// };

// const pieData = [
//   { name: 'Extraversion', value: 65 },
//   { name: 'Intuition', value: 70 },
//   { name: 'Feeling', value: 75 },
//   { name: 'Judging', value: 60 },
// ];

// const COLORS = ['#F97316', '#0EA5E9', '#4F46E5', '#2E5BFF'];

// const badgesEarned = [
//   {
//     id: 1,
//     name: 'Personality Discoverer',
//     description: 'Completed your first personality assessment',
//   },
//   {
//     id: 2,
//     name: 'Insights Seeker',
//     description: 'Reviewed all your personality traits',
//   },
//   {
//     id: 3,
//     name: 'Self Awareness',
//     description: 'Completed assessments with honest self-reflection',
//   },
// ];

// const Results = () => {
//   const { assessmentId } = useParams();
//   const [activeTab, setActiveTab] = useState('overview');
  
//   useEffect(() => {
//     console.log('Fetching results for assessment:', assessmentId);
//   }, [assessmentId]);
  
//   return (
//     <PageLayout>
//       <div className="container py-10">
//         <div className="mb-8">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div>
//               <h1 className="text-3xl font-bold tracking-tight">Your Personality Assessment Results</h1>
//               <p className="text-gray-500">
//                 Based on your assessment responses, we've analyzed your personality profile.
//               </p>
//             </div>
//             <div className="flex items-center gap-2">
//               <Button variant="outline" size="sm">
//                 <Download className="mr-2 h-4 w-4" />
//                 Download Report
//               </Button>
//               <Button variant="outline" size="sm">
//                 <Share2 className="mr-2 h-4 w-4" />
//                 Share
//               </Button>
//             </div>
//           </div>
//         </div>
        
//         <div className="grid gap-6 lg:grid-cols-3 mb-8">
//           <Card className="lg:col-span-2">
//             <CardHeader className="pb-2">
//               <CardTitle>MBTI Personality Type</CardTitle>
//               <CardDescription>Your unique personality profile</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="flex flex-col sm:flex-row gap-6 items-center">
//                 <div className="h-40 w-40 rounded-full bg-gradient-to-r from-candidate-primary to-candidate-secondary flex flex-col items-center justify-center text-white">
//                   <span className="text-4xl font-bold">{personalityResults.mbti}</span>
//                   <span className="text-sm font-medium mt-1">Protagonist</span>
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-gray-600">{personalityResults.description}</p>
//                   <div className="flex flex-wrap gap-2 mt-4">
//                     <Badge className="bg-candidate-accent text-candidate-primary">Charismatic</Badge>
//                     <Badge className="bg-candidate-accent text-candidate-primary">Altruistic</Badge>
//                     <Badge className="bg-candidate-accent text-candidate-primary">Empathetic</Badge>
//                     <Badge className="bg-candidate-accent text-candidate-primary">Persuasive</Badge>
//                     <Badge className="bg-candidate-accent text-candidate-primary">Inspiring</Badge>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card>
//             <CardHeader className="pb-2">
//               <CardTitle>MBTI Breakdown</CardTitle>
//               <CardDescription>Your preferences on each scale</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {personalityResults.traits.slice(0, 8).map((trait, index) => (
//                   index % 2 === 0 && (
//                     <div key={trait.name} className="space-y-2">
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm font-medium">{trait.name}</span>
//                         <span className="text-sm font-medium">{personalityResults.traits[index + 1].name}</span>
//                       </div>
//                       <div className="flex h-2 rounded-full bg-gray-200">
//                         <div
//                           className="rounded-l-full"
//                           style={{
//                             width: `${trait.value}%`,
//                             backgroundColor: trait.color,
//                           }}
//                         />
//                         <div
//                           className="rounded-r-full"
//                           style={{
//                             width: `${personalityResults.traits[index + 1].value}%`,
//                             backgroundColor: personalityResults.traits[index + 1].color,
//                           }}
//                         />
//                       </div>
//                       <div className="flex justify-between text-xs text-gray-500">
//                         <span>{trait.value}%</span>
//                         <span>{personalityResults.traits[index + 1].value}%</span>
//                       </div>
//                     </div>
//                   )
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
        
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
//           <TabsList className="mb-4">
//             <TabsTrigger value="overview">Overview</TabsTrigger>
//             <TabsTrigger value="traits">Detailed Traits</TabsTrigger>
//             <TabsTrigger value="career">Career Insights</TabsTrigger>
//             <TabsTrigger value="badges">Badges Earned</TabsTrigger>
//           </TabsList>
          
//           {/* Overview Tab */}
//           <TabsContent value="overview">
//             <div className="grid gap-6 md:grid-cols-2">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Key Strengths</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <ul className="space-y-2">
//                     {personalityResults.strengths.map((strength, index) => (
//                       <li key={index} className="flex items-start">
//                         <div className="mr-2 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center">
//                           <span className="text-emerald-600 text-xs">✓</span>
//                         </div>
//                         <span>{strength}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </CardContent>
//               </Card>
              
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Potential Challenges</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <ul className="space-y-2">
//                     {personalityResults.weaknesses.map((weakness, index) => (
//                       <li key={index} className="flex items-start">
//                         <div className="mr-2 h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center">
//                           <span className="text-amber-600 text-xs">!</span>
//                         </div>
//                         <span>{weakness}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </CardContent>
//               </Card>
              
//               <Card className="md:col-span-2">
//                 <CardHeader>
//                   <CardTitle>Personality Composition</CardTitle>
//                 </CardHeader>
//                 <CardContent className="h-80">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={pieData}
//                         cx="50%"
//                         cy="50%"
//                         labelLine={false}
//                         outerRadius={80}
//                         fill="#8884d8"
//                         dataKey="value"
//                         label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                       >
//                         {pieData.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                         ))}
//                       </Pie>
//                       <Tooltip />
//                       <Legend />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>
          
//           {/* Detailed Traits Tab */}
//           <TabsContent value="traits">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Big Five Personality Traits</CardTitle>
//                 <CardDescription>Your scores on the five major dimensions of personality</CardDescription>
//               </CardHeader>
//               <CardContent className="h-96">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart
//                     data={personalityResults.bigFive}
//                     layout="vertical"
//                     margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis type="number" domain={[0, 100]} />
//                     <YAxis dataKey="name" type="category" width={120} />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="value" name="Score" radius={[0, 4, 4, 0]}>
//                       {personalityResults.bigFive.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Bar>
//                   </BarChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>
            
//             <div className="grid gap-6 mt-6 md:grid-cols-2">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Trait Descriptions</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div>
//                     <h3 className="text-lg font-semibold text-candidate-primary">Openness</h3>
//                     <p className="text-gray-600">Your high score in Openness suggests you are intellectually curious, creative, and open to trying new things. You likely appreciate art, adventure, and unique ideas.</p>
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-semibold text-[#0EA5E9]">Conscientiousness</h3>
//                     <p className="text-gray-600">Your moderate-high score in Conscientiousness indicates you are organized, reliable, and focused on achieving goals. You plan ahead and think about how your behavior affects others.</p>
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-semibold text-[#4F46E5]">Extraversion</h3>
//                     <p className="text-gray-600">Your high score in Extraversion suggests you are outgoing, energetic, and draw energy from social interactions. You are likely talkative and assert yourself in group settings.</p>
//                   </div>
//                 </CardContent>
//               </Card>
              
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Growth Opportunities</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div>
//                     <h3 className="text-lg font-semibold text-[#10b981]">Agreeableness</h3>
//                     <p className="text-gray-600">Your very high score in Agreeableness shows you are compassionate, cooperative, and considerate of others' feelings. While this is a strength, consider developing assertiveness when necessary to avoid being taken advantage of.</p>
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-semibold text-[#8b5cf6]">Neuroticism</h3>
//                     <p className="text-gray-600">Your moderate-low score in Neuroticism indicates you are relatively emotionally stable and resilient. You don't typically get upset easily and can handle stress well. Continue developing mindfulness practices to maintain this stability.</p>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>
          
//           {/* Career Insights Tab */}
//           <TabsContent value="career">
//             <div className="grid gap-6 md:grid-cols-3">
//               <Card className="md:col-span-2">
//                 <CardHeader>
//                   <CardTitle>Career Recommendations</CardTitle>
//                   <CardDescription>Based on your personality profile</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid gap-4 md:grid-cols-2">
//                     {personalityResults.careerFit.map((career, index) => (
//                       <div key={index} className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
//                         <div className="mr-3 h-10 w-10 rounded-lg bg-candidate-accent flex items-center justify-center">
//                           <span className="text-candidate-primary font-bold">{index + 1}</span>
//                         </div>
//                         <div>
//                           <p className="font-medium">{career}</p>
//                           <p className="text-sm text-gray-500">High compatibility</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   <div className="mt-6">
//                     <Button variant="outline" className="w-full">
//                       <FileText className="mr-2 h-4 w-4" />
//                       Download Full Career Report
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
              
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Workplace Preferences</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div>
//                       <div className="flex items-center justify-between mb-1">
//                         <span className="text-sm font-medium">Team-oriented</span>
//                         <span className="text-sm">85%</span>
//                       </div>
//                       <Progress value={85} className="h-2" />
//                     </div>
//                     <div>
//                       <div className="flex items-center justify-between mb-1">
//                         <span className="text-sm font-medium">Leadership potential</span>
//                         <span className="text-sm">90%</span>
//                       </div>
//                       <Progress value={90} className="h-2" />
//                     </div>
//                     <div>
//                       <div className="flex items-center justify-between mb-1">
//                         <span className="text-sm font-medium">Creative environment</span>
//                         <span className="text-sm">75%</span>
//                       </div>
//                       <Progress value={75} className="h-2" />
//                     </div>
//                     <div>
//                       <div className="flex items-center justify-between mb-1">
//                         <span className="text-sm font-medium">Structure preference</span>
//                         <span className="text-sm">65%</span>
//                       </div>
//                       <Progress value={65} className="h-2" />
//                     </div>
//                     <div>
//                       <div className="flex items-center justify-between mb-1">
//                         <span className="text-sm font-medium">Independence</span>
//                         <span className="text-sm">55%</span>
//                       </div>
//                       <Progress value={55} className="h-2" />
//                     </div>
//                   </div>
//                   <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//                     <h4 className="font-medium mb-2">Ideal Work Environment</h4>
//                     <p className="text-sm text-gray-600">
//                       You thrive in collaborative, people-focused environments where you can lead and inspire others. You appreciate structure but also value flexibility for creative expression.
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>
              
//               <Card className="md:col-span-3">
//                 <CardHeader>
//                   <CardTitle>Development Recommendations</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid gap-4 md:grid-cols-3">
//                     <div className="p-4 border rounded-lg">
//                       <div className="mb-3 h-10 w-10 rounded-lg bg-candidate-accent flex items-center justify-center">
//                         <Brain className="h-5 w-5 text-candidate-primary" />
//                       </div>
//                       <h3 className="text-lg font-medium mb-2">Skill Development</h3>
//                       <p className="text-gray-600 text-sm mb-3">
//                         Focus on enhancing these skills to leverage your natural strengths.
//                       </p>
//                       <ul className="space-y-1 text-sm">
//                         <li className="flex items-center">
//                           <span className="mr-2 text-emerald-500">•</span>
//                           <span>Active listening techniques</span>
//                         </li>
//                         <li className="flex items-center">
//                           <span className="mr-2 text-emerald-500">•</span>
//                           <span>Strategic decision-making</span>
//                         </li>
//                         <li className="flex items-center">
//                           <span className="mr-2 text-emerald-500">•</span>
//                           <span>Conflict resolution</span>
//                         </li>
//                       </ul>
//                     </div>
                    
//                     <div className="p-4 border rounded-lg">
//                       <div className="mb-3 h-10 w-10 rounded-lg bg-candidate-accent flex items-center justify-center">
//                         <FileText className="h-5 w-5 text-candidate-primary" />
//                       </div>
//                       <h3 className="text-lg font-medium mb-2">Growth Areas</h3>
//                       <p className="text-gray-600 text-sm mb-3">
//                         Consider developing these aspects to balance your profile.
//                       </p>
//                       <ul className="space-y-1 text-sm">
//                         <li className="flex items-center">
//                           <span className="mr-2 text-amber-500">•</span>
//                           <span>Setting boundaries with others</span>
//                         </li>
//                         <li className="flex items-center">
//                           <span className="mr-2 text-amber-500">•</span>
//                           <span>Objective analysis of situations</span>
//                         </li>
//                         <li className="flex items-center">
//                           <span className="mr-2 text-amber-500">•</span>
//                           <span>Self-care and avoiding burnout</span>
//                         </li>
//                       </ul>
//                     </div>
                    
//                     <div className="p-4 border rounded-lg">
//                       <div className="mb-3 h-10 w-10 rounded-lg bg-candidate-accent flex items-center justify-center">
//                         <Mail className="h-5 w-5 text-candidate-primary" />
//                       </div>
//                       <h3 className="text-lg font-medium mb-2">Next Steps</h3>
//                       <p className="text-gray-600 text-sm mb-3">
//                         Actions to help you leverage these insights effectively.
//                       </p>
//                       <ul className="space-y-1 text-sm">
//                         <li className="flex items-center">
//                           <span className="mr-2 text-blue-500">•</span>
//                           <span>Share results with your manager</span>
//                         </li>
//                         <li className="flex items-center">
//                           <span className="mr-2 text-blue-500">•</span>
//                           <span>Identify mentors with similar profiles</span>
//                         </li>
//                         <li className="flex items-center">
//                           <span className="mr-2 text-blue-500">•</span>
//                           <span>Schedule a career coaching session</span>
//                         </li>
//                       </ul>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>
          
//           {/* Badges Tab */}
//           <TabsContent value="badges">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Badges Earned</CardTitle>
//                 <CardDescription>Recognition for your assessment milestones</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid gap-6 md:grid-cols-3">
//                   {badgesEarned.map((badge) => (
//                     <div key={badge.id} className="flex flex-col items-center text-center p-6 border rounded-lg">
//                       <div className="mb-4 h-20 w-20 rounded-full bg-candidate-accent flex items-center justify-center">
//                         <Award className="h-10 w-10 text-candidate-primary" />
//                       </div>
//                       <h3 className="text-lg font-medium mb-2">{badge.name}</h3>
//                       <p className="text-gray-600 text-sm">{badge.description}</p>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="mt-8 p-6 border rounded-lg bg-gray-50">
//                   <h3 className="text-lg font-medium mb-4 text-center">Badges to Unlock</h3>
//                   <div className="grid gap-6 md:grid-cols-3">
//                     <div className="flex flex-col items-center text-center p-4">
//                       <div className="mb-4 h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
//                         <Award className="h-8 w-8 text-gray-400" />
//                       </div>
//                       <h3 className="text-lg font-medium mb-2">Team Player</h3>
//                       <p className="text-gray-500 text-sm">Complete the team collaboration assessment</p>
//                     </div>
//                     <div className="flex flex-col items-center text-center p-4">
//                       <div className="mb-4 h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
//                         <Award className="h-8 w-8 text-gray-400" />
//                       </div>
//                       <h3 className="text-lg font-medium mb-2">Leadership Potential</h3>
//                       <p className="text-gray-500 text-sm">Complete the leadership style assessment</p>
//                     </div>
//                     <div className="flex flex-col items-center text-center p-4">
//                       <div className="mb-4 h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
//                         <Award className="h-8 w-8 text-gray-400" />
//                       </div>
//                       <h3 className="text-lg font-medium mb-2">Full Profile</h3>
//                       <p className="text-gray-500 text-sm">Complete all available assessments</p>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </PageLayout>
//   );
// };

// export default Results; 