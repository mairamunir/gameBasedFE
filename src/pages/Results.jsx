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
//               <h1 className="text-3xl font-bold tracking-tight text-white">Your Personality Assessment Results</h1>
//               <p className="text-white">
//                 Based on your assessment responses, we've analyzed your personality profile.
//               </p>
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
//               <CardTitle>Skills Breakdown</CardTitle>
//               <CardDescription>Your skills</CardDescription>
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
//           </TabsList>
          
//           {/* Overview Tab */}
//           <TabsContent value="overview">
//             <div className="grid gap-6 md:grid-cols-2">
//               <Card className="md:col-span-2">
//                 <CardHeader>
//                   <CardTitle>Skills Composition</CardTitle>
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
//                 <CardTitle>Personality Traits</CardTitle>
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
          
         
//         </Tabs>
//       </div>
//     </PageLayout>
//   );
// };

// export default Results;

// src/pages/Results.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useAuth } from "../contexts/AuthContext"; // Make sure your context provides user info

const COLORS = ["#4F46E5", "#E5E7EB"]; // Purple and gray

const Results = () => {
  const { user } = useAuth(); // Assuming this gives you the logged-in user
console.log("User in Results:", user);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user._id) {
      console.log("User is not ready yet");
      return;
    }
  
    const fetchResults = async () => {
      try {
        console.log("Fetching results for:", user._id);
        const res = await api.get(`/api/module-results/results/${user._id}`);
        console.log("Fetched data:", res.data);
        setResults(res.data);
      } catch (err) {
        console.error("Failed to fetch results", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchResults();
  }, [user]);
  

  if (loading) return <div className="text-center mt-8">Loading results...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Assessment Results</h1>
      {results.map((result, index) => {
        const pieData = [
          { name: result.moduleName, value: result.percentage },
          { name: "Remaining", value: 100 - result.percentage },
        ];

        return (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-6 mb-8 border border-gray-200"
          >
            <h2 className="text-xl font-semibold mb-2">{result.moduleName}</h2>
            <p className="text-sm text-gray-600 mb-4">{result.description}</p>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="w-full md:w-1/2 h-64">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      dataKey="value"
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="text-left md:w-1/2">
                <p className="text-lg font-medium mb-2">
                  <span className="text-indigo-600">{result.percentage}%</span> score
                </p>
                <p className="text-gray-700">{result.interpretation}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Results;



// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
// import PageLayout from '@/components/layout/PageLayout';

// // Dummy COLORS for pie
// const COLORS = ['#F97316', '#0EA5E9', '#4F46E5', '#2E5BFF'];

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
//   }, [assessmentId]);

//   return (
//     <PageLayout>
//     <div className="container py-8">
//       <Tabs value={activeTab} onValueChange={setActiveTab}>
//         <TabsList className="mb-6">
//           <TabsTrigger value="skills">Skill Breakdown</TabsTrigger>
//         </TabsList>

//         <TabsContent value="skills">
//           <Card>
//             <CardHeader>
//               <CardTitle>Assessment Results</CardTitle>
//               <CardDescription>Your performance across assessed skill domains</CardDescription>
//             </CardHeader>
//             <CardContent className="h-96">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart
//                   data={skillResults}
//                   layout="vertical"
//                   margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis type="number" domain={[0, 25]} />
//                   <YAxis dataKey="name" type="category" width={120} />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="score" name="Score" radius={[0, 4, 4, 0]}>
//                     {skillResults.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>

//           <div className="grid gap-6 mt-6 md:grid-cols-2">
//             {skillResults.map((skill, index) => (
//               <Card key={index}>
//                 <CardHeader>
//                   <CardTitle>{skill.name}</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-gray-700">
//                     <strong>Score:</strong> {skill.score} / {skill.maxScore}
//                   </p>
//                   <p className="mt-2 text-gray-600">
//                     <strong>Interpretation:</strong> {getInterpretation(skill.name, skill.score)}
//                   </p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>

//           <div className="mt-10">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Skill Proportion</CardTitle>
//               </CardHeader>
//               <CardContent className="h-80">
//                 <ResponsiveContainer>
//                   <PieChart>
//                     <Pie
//                       data={skillResults}
//                       dataKey="score"
//                       nameKey="name"
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={100}
//                       label
//                     >
//                       {skillResults.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//     </PageLayout>
//   );
// };

// export default Results;
