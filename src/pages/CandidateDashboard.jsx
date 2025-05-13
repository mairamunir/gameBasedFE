//assessment bar not working as of yet
import React, { useEffect, useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Link as LinkIcon } from 'lucide-react';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [totalModules, setTotalModules] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch total modules count
        const totalModulesRes = await axios.get('/api/modules/total-modules');
        console.log(totalModulesRes);//need to check /api/modules/total-modules response on postman cause data give some doctype file in developer's console
        setTotalModules(totalModulesRes.data.totalModules);

        // Fetch completed modules count for current user
        const completedRes = await axios.get('/api/moduleResult/completed-count');
        console.log(completedRes); ////need to check /api/moduleResult/completed-count response on postman cause data give some doctype file in developer's console
        setCompletedCount(completedRes.data.completedModules);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setTotalModules(0);
        setCompletedCount(0);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      console.log("agaya bhai 1")
      fetchDashboardData();
    }
  }, [user]);

  // Progress calculations
  const progressPercentage = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;
  const notStartedCount = totalModules - completedCount;

  const handleViewResults = () => {
    if (completedCount < totalModules) {
      alert("You still have modules left, please complete them first.");
    } else {
      navigate('/results');
    }
  };

  if (loading) {
    return (
      <PageLayout hideNavbar>
        <div className="text-white text-center">Loading dashboard...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout hideNavbar>
      <div className="flex flex-col items-center justify-center h-screen space-y-6 text-white">
        <h1 className="text-4xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-lg">Continue your assessment journey.</p>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Assessment Progress</CardTitle>
              <CardDescription>Your overall completion rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall</span>
                  <span className="text-sm font-medium">{progressPercentage}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="mr-1 h-2 w-2 rounded-full bg-candidate-primary"></div>
                    <span>Completed: {completedCount}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-1 h-2 w-2 rounded-full bg-gray-300"></div>
                    <span>Not Started: {notStartedCount}</span>
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

          <Button onClick={handleViewResults} className="text-lg" variant="secondary">
            View Results
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default CandidateDashboard;




// import React, { useEffect, useState } from 'react';
// import PageLayout from '@/components/layout/PageLayout';
// import { Button } from '@/components/ui/button';
// import { useAuth } from '@/contexts/AuthContext';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Progress } from '@/components/ui/progress';
// import { Clock, Award, Link as LinkIcon } from 'lucide-react';
// import { Link } from 'react-router-dom';

// const CandidateDashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [modules, setModules] = useState([]);


//   useEffect(() => {
//     if (user && user._id) {
//       axios.get(`/api/moduleResults/all/user/${user._id}`)
//         .then(res => {
//           setModules(res.data.module_results || []); // fallback to [] just in case
//         })
//         .catch(err => {
//           console.error(err);
//           setModules([]); // fallback in case of error
//         });
//     }
//   }, [user]);


   
//   const handleViewResults = () => {
//     if (!Array.isArray(modules)) {
//       alert("Modules data is still loading. Please wait.");
//       return;
//     }
  
//     const incomplete = modules.some(module => module.Status !== 'Completed');
  
//     if (incomplete) {
//       alert("You still have modules left, please complete them first.");
//     } else {
//       navigate('/results');
//     }
//   };

//   return (
//     <PageLayout hideNavbar>
//       <div className="flex flex-col items-center justify-center h-screen space-y-6 text-white">
//         <h1 className="text-4xl font-bold">Welcome back, {user?.name}!</h1>
//         <p className="text-lg">Continue your assessment journey.</p>

//         <div className="flex flex-col gap-4">
//         <Card>
//              <CardHeader className="pb-2">
//                <CardTitle>Assessment Progress</CardTitle>
//                <CardDescription>Your overall completion rate</CardDescription>
//              </CardHeader>
//              <CardContent>
//                <div className="space-y-4">
//                  <div className="flex items-center justify-between">
//                    <span className="text-sm font-medium">Overall</span>
//                    <span className="text-sm font-medium">55%</span>
//                  </div>
//                  <Progress value={55} className="h-2" />
//                  <div className="flex items-center justify-between text-sm text-gray-500">
//                    <div className="flex items-center">
//                      <div className="mr-1 h-2 w-2 rounded-full bg-candidate-primary"></div>
//                      <span>Completed: 1</span>
//                    </div>
//                    <div className="flex items-center">
//                      <div className="mr-1 h-2 w-2 rounded-full bg-gray-300"></div>
//                      <span>Not Started: 1</span>
//                    </div>
//                  </div>
//                </div>
//                <div className="mt-4">
//                  <Button asChild variant="outline" size="sm" className="w-full">
//                    <Link to="/assessments" className="flex items-center justify-center">
//                      <LinkIcon className="mr-2 h-4 w-4" />
//                      View All Assessments
//                    </Link>
//                  </Button>
//                </div>
//              </CardContent>
//            </Card>

//           <Button onClick={handleViewResults} className="text-lg" variant="secondary">
//             View Results
//           </Button>

//         </div>
//       </div>
//     </PageLayout>
//   );
// };

// export default CandidateDashboard;


// import React from 'react';
// import PageLayout from '@/components/layout/PageLayout';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Progress } from '@/components/ui/progress';
// import { Button } from '@/components/ui/button';
// import { useAuth } from '@/contexts/AuthContext';
// import { Clock, Award, Link as LinkIcon } from 'lucide-react';
// import { Link } from 'react-router-dom';

// const CandidateDashboard = () => {
//   const { user } = useAuth();

//   return (
//     <PageLayout>
//       <div className="container py-10">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold tracking-tight text-white">Candidate Dashboard</h1>
//           <p className="text-white">
//             Welcome back, {user?.name}! Continue your assessment journey.
//           </p>
//         </div>

//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           <Card>
//             <CardHeader className="pb-2">
//               <CardTitle>Assessment Progress</CardTitle>
//               <CardDescription>Your overall completion rate</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-medium">Overall</span>
//                   <span className="text-sm font-medium">55%</span>
//                 </div>
//                 <Progress value={55} className="h-2" />
//                 <div className="flex items-center justify-between text-sm text-gray-500">
//                   <div className="flex items-center">
//                     <div className="mr-1 h-2 w-2 rounded-full bg-candidate-primary"></div>
//                     <span>Completed: 1</span>
//                   </div>
//                   <div className="flex items-center">
//                     <div className="mr-1 h-2 w-2 rounded-full bg-amber-500"></div>
//                     <span>In Progress: 1</span>
//                   </div>
//                   <div className="flex items-center">
//                     <div className="mr-1 h-2 w-2 rounded-full bg-gray-300"></div>
//                     <span>Not Started: 1</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="mt-4">
//                 <Button asChild variant="outline" size="sm" className="w-full">
//                   <Link to="/assessments" className="flex items-center justify-center">
//                     <LinkIcon className="mr-2 h-4 w-4" />
//                     View All Assessments
//                   </Link>
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           {/* <Card>
//             <CardHeader className="pb-2">
//               <CardTitle>Badges Earned</CardTitle>
//               <CardDescription>Your achievements so far</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="flex justify-between">
//                 {badges.map((badge) => (
//                   <div key={badge.id} className="flex flex-col items-center">
//                     <div className={`h-12 w-12 rounded-full flex items-center justify-center ${badge.unlocked ? 'bg-candidate-accent text-candidate-primary' : 'bg-gray-200 text-gray-400'}`}>
//                       <Award className="h-6 w-6" />
//                     </div>
//                     <span className="mt-2 text-xs font-medium text-center">{badge.name}</span>
//                   </div>
//                 ))}
//               </div>
//               <div className="mt-4 text-center">
//                 <Link to="/badges" className="text-sm text-blue-600 hover:underline">
//                   View all badges
//                 </Link>
//               </div>
//             </CardContent>
//           </Card> */}

//           <Card>
//             <CardHeader className="pb-2">
//               <CardTitle>Time Spent</CardTitle>
//               <CardDescription>Your assessment activity</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div className="flex items-center">
//                   <Clock className="mr-2 h-5 w-5 text-gray-500" />
//                   <div>
//                     <p className="text-sm font-medium">Total Time</p>
//                     <p className="text-2xl font-bold">45 minutes</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center justify-between text-sm">
//                   <span>Average per assessment:</span>
//                   <span className="font-medium">22.5 mins</span>
//                 </div>
//                 <div className="flex items-center justify-between text-sm">
//                   <span>Last activity:</span>
//                   <span className="font-medium">Today, 2:30 PM</span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </PageLayout>
//   );
// };

// export default CandidateDashboard;
