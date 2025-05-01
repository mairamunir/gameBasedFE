import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import UnityAssessment from '@/components/unity/UnityAssessment';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Save, AlertCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const ModuleLayoutPage = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  const [exitDialogOpen, setExitDialogOpen] = useState(false);

  useEffect(() => {
    if (!assessmentId) {
      toast({
        title: 'Assessment not found',
        description: 'The requested assessment could not be found.',
        variant: 'destructive',
      });
      navigate('/candidate-dashboard');
    }
  }, [assessmentId, navigate]);

  // const handleUnityComplete = () => {
  //   toast({
  //     title: 'Assessment Completed',
  //     description: 'Your Unity assessment has been completed successfully.',
  //   });

  //   setTimeout(() => {
  //     navigate(`/results/${assessmentId}`);
  //   }, 1500);
  // };

  const handleUnityComplete = async (resultData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/assessments/${assessmentId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // or use AuthContext
        },
        body: JSON.stringify(resultData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save result');
      }
  
      toast({
        title: 'Assessment Completed',
        description: 'Your result has been saved successfully.',
      });
  
      setTimeout(() => {
        navigate(`/assessments`);
      }, 1500);
    } catch (error) {
      toast({
        title: 'Error Saving Result',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  

  return (
    <PageLayout>
      <div className="container max-w-4xl py-10">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Unity Assessment</h1>
              <p className="text-white">Please complete the Unity WebGL assessment below.</p>
            </div>
            
            <div className="flex items-center gap-4 bg-candidate-primary">
              <Button
                variant="outline"
                size="sm"
                className="w-20"
                onClick={() => setExitDialogOpen(true)}
              >
                Exit
              </Button>
            </div>
          </div>
        </div>

        {/* Unity WebGL Game */}
        <UnityAssessment 
          assessmentId={assessmentId} 
          onComplete={handleUnityComplete}
        />

        {/* Exit Dialog */}
        <AlertDialog open={exitDialogOpen} onOpenChange={setExitDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Exit Assessment?</AlertDialogTitle>
              <AlertDialogDescription>
                Your progress will not be saved. You will have to restart the assessment. Do you still want to exit?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  toast({
                    title: 'Progress Saved',
                    description: 'Your assessment progress has been saved.',
                  });
                  navigate('/candidate-dashboard');
                }}
              >
                Exit
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageLayout>
  );
};

export default ModuleLayoutPage;



// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import PageLayout from '@/components/layout/PageLayout';
// import { Button } from '@/components/ui/button';
// import UnityAssessment from '@/components/unity/UnityAssessment';
// import { toast } from '@/hooks/use-toast';
// import { ArrowLeft, ArrowRight, Save, AlertCircle } from 'lucide-react';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '@/components/ui/alert-dialog';

// const ModuleLayoutPage = () => {
//   const { assessmentId } = useParams();
//   const navigate = useNavigate();

//   const [exitDialogOpen, setExitDialogOpen] = useState(false);
//   const [saveDialogOpen, setSaveDialogOpen] = useState(false);
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     if (!assessmentId) {
//       toast({
//         title: 'Assessment not found',
//         description: 'The requested assessment could not be found.',
//         variant: 'destructive',
//       });
//       navigate('/candidate-dashboard');
//     }
//   }, [assessmentId, navigate]);

//   const handleUnityProgress = (progressValue) => {
//     setProgress(progressValue);
//   };

//   const handleUnityComplete = () => {
//     toast({
//       title: 'Assessment Completed',
//       description: 'Your Unity assessment has been completed successfully.',
//     });

//     setTimeout(() => {
//       navigate(`/results/${assessmentId}`);
//     }, 1500);
//   };

//   const handleUnitySaveProgress = () => {
//     toast({
//       title: 'Progress Saved',
//       description: 'Your Unity assessment progress has been saved successfully.',
//     });
//   };

//   return (
//     <PageLayout>
//       <div className="container max-w-4xl py-10">
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h1 className="text-2xl font-bold tracking-tight text-white">Unity Assessment</h1>
//               <p className="text-white">Please complete the Unity WebGL assessment below.</p>
//             </div>
            
//             <div className="flex items-center gap-4 bg-candidate-primary">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="w-20"
//                 onClick={() => setExitDialogOpen(true)}
//               >
//                 Exit
//               </Button>
//             </div>
//           </div>
          
          
//         </div>

//         {/* Unity WebGL Game */}
//         <UnityAssessment 
//           assessmentId={assessmentId} 
//           onProgress={handleUnityProgress}
//           onComplete={handleUnityComplete}
//           onSaveProgress={handleUnitySaveProgress}
//         />

//         {/* Exit Dialog */}
//         <AlertDialog open={exitDialogOpen} onOpenChange={setExitDialogOpen}>
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle>Exit Assessment?</AlertDialogTitle>
//               <AlertDialogDescription>
//                 Your progress will not be saved. You will have to restart the assessment. Do you still want to exit?
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction
//                 onClick={() => {
//                   toast({
//                     title: 'Progress Saved',
//                     description: 'Your assessment progress has been saved.',
//                   });
//                   navigate('/candidate-dashboard');
//                 }}
//               >
//                 Exit
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
        
//       </div>
//     </PageLayout>
//   );
// };

// export default ModuleLayoutPage;




// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import PageLayout from '@/components/layout/PageLayout';
// import { Button } from '@/components/ui/button';
// import { Progress } from '@/components/ui/progress';
// import { Card, CardContent } from '@/components/ui/card';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import { Label } from '@/components/ui/label';
// import { toast } from '@/hooks/use-toast';
// import { ArrowLeft, ArrowRight, Save, AlertCircle } from 'lucide-react';
// import UnityAssessment from '@/components/unity/UnityAssessment';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '@/components/ui/alert-dialog';

// // Mock assessment data
// const assessmentData = [
//   {
//     id: '1',
//     name: 'MBTI Assessment',
//     description: 'Discover your Myers-Briggs personality type through interactive scenarios.',
//     questions: [
//       {
//         id: 1,
//         scenario: "You've been invited to a large social gathering where you only know a few people.",
//         question: 'How do you typically respond to this situation?',
//         options: [
//           { id: 'a', text: 'I look forward to meeting new people and initiating conversations.' },
//           { id: 'b', text: 'I prefer to stick with the people I know and let others approach me.' },
//           { id: 'c', text: "I'm a bit anxious but will make an effort to meet some new people." },
//           { id: 'd', text: 'I would rather decline the invitation or leave early.' }
//         ],
//         trait: 'extraversion-introversion'
//       },
//       {
//         id: 2,
//         scenario: 'Your team at work is brainstorming solutions to a complex problem.',
//         question: 'Which approach do you typically take?',
//         options: [
//           { id: 'a', text: 'Focus on concrete facts and proven methods that have worked before.' },
//           { id: 'b', text: "Explore new possibilities and theoretical approaches that haven't been tried." },
//           { id: 'c', text: 'Analyze the patterns and connections between different aspects of the problem.' },
//           { id: 'd', text: 'Consider practical constraints and the details needed for implementation.' }
//         ],
//         trait: 'sensing-intuition'
//       },
//       {
//         id: 3,
//         scenario: 'A friend comes to you upset about a conflict with a coworker.',
//         question: "What's your first response?",
//         options: [
//           { id: 'a', text: 'Offer logical advice on how to resolve the situation objectively.' },
//           { id: 'b', text: 'Listen empathetically and validate their feelings about the situation.' },
//           { id: 'c', text: "Share a similar experience to show them they're not alone." },
//           { id: 'd', text: "Help them analyze the other person's perspective and motivations." }
//         ],
//         trait: 'thinking-feeling'
//       },
//       {
//         id: 4,
//         scenario: "You're planning a vacation with friends or family.",
//         question: 'Which approach do you prefer?',
//         options: [
//           { id: 'a', text: 'Create a detailed itinerary with scheduled activities and reservations.' },
//           { id: 'b', text: 'Have a general idea but leave room for spontaneous activities and changes.' },
//           { id: 'c', text: 'Research thoroughly but adapt the plan as the trip progresses.' },
//           { id: 'd', text: 'Decide on destinations but figure out the details as you go.' }
//         ],
//         trait: 'judging-perceiving'
//       },
//       {
//         id: 5,
//         scenario: 'When learning something new, you prefer:',
//         question: 'Which learning approach suits you best?',
//         options: [
//           { id: 'a', text: 'Following step-by-step instructions with clear practical applications.' },
//           { id: 'b', text: 'Understanding the big picture concepts first and then filling in the details.' },
//           { id: 'c', text: 'Experimenting hands-on and learning through trial and error.' },
//           { id: 'd', text: 'Connecting the new information to concepts you already understand.' }
//         ],
//         trait: 'sensing-intuition'
//       }
//     ]
//   },
//   {
//     id: '2',
//     name: 'Big Five Traits',
//     description: 'Evaluate your openness, conscientiousness, extraversion, agreeableness, and neuroticism.',
//     questions: [
//       {
//         id: 1,
//         scenario: 'Your team has a tight deadline for a project but the requirements keep changing.',
//         question: 'How do you typically respond to this situation?',
//         options: [
//           { id: 'a', text: 'I adapt easily and find creative solutions to accommodate the changes.' },
//           { id: 'b', text: 'I get frustrated but follow the new directions as best I can.' },
//           { id: 'c', text: 'I push back and try to maintain the original plan for stability.' },
//           { id: 'd', text: 'I seek clarification on priorities to manage the scope effectively.' }
//         ],
//         trait: 'openness'
//       },
//       {
//         id: 2,
//         scenario: 'You notice a colleague is consistently late submitting their part of a team project.',
//         question: 'What is your most likely reaction?',
//         options: [
//           { id: 'a', text: 'Offer to help them manage their workload and create a schedule.' },
//           { id: 'b', text: 'Feel annoyed but avoid confrontation and work around their delays.' },
//           { id: 'c', text: 'Directly address the issue with them and express your concerns.' },
//           { id: 'd', text: 'Report the problem to management or team leaders.' }
//         ],
//         trait: 'agreeableness'
//       },
//       {
//         id: 3,
//         scenario: 'You have multiple projects with competing deadlines.',
//         question: 'How do you approach this challenge?',
//         options: [
//           { id: 'a', text: 'Create a detailed plan with milestones and stick to it rigorously.' },
//           { id: 'b', text: 'Work on whatever feels most urgent, shifting focus as needed.' },
//           { id: 'c', text: 'Prioritize tasks based on importance and work steadily through them.' },
//           { id: 'd', text: 'Ask for deadline extensions or help from others to manage the load.' }
//         ],
//         trait: 'conscientiousness'
//       }
//     ]
//   }
// ];

// const ModuleLayoutPage = () => {
//   const { assessmentId } = useParams();
//   const navigate = useNavigate();
  
//   const [assessment, setAssessment] = useState(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [progress, setProgress] = useState(0);
//   const [exitDialogOpen, setExitDialogOpen] = useState(false);
//   const [saveDialogOpen, setSaveDialogOpen] = useState(false);
//   const [useUnityInterface, setUseUnityInterface] = useState(true);
  
//   useEffect(() => {
//     const data = assessmentData.find(a => a.id === assessmentId);
//     if (data) {
//       setAssessment(data);
//       if (!useUnityInterface) {
//         updateProgress(0, data.questions.length);
//       }
//     } else {
//       toast({
//         title: 'Assessment not found',
//         description: 'The requested assessment could not be found.',
//         variant: 'destructive',
//       });
//       navigate('/candidate-dashboard');
//     }
//   }, [assessmentId, navigate, useUnityInterface]);
  
//   const updateProgress = (current, total) => {
//     const progressPercentage = Math.round((current / total) * 100);
//     setProgress(progressPercentage);
//   };
  
//   const handleAnswer = (questionId, optionId) => {
//     setAnswers(prev => ({
//       ...prev,
//       [questionId]: optionId,
//     }));
//   };

//   // ... (keep all other functions the same, just remove type annotations)
//   const handleNextQuestion = () => {
//     if (currentQuestionIndex < assessment.questions.length - 1) {
//       setCurrentQuestionIndex(prev => prev + 1);
//       window.scrollTo(0, 0);
//     } else {
//       // If it's the last question, show completion dialog
//       handleSaveAndExit();
//     }
//   };
  
//   const handlePreviousQuestion = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(prev => prev - 1);
//       window.scrollTo(0, 0);
//     }
//   };
  
//   const handleSaveProgress = () => {
//     // In a real app, call API to save progress
//     setSaveDialogOpen(false);
//     toast({
//       title: 'Progress Saved',
//       description: 'Your assessment progress has been saved successfully.',
//     });
//   };
  
//   const handleSaveAndExit = () => {
//     // If it's the last question and all questions are answered
//     if (currentQuestionIndex === assessment.questions.length - 1 && 
//         Object.keys(answers).length === assessment.questions.length) {
      
//       // In a real app, would call API to submit full assessment
//       toast({
//         title: 'Assessment Completed',
//         description: 'Your assessment has been submitted successfully.',
//       });
      
//       // Navigate to results page
//       setTimeout(() => {
//         navigate(`/results/${assessmentId}`);
//       }, 1500);
//     } else {
//       // Otherwise just save progress
//       setSaveDialogOpen(true);
//     }
//   };

//   const handleUnityProgress = (progressValue) => {
//     setProgress(progressValue);
//   };

//   const handleUnityComplete = (unityAnswers) => {
//     // Handle completion from Unity
//     setAnswers(unityAnswers);
    
//     toast({
//       title: 'Assessment Completed',
//       description: 'Your Unity assessment has been completed successfully.',
//     });
    
//     // Navigate to results page
//     setTimeout(() => {
//       navigate(`/results/${assessmentId}`);
//     }, 1500);
//   };

//   const handleUnitySaveProgress = (unityAnswers) => {
//     // Save progress from Unity
//     setAnswers(unityAnswers);
    
//     toast({
//       title: 'Progress Saved',
//       description: 'Your Unity assessment progress has been saved successfully.',
//     });
//   };

//   if (!assessment) {
//     return (
//       <PageLayout>
//         <div className="container py-10 text-center">
//           <p>Loading assessment...</p>
//         </div>
//       </PageLayout>
//     );
//   }
  
//   return (
//     <PageLayout>
//       <div className="container max-w-4xl py-10">
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h1 className="text-2xl font-bold tracking-tight text-white">{assessment.name}</h1>
//               <p className="text-white">{assessment.description}</p>
//             </div>
            
//             <div className="flex items-center gap-4 bg-candidate-primary">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setExitDialogOpen(true)}
//               >
//                 Save & Exit
//               </Button>
//             </div>
//           </div>
          
//           {!useUnityInterface && (
//             <div className="space-y-2">
//               <div className="flex items-center justify-between text-sm text-white">
//                 <span>Question {currentQuestionIndex + 1} of {assessment.questions.length}</span>
//                 <span>{progress}% Complete</span>
//               </div>
//               <Progress value={progress} className="h-2" />
//             </div>
//           )}
//         </div>
        
//         {useUnityInterface ? (
//           <UnityAssessment 
//             assessmentId={assessmentId || '1'} 
//             onProgress={handleUnityProgress}
//             onComplete={handleUnityComplete}
//             onSaveProgress={handleUnitySaveProgress}
//           />
//         ) : (
//           <>
//             <Card className="mb-8 overflow-hidden border-2 animation-fade-in">
//               <div className="bg-gradient-to-r from-candidate-primary to-candidate-secondary p-6 text-white">
//                 <h3 className="text-xl font-medium mb-2">Scenario:</h3>
//                 <p>{assessment.questions[currentQuestionIndex].scenario}</p>
//               </div>
//               <CardContent className="p-6">
//                 <h3 className="text-lg font-medium mb-4">{assessment.questions[currentQuestionIndex].question}</h3>
                
//                 <RadioGroup
//                   value={answers[assessment.questions[currentQuestionIndex].id]}
//                   onValueChange={(value) => handleAnswer(assessment.questions[currentQuestionIndex].id, value)}
//                   className="space-y-4"
//                 >
//                   {assessment.questions[currentQuestionIndex].options.map((option) => (
//                     <div
//                       key={option.id}
//                       className={`flex items-start space-x-2 rounded-lg border p-4 transition-all ${
//                         answers[assessment.questions[currentQuestionIndex].id] === option.id
//                           ? 'border-candidate-primary bg-candidate-accent'
//                           : 'hover:border-gray-300 hover:bg-gray-50'
//                       }`}
//                     >
//                       <RadioGroupItem
//                         value={option.id}
//                         id={`option-${option.id}`}
//                         className="mt-1"
//                       />
//                       <Label
//                         htmlFor={`option-${option.id}`}
//                         className="flex-1 cursor-pointer text-base"
//                       >
//                         {option.text}
//                       </Label>
//                     </div>
//                   ))}
//                 </RadioGroup>
                
//                 {!answers[assessment.questions[currentQuestionIndex].id] && (
//                   <div className="mt-4 flex items-center p-4 text-amber-600 bg-amber-50 rounded-lg">
//                     <AlertCircle className="h-5 w-5 mr-2" />
//                     <p className="text-sm">Please select an answer to continue</p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
            
//             <div className="flex justify-between">
//               <Button
//                 variant="outline"
//                 onClick={handlePreviousQuestion}
//                 disabled={currentQuestionIndex === 0}
//                 className={currentQuestionIndex !== 0 ? 'animate-fade-in' : ''}
//               >
//                 <ArrowLeft className="mr-2 h-4 w-4" />
//                 Previous
//               </Button>
              
//               <Button
//                 onClick={handleNextQuestion}
//                 disabled={!answers[assessment.questions[currentQuestionIndex].id]}
//                 className={answers[assessment.questions[currentQuestionIndex].id] ? 'animate-fade-in' : ''}
//               >
//                 {currentQuestionIndex === assessment.questions.length - 1 ? 'Finish' : 'Next'}
//                 {currentQuestionIndex !== assessment.questions.length - 1 && <ArrowRight className="ml-2 h-4 w-4" />}
//               </Button>
//             </div>
//           </>
//         )}
        
//         {/* Exit Dialog */}
//         <AlertDialog open={exitDialogOpen} onOpenChange={setExitDialogOpen}>
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle>Exit Assessment?</AlertDialogTitle>
//               <AlertDialogDescription>
//                 Your progress will be saved. You can resume the assessment later from where you left off.
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction
//                 onClick={() => {
//                   // In a real app, save progress to API
//                   toast({
//                     title: 'Progress Saved',
//                     description: 'Your assessment progress has been saved.',
//                   });
//                   navigate('/candidate-dashboard');
//                 }}
//               >
//                 Save & Exit
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
        
//         {/* Save Progress Dialog */}
//         <AlertDialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle>Save Your Progress</AlertDialogTitle>
//               <AlertDialogDescription>
//                 {Object.keys(answers).length < assessment.questions.length ? (
//                   <>
//                     You have completed {Object.keys(answers).length} out of {assessment.questions.length} questions.
//                     Would you like to save your progress and continue later?
//                   </>
//                 ) : (
//                   <>
//                     You have completed all questions. Would you like to submit your assessment?
//                   </>
//                 )}
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               {Object.keys(answers).length < assessment.questions.length ? (
//                 <AlertDialogAction onClick={handleSaveProgress}>
//                   <Save className="mr-2 h-4 w-4" />
//                   Save Progress
//                 </AlertDialogAction>
//               ) : (
//                 <AlertDialogAction
//                   onClick={() => {
//                     // Submit assessment
//                     toast({
//                       title: 'Assessment Submitted',
//                       description: 'Your assessment has been submitted successfully.',
//                     });
//                     navigate('/results');
//                   }}
//                 >
//                   Submit Assessment
//                 </AlertDialogAction>
//               )}
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
//       </div>
//     </PageLayout>
//   );
// };

// export default ModuleLayoutPage;