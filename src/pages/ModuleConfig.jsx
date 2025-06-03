// src/pages/ModuleConfig.jsx

import React, { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Puzzle,
  Brain,
  Clock,
  Lightbulb,
  Users,
  BadgeCheck,
  Save,
} from "lucide-react";
import api from "@/lib/api";

const ModuleConfig = () => {
  // Holds the full list of modules (filtered to active/inactive)
  const [modules, setModules] = useState([]);
  // A local map of moduleId -> boolean (true if “active”)
  const [activeMap, setActiveMap] = useState({});
  // Track loading state for initial fetch
  const [loading, setLoading] = useState(true);

  // Fetch all modules on mount
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await api.get("/api/modules"); // GET /api/modules
        const allModules = res.data.modules || [];
        // Filter out “draft” modules (keep only active/inactive)
        const visibleModules = allModules.filter(
          (m) => m.status === "active" || m.status === "inactive"
        );
        setModules(visibleModules);
        // Initialize activeMap from fetched statuses
        const map = {};
        visibleModules.forEach((m) => {
          map[m._id] = m.status === "active";
        });
        setActiveMap(map);
      } catch (err) {
        console.error("Error fetching modules:", err);
        toast({
          title: "Error",
          description: "Could not load modules.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, []);

  // Toggle one moduleId’s active state
  const handleToggle = (moduleId) => {
    setActiveMap((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  // On Save: for each module whose checkbox state differs from original,
  // send a PATCH /api/modules/:id/status with { status: "active"/"inactive" }.
  const handleSaveConfig = async () => {
    try {
      // Build an array of promises for modules that changed status
      const updates = [];
      modules.forEach((mod) => {
        const currentlyActive = mod.status === "active";
        const desiredActive = !!activeMap[mod._id];
        if (currentlyActive !== desiredActive) {
          // send PATCH
          const newStatus = desiredActive ? "active" : "inactive";
          updates.push(
            api.patch(`/api/modules/${mod._id}/status`, { status: newStatus })
          );
        }
      });

      if (updates.length === 0) {
        toast({
          title: "No Changes",
          description: "You did not change any module status.",
        });
        return;
      }

      // Await all updates
      await Promise.all(updates);
      toast({
        title: "Configuration Saved",
        description: `Updated ${updates.length} module(s).`,
      });

      // Refresh module list to reflect new statuses
      setLoading(true);
      const res = await api.get("/api/modules");
      const allModules = res.data.modules || [];
      const visibleModules = allModules.filter(
        (m) => m.status === "active" || m.status === "inactive"
      );
      setModules(visibleModules);
      const map = {};
      visibleModules.forEach((m) => {
        map[m._id] = m.status === "active";
      });
      setActiveMap(map);
    } catch (err) {
      console.error("Error saving configuration:", err);
      toast({
        title: "Error",
        description: "Failed to save configuration.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Compute total duration of selected modules
  const getTotalDuration = () => {
    return modules
      .filter((m) => activeMap[m._id])
      .reduce((sum, m) => {
        // assume average_time field holds minutes as number
        const mins = typeof m.average_time === "number" ? m.average_time : 0;
        return sum + mins;
      }, 0);
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="container py-10">
          <p className="text-white">Loading modules…</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Assessment Configuration
          </h1>
          <p className="text-white">
            Select which modules to include in candidate assessments
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Left: list of modules with checkboxes */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Select Assessment Modules</CardTitle>
              <CardDescription>
                Choose which modules to include for candidates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-5">
                  {modules.map((module) => {
                    // Pick an icon based on module.type or name
                    // Here’s a simple mapping; adjust as needed
                    let Icon = Users;
                    if (module.name.includes("Leadership")) Icon = Lightbulb;
                    else if (module.name.includes("Emotional")) Icon = Puzzle;
                    else if (module.name.includes("Teamwork")) Icon = Clock;
                    else if (module.type === "behavioral") Icon = Brain;

                    return (
                      <div
                        key={module._id}
                        className="flex items-start space-x-4 border p-4 rounded-md"
                      >
                        <div
                          className={`p-2 rounded-md ${
                            activeMap[module._id]
                              ? "bg-recruiter-accent text-recruiter-primary"
                              : "bg-gray-100"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor={`module-${module._id}`}
                              className="text-base font-medium"
                            >
                              {module.name}
                            </Label>
                            <span className="text-sm text-gray-500">
                              {module.average_time || 0} min
                            </span>
                          </div>
                          {module.description && (
                            <p className="text-sm text-gray-500">
                              {module.description}
                            </p>
                          )}
                        </div>

                        <Checkbox
                          id={`module-${module._id}`}
                          checked={activeMap[module._id] || false}
                          onCheckedChange={() => handleToggle(module._id)}
                        />
                      </div>
                    );
                  })}
                  {modules.length === 0 && (
                    <p className="text-gray-500 text-center py-10">
                      No active/inactive modules found.
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="justify-between border-t p-6">
              <div>
                <p className="text-sm font-medium">
                  Selected:{" "}
                  {modules.filter((m) => activeMap[m._id]).length} of{" "}
                  {modules.length} modules
                </p>
                <p className="text-sm text-gray-500">
                  Total assessment time: {getTotalDuration()} minutes
                </p>
              </div>
              <Button onClick={handleSaveConfig}>
                <Save className="h-4 w-4 mr-2" />
                Save Configuration
              </Button>
            </CardFooter>
          </Card>

          {/* Right: summary card */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration Summary</CardTitle>
              <CardDescription>
                Overview of your assessment setup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Selected Modules</h3>
                {modules.filter((m) => activeMap[m._id]).length > 0 ? (
                  <ul className="space-y-2">
                    {modules
                      .filter((m) => activeMap[m._id])
                      .map((module) => {
                        let Icon = Users;
                        if (module.name.includes("Leadership")) Icon = Lightbulb;
                        else if (module.name.includes("Emotional"))
                          Icon = Puzzle;
                        else if (module.name.includes("Teamwork")) Icon = Clock;
                        else if (module.type === "behavioral") Icon = Brain;

                        return (
                          <li key={`sel-${module._id}`} className="flex items-center">
                            <Icon className="h-4 w-4 mr-2 text-recruiter-primary" />
                            <span className="text-sm">{module.name}</span>
                          </li>
                        );
                      })}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No modules selected</p>
                )}
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-2">Assessment Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Modules:</span>
                    <span className="text-sm">
                      {modules.filter((m) => activeMap[m._id]).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Duration:</span>
                    <span className="text-sm">{getTotalDuration()} minutes</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default ModuleConfig;




// import React, { useEffect, useState } from 'react';
// import PageLayout from '@/components/layout/PageLayout';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Label } from '@/components/ui/label';
// import { Separator } from '@/components/ui/separator';
// import { toast } from '@/hooks/use-toast';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import api from '@/lib/api';

// import {
//   Brain,
//   Users,
//   Lightbulb,
//   HeartHandshake,
//   ShieldCheck,
//   Puzzle,
//   Save,
// } from 'lucide-react';

// const moduleIcons = {
//   'Leadership': ShieldCheck,
//   'Emotional Intelligence': HeartHandshake,
//   'Decision Making': Brain,
//   'Teamwork': Users,
//   'Creativity': Lightbulb,
// };

// const ModuleConfig = () => {
//   const [availableModules, setAvailableModules] = useState([]);
//   const [selectedModules, setSelectedModules] = useState([]);

//   useEffect(() => {
//     const fetchModules = async () => {
//       try {
//         const response = await api.get('/api/modules'); 
//         const modulesFromBE = response.data.modules;

//         const modules = modulesFromBE.map((module) => ({
//           id: module._id,
//           name: module.name,
//           description: module.description || '',
//           icon: moduleIcons[module.name] || Puzzle,
//           duration: module.average_time || 0, // average_time is a number in minutes
//           defaultSelected: true, // You can customize this if needed
//         }));

//         setAvailableModules(modules);

//         setSelectedModules(modules.filter((m) => m.defaultSelected).map((m) => m.id));
//       } catch (error) {
//         console.error('Failed to fetch modules:', error);
//         toast({
//           title: 'Error fetching modules',
//           description: error.message || 'Please try again later.',
//           variant: 'destructive',
//         });
//       }
//     };

//     fetchModules();
//   }, []);

//   const handleModuleToggle = (moduleId) => {
//     setSelectedModules((prev) =>
//       prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
//     );
//   };

//   const handleSaveConfig = () => {
//     toast({
//       title: 'Configuration Saved',
//       description: `${selectedModules.length} modules selected for assessments.`,
//     });
//   };

//   const getTotalDuration = () => {
//     return availableModules
//       .filter((module) => selectedModules.includes(module.id))
//       .reduce((total, module) => total + (module.duration || 0), 0);
//   };

//   return (
//     <PageLayout>
//       <div className="container py-10">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold tracking-tight text-white">
//             Assessment Configuration
//           </h1>
//           <p className="text-white">
//             Select which modules to include in candidate assessments
//           </p>
//         </div>

//         <div className="grid gap-6 md:grid-cols-3">
//           <Card className="md:col-span-2">
//             <CardHeader>
//               <CardTitle>Select Assessment Modules</CardTitle>
//               <CardDescription>
//                 Choose which modules to include in assessments sent to candidates
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <ScrollArea className="h-[500px] pr-4">
//                 <div className="space-y-5">
//                   {availableModules.map((module) => {
//                     const Icon = module.icon;
//                     return (
//                       <div
//                         key={module.id}
//                         className="flex items-start space-x-4 border p-4 rounded-md"
//                       >
//                         <div
//                           className={`p-2 rounded-md ${
//                             selectedModules.includes(module.id)
//                               ? 'bg-recruiter-accent text-recruiter-primary'
//                               : 'bg-gray-100'
//                           }`}
//                         >
//                           <Icon className="h-5 w-5" />
//                         </div>
//                         <div className="flex-1 space-y-1">
//                           <div className="flex items-center justify-between">
//                             <Label
//                               htmlFor={`module-${module.id}`}
//                               className="text-base font-medium"
//                             >
//                               {module.name}
//                             </Label>
//                             <span className="text-sm text-gray-500">
//                               {module.duration} min
//                             </span>
//                           </div>
//                           <p className="text-sm text-gray-500">{module.description}</p>
//                         </div>
//                         <Checkbox
//                           id={`module-${module.id}`}
//                           checked={selectedModules.includes(module.id)}
//                           onCheckedChange={() => handleModuleToggle(module.id)}
//                         />
//                       </div>
//                     );
//                   })}
//                 </div>
//               </ScrollArea>
//             </CardContent>
//             <CardFooter className="justify-between border-t p-6">
//               <div>
//                 <p className="text-sm font-medium">
//                   Selected: {selectedModules.length} of {availableModules.length} modules
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   Total assessment time: {getTotalDuration()} minutes
//                 </p>
//               </div>
//               <Button onClick={handleSaveConfig}>
//                 <Save className="h-4 w-4 mr-2" />
//                 Save Configuration
//               </Button>
//             </CardFooter>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Configuration Summary</CardTitle>
//               <CardDescription>Overview of your assessment setup</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <h3 className="text-sm font-medium mb-2">Selected Modules</h3>
//                 {selectedModules.length > 0 ? (
//                   <ul className="space-y-2">
//                     {availableModules
//                       .filter((module) => selectedModules.includes(module.id))
//                       .map((module) => {
//                         const Icon = module.icon;
//                         return (
//                           <li key={module.id} className="flex items-center">
//                             <Icon className="h-4 w-4 mr-2 text-recruiter-primary" />
//                             <span className="text-sm">{module.name}</span>
//                           </li>
//                         );
//                       })}
//                   </ul>
//                 ) : (
//                   <p className="text-sm text-gray-500">No modules selected</p>
//                 )}
//               </div>

//               <Separator />

//               <div>
//                 <h3 className="text-sm font-medium mb-2">Assessment Details</h3>
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">Modules:</span>
//                     <span className="text-sm">{selectedModules.length}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">Duration:</span>
//                     <span className="text-sm">{getTotalDuration()} minutes</span>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </PageLayout>
//   );
// };

// export default ModuleConfig;


// import React, { useState } from 'react';
// import PageLayout from '@/components/layout/PageLayout';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Label } from '@/components/ui/label';
// import { Separator } from '@/components/ui/separator';
// import { toast } from '@/hooks/use-toast';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { 
//   Puzzle, 
//   Brain, 
//   Clock, 
//   Lightbulb, 
//   Users, 
//   BadgeCheck,
//   Save
// } from 'lucide-react';

// const availableModules = [
//   {
//     id: 1,
//     name: 'Leadership',
//     //description: 'Assesses decision-making and judgment in work scenarios',
//     icon: Lightbulb,
//     defaultSelected: true,
//     duration: '20 min'
//   },
//   {
//     id: 2,
//     name: 'Emotional Intelligence',
//     //description: 'Evaluates personality traits, work preferences, and cultural fit',
//     icon: Puzzle,
//     defaultSelected: true,
//     duration: '15 min'
//   },
//   {
//     id: 3,
//     name: 'Teamwork',
//     //description: 'Evaluates organization and prioritization skills',
//     icon: Clock,
//     defaultSelected: true,
//     duration: '20 min'
//   },
//   // {
//   //   id: 3,
//   //   name: 'Decision Making',
//   //   //description: 'Evaluates organization and prioritization skills',
//   //   icon: Clock,
//   //   defaultSelected: false,
//   //   duration: '20 min'
//   // },
// ];

// const ModuleConfig = () => {
//   const [selectedModules, setSelectedModules] = useState(
//     availableModules.filter(module => module.defaultSelected).map(module => module.id)
//   );
  
//   const handleModuleToggle = (moduleId) => {
//     setSelectedModules(prev => 
//       prev.includes(moduleId)
//         ? prev.filter(id => id !== moduleId)
//         : [...prev, moduleId]
//     );
//   };
  
//   const handleSaveConfig = () => {
//     toast({
//       title: "Configuration Saved",
//       description: `${selectedModules.length} modules selected for assessments.`,
//     });
//   };
  
//   const getTotalDuration = () => {
//     return availableModules
//       .filter(module => selectedModules.includes(module.id))
//       .reduce((total, module) => {
//         const minutes = parseInt(module.duration.split(' ')[0]);
//         return total + minutes;
//       }, 0);
//   };
  
//   return (
//     <PageLayout>
//       <div className="container py-10">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold tracking-tight text-white">Assessment Configuration</h1>
//           <p className="text-white">
//             Select which modules to include in candidate assessments
//           </p>
//         </div>
        
//         <div className="grid gap-6 md:grid-cols-3">
//           <Card className="md:col-span-2">
//             <CardHeader>
//               <CardTitle>Select Assessment Modules</CardTitle>
//               <CardDescription>
//                 Choose which modules to include in assessments sent to candidates
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <ScrollArea className="h-[500px] pr-4">
//                 <div className="space-y-5">
//                   {availableModules.map((module) => {
//                     const Icon = module.icon;
//                     return (
//                       <div key={module.id} className="flex items-start space-x-4 border p-4 rounded-md">
//                         <div className={`p-2 rounded-md ${selectedModules.includes(module.id) ? 'bg-recruiter-accent text-recruiter-primary' : 'bg-gray-100'}`}>
//                           <Icon className="h-5 w-5" />
//                         </div>
//                         <div className="flex-1 space-y-1">
//                           <div className="flex items-center justify-between">
//                             <Label htmlFor={`module-${module.id}`} className="text-base font-medium">
//                               {module.name}
//                             </Label>
//                             <span className="text-sm text-gray-500">{module.duration}</span>
//                           </div>
//                           <p className="text-sm text-gray-500">
//                             {module.description}
//                           </p>
//                         </div>
//                         <Checkbox
//                           id={`module-${module.id}`}
//                           checked={selectedModules.includes(module.id)}
//                           onCheckedChange={() => handleModuleToggle(module.id)}
//                         />
//                       </div>
//                     );
//                   })}
//                 </div>
//               </ScrollArea>
//             </CardContent>
//             <CardFooter className="justify-between border-t p-6">
//               <div>
//                 <p className="text-sm font-medium">
//                   Selected: {selectedModules.length} of {availableModules.length} modules
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   Total assessment time: {getTotalDuration()} minutes
//                 </p>
//               </div>
//               <Button onClick={handleSaveConfig}>
//                 <Save className="h-4 w-4 mr-2" />
//                 Save Configuration
//               </Button>
//             </CardFooter>
//           </Card>
          
//           <Card>
//             <CardHeader>
//               <CardTitle>Configuration Summary</CardTitle>
//               <CardDescription>
//                 Overview of your assessment setup
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <h3 className="text-sm font-medium mb-2">Selected Modules</h3>
//                 {selectedModules.length > 0 ? (
//                   <ul className="space-y-2">
//                     {availableModules
//                       .filter(module => selectedModules.includes(module.id))
//                       .map((module) => {
//                         const Icon = module.icon;
//                         return (
//                           <li key={module.id} className="flex items-center">
//                             <Icon className="h-4 w-4 mr-2 text-recruiter-primary" />
//                             <span className="text-sm">{module.name}</span>
//                           </li>
//                         );
//                       })}
//                   </ul>
//                 ) : (
//                   <p className="text-sm text-gray-500">No modules selected</p>
//                 )}
//               </div>
              
//               <Separator />
              
//               <div>
//                 <h3 className="text-sm font-medium mb-2">Assessment Details</h3>
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">Modules:</span>
//                     <span className="text-sm">{selectedModules.length}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">Duration:</span>
//                     <span className="text-sm">{getTotalDuration()} minutes</span>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </PageLayout>
//   );
// };

// export default ModuleConfig;
