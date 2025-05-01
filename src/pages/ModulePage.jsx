import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Clock, PlayCircle, CheckCircle2, Brain, Users, HeartHandshake, Lightbulb,ShieldCheck } from 'lucide-react';
import api from '../lib/api';

const moduleIcons = {
    "Leadership": ShieldCheck,
    "Emotional Intelligence": HeartHandshake,
    "Critical Thinking": Brain,
    "Teamwork": Users,
    "Creativity": Lightbulb,
  };
  

const ModulePage = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch modules from the backend
  const fetchModules = async () => {
    try {
      const response = await api.get('/api/modules');
      const modules = response.data.modules; // ✅ Corrected here
      console.log('raw modules from API:', modules)

      const formattedModules = modules.map((module) => ({
        id: module._id,
        title: module.name,
        description: module.description,
        duration: module.average_time ? `${module.average_time} mins` : 'N/A',
        progress: 0,
        status: 'not_started',
      }));

      setModules(formattedModules);
    } catch (err) {
      setError('Failed to load modules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  // Function to return the module status element
  const getModuleStatusElement = (status, progress, id) => {
    switch (status) {
      case 'not_started':
        return (
          <Button asChild>
            <Link to={`/assessment/${id}`} className="inline-flex items-center">
              <PlayCircle className="mr-2 h-4 w-4" />
              Start
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
              <Link to={`/assessment/${id}`}>
                Continue
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
              <Link to={`/results/${id}`}>
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
              className={`game-card candidate-card ${module.status === 'completed' ? 'border-emerald-200' : module.status === 'in_progress' ? 'border-amber-200' : ''}`}
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




// import React from 'react';
// import PageLayout from '@/components/layout/PageLayout';
// import { Card, CardContent } from '@/components/ui/card';
// import { Progress } from '@/components/ui/progress';
// import { Button } from '@/components/ui/button';
// import { Link } from 'react-router-dom';
// import { Brain, Clock, PlayCircle, CheckCircle2, Gamepad2 } from 'lucide-react';
// import api from '../lib/api';

// // Mock data for modules - moved from CandidateDashboard
// const assessmentModules = [
//   {
//     id: 1,
//     title: 'Leadership',
//     description: 'Identify your leadership style through strategic decision-making scenarios.',
//     duration: '25 mins',
//     progress: 0,
//     status: 'not_started',
//     icon: Gamepad2,
//     isUnity: true,
//   },
//   {
//     id: 2,
//     title: 'Professionalism',
//     description: 'Measure key personality traits that influence your workplace behavior and reliability.',
//     duration: '30 mins',
//     progress: 65,
//     status: 'in_progress',
//     icon: Brain,
//     isUnity: false,
//   },
//   {
//     id: 3,
//     title: 'Teamwork',
//     description: 'Assess your ability to collaborate, communicate, and contribute effectively in team settings.',
//     duration: '20 mins',
//     progress: 100,
//     status: 'completed',
//     icon: Brain,
//     isUnity: false,
//   },
// ];

// const ModulePage = () => {
//   const getModuleStatusElement = (status, progress, isUnity) => {
//     switch (status) {
//       case 'not_started':
//         return (
//           <Button asChild>
//             <Link to={`/assessment/1`} className="inline-flex items-center">
//               <PlayCircle className="mr-2 h-4 w-4" />
//               {isUnity ? 'Start Game' : 'Start'}
//             </Link>
//           </Button>
//         );
//       case 'in_progress':
//         return (
//           <div className="space-y-2">
//             <div className="flex items-center justify-between text-sm">
//               <span>Progress</span>
//               <span>{progress}%</span>
//             </div>
//             <Progress value={progress} className="h-2" />
//             <Button asChild variant="outline" size="sm" className="mt-2 w-full">
//               <Link to={`/assessment/2`}>
//                 Continue {isUnity && 'Game'}
//               </Link>
//             </Button>
//           </div>
//         );
//       case 'completed':
//         return (
//           <div className="flex flex-col items-center space-y-2">
//             <div className="flex items-center text-emerald-600">
//               <CheckCircle2 className="mr-2 h-5 w-5" />
//               <span>Completed</span>
//             </div>
//             <Button asChild variant="outline" size="sm">
//               <Link to={`/results/3`}>
//                 View Results
//               </Link>
//             </Button>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <PageLayout>
//       <div className="container py-10">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold tracking-tight text-white">Assessments</h1>
//           <p className="text-white">
//             Complete assessments to discover your strengths and personality traits.
//           </p>
//         </div>
        
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {assessmentModules.map((module) => (
//             <Card 
//               key={module.id} 
//               className={`game-card candidate-card ${
//                 module.status === 'completed' 
//                   ? 'border-emerald-200' 
//                   : module.status === 'in_progress' 
//                     ? 'border-amber-200' 
//                     : ''
//               } ${
//                 module.isUnity ? 'relative overflow-hidden' : ''
//               }`}
//             >

//               <CardContent className="p-6">
//                 <div className="flex justify-between items-start mb-4">
//                   <div className="h-12 w-12 rounded-lg bg-candidate-accent flex items-center justify-center mb-4">
//                     <module.icon className="h-5 w-5" />
//                   </div>
//                   <div className="flex items-center text-sm text-black">
//                     <Clock className="mr-1 h-4 w-4" />
//                     <span>{module.duration}</span>
//                   </div>
//                 </div>
//                 <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
//                 <p className="text-black mb-6 text-sm">{module.description}</p>
//                 {getModuleStatusElement(module.status, module.progress, module.isUnity)}
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </PageLayout>
//   );
// };

// export default ModulePage;
