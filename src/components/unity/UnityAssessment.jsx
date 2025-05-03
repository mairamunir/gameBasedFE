import React, { useState, useEffect, useRef } from 'react';
import UnityPlaceholder from './UnityPlaceholder';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';
import UnityEmbed from './UnityEmbed';
import api from '@/lib/api'; // your axios instance, baseURL = VITE_API_URL
import { useAuth } from "@/contexts/AuthContext";

const TOTAL_QUESTIONS = 7;

const UnityAssessment = ({
  assessmentId, // module_id
  userId,       // current user’s ID
  onProgress,
  onComplete,
  onSaveProgress,
}) => {
  const [unityAvailable, setUnityAvailable] = useState(true);
  const [answers, setAnswers]       = useState({});
  const [progress, setProgress]     = useState(0);
  const [webglUrl, setWebglUrl] = useState(null);
  const unityRef = useRef(null);

  

  useEffect(() => {
    api.get(`/api/modules/${assessmentId}`)
      .then(({ data }) => {
        setWebglUrl(data.webgl_url);
      })
      .catch(err => {
        console.error('Failed to fetch module info:', err);
      });
  }, [assessmentId]);

  console.log("web link:", webglUrl);

  // 1️⃣ Tell backend we started
  useEffect(() => {
    api.post('/api/moduleResult/start-module', {
      user_id: userId,
      module_id: assessmentId,
    }).then(({ data }) => {
      console.log('Module start response:', data);
    }).catch(err => {
      if (err.response?.status === 409) {
        // conflict → already completed
        alert("You have already completed this module! Please move on to the next one.");
      } else {
        console.error('Failed to start module:', err);
        toast({
          title: 'Error',
          description: 'Could not start module.',
          variant: 'destructive',
        });
      }
    });
  }, [userId, assessmentId]);

  // 2️⃣ Check loader
  useEffect(() => {
    fetch('/unity/Build/UnityLoader.js')
      .then(r => { if (!r.ok) setUnityAvailable(false); })
      .catch(() => setUnityAvailable(false));
  }, []);

  // Handle all Unity → React messages
  const handleUnityMessage = (msg) => {
    let data;
    try {
      data = typeof msg === 'string' ? JSON.parse(msg) : msg;
    } catch {
      return console.error('Bad Unity message:', msg);
    }

    switch (data.type) {
      case 'answer': {
        setAnswers(prev => {
          const updated = { ...prev, [data.questionId]: data.optionId };
          const pct = Math.round((Object.keys(updated).length / TOTAL_QUESTIONS) * 100);
          setProgress(pct);
          onProgress?.(pct);
          return updated;
        });
        break;
      }

      case 'progress': {
        const pct = Math.round(data.value * 100);
        setProgress(pct);
        onProgress?.(pct);
        break;
      }

      case 'complete': {
        onComplete?.(data.answers);
        break;
      }

      case 'UPDATE_LEADERSHIP_SCORE': {
        const score = data.score;
        console.log('Unity score', score, 'userId', userId, 'moduleId', assessmentId);
        toast({
          title: 'Score Received',
          description: `Your leadership score is ${score}`,
        });

        console.log({ userId, assessmentId, score });
        if (!userId || !assessmentId) {
          console.error('Missing userId or moduleId!');
          return toast({
            title: 'Internal error',
            description: 'Cannot submit without userId/moduleId',
            variant: 'destructive',
          });
        }
        // 3️⃣ Submit final score
        api.put('/api/moduleResult/submit-module', {
          user_id: userId,
          module_id: assessmentId,
          ModuleScore: score,
        })
        .then(({ data: resp }) => {
          onComplete?.(resp.module_result);

          // 4️⃣ Redirect based on your backend’s flag
          if (resp.allModulesCompleted) {
            window.location.href = '/results';
          } else {
            window.location.href = '/assessments';
          }
        })
        .catch(err => {
          console.error('Error saving module:', err);
          toast({
            title: 'Save Failed',
            description: 'Could not save your score.',
            variant: 'destructive',
          });
        });

        break;
      }

      case 'error': {
        toast({
          title: 'Unity Error',
          description: data.message,
          variant: 'destructive',
        });
        break;
      }

      default:
        console.log('Unknown Unity message:', data);
    }
  };

  if (!unityAvailable) {
    return <UnityPlaceholder />;
  }

  if (!webglUrl) return <p>Loading module...</p>;

  return (
    <div className="flex flex-col items-center w-full space-y-6">
      <div className="flex justify-center mt-6">
        <UnityEmbed
          ref={unityRef}
          src={webglUrl}
          //src="https://prettywired.github.io/leader/"
          //src="https://prettywired.github.io/WebGL_text2/"
          width="100%"
          height="100%"
          onGameMessage={handleUnityMessage}
        />
      </div>
    </div>
  );
};

export default UnityAssessment;





/*import React, { useState, useEffect, useRef } from 'react';
//import UnityWebGLPlayer from './UnityWebGLPlayer';
import UnityPlaceholder from './UnityPlaceholder';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { Save, AlertCircle } from 'lucide-react';
import UnityEmbed from './UnityEmbed';

const UnityAssessment = ({
  assessmentId, //this is module_id
  userId,     //pass in currently logged in user's ID
  onProgress,
  onComplete,
  onSaveProgress
}) => {
  const [unityLoaded, setUnityLoaded] = useState(false);
  const [unityAvailable, setUnityAvailable] = useState(true);
  const [answers, setAnswers] = useState({});
  const [progress, setProgress] = useState(0);
  const unityRef = useRef(null);
  const TOTAL_QUESTIONS = 7;

   // 1️⃣ Tell the backend the module has started
   useEffect(() => {
    api.post('/moduleResult/start-module', {
      user_id: userId,
      module_id: assessmentId
    }).catch(err => {
      console.error('Failed to start module:', err);
    });
  }, [userId, assessmentId]);

  // 2️⃣ Periodically check the UnityLoader
  useEffect(() => {
    fetch('/unity/Build/UnityLoader.js')
      .then(response => {
        if (!response.ok) {
          setUnityAvailable(false);
        }
      })
      .catch(() => {
        setUnityAvailable(false);
      });
  }, []);

  const handleUnityMessage = (message) => {
    let data;
    try {
      data = typeof message === 'string' ? JSON.parse(message) : message;
      
      switch (data.type) {
        case 'answer':
          // track answers & update progress
          setAnswers(prev => {
            const updatedAnswers = {
              ...prev,
              [data.questionId]: data.optionId
            };
  
            const answeredCount = Object.keys(updatedAnswers).length;
            const newProgress = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);
            setProgress(newProgress);
            onProgress(newProgress);
  
            return updatedAnswers;
          });
          break;
  
          
        case 'progress':
          const unityProgress = Math.round(data.value * 100);
          setProgress(unityProgress);
          onProgress(unityProgress);
          break;
          
        case 'complete':
          onComplete(data.answers);
          break;

        case 'UPDATE_LEADERSHIP_SCORE':
          const score = data.score;
          console.log('Leadership Score from Unity:', data.score);
          toast({
            title: 'Score Received',
            description: `Your leadership score is ${data.score}`,
          });
          
          // 3️⃣ Submit final score
        api.post('/module-result/submitModule', {
          user_id: userId,
          module_id: assessmentId,
          ModuleScore: score
        })
        .then(({ data: resp }) => {
          // you could inspect resp.module_result or call onComplete
          onComplete?.(resp.module_result);

          // 4️⃣ If your backend tells you "allModulesCompleted", redirect accordingly
          // let’s assume your submitModule endpoint returns `{ allModulesCompleted: true/false }`
          if (resp.allModulesCompleted) {
            window.location.href = '/results';
          } else {
            window.location.href = '/assessments';
          }
        })
        .catch(err => {
          console.error('Error saving module:', err);
          toast({ title: 'Save Failed', description: 'Could not save your score.', variant: 'destructive' });
        });
        break;
      }

      case 'error':
        toast({ title: 'Unity Error', description: data.message, variant: 'destructive' });
        break;
    }
  };

  if (!unityAvailable) {
    return <UnityPlaceholder />;
  }

  return (
    <div className="flex flex-col items-center w-full space-y-6">
      <div className="flex justify-center mt-6">
        <UnityEmbed
          ref={unityRef}
          src="https://prettywired.github.io/WebGL_text2/"
          width="1920px"
          height="1080px"
          onGameMessage={handleUnityMessage}
        />
      </div>

      {progress > 0 && progress < 100 && (
        <Button onClick={() => onSaveProgress(answers)} variant="outline" className="flex items-center">
          <Save className="mr-2 h-4 w-4" />
          Save Progress
        </Button>
      )}
    </div>
  );
};

export default UnityAssessment;
*/

//         // You can optionally treat this as completion:
//         onComplete?.({ score: data.score, answers });
//         break;
          
//         case 'error':
//           toast({
//             title: 'Unity Error',
//             description: data.message,
//             variant: 'destructive',
//           });
//           break;
          
//         default:
//           console.log('Unknown message from Unity:', data);
//       }
//     } catch (error) {
//       console.error('Error processing Unity message:', error, message);
//     }
//   };

//   useEffect(() => {
//     if (unityLoaded && unityRef.current) {
//       unityRef.current.sendMessageToUnity(
//         'AssessmentManager', 
//         'LoadAssessment', 
//         assessmentId
//       );
//     }
//   }, [unityLoaded, assessmentId]);

//   const handleSaveProgress = () => {
//     if (answers && Object.keys(answers).length > 0) {
//       onSaveProgress(answers);
//     } else {
//       toast({
//         title: 'No Progress to Save',
//         description: 'You haven\'t answered any questions yet.',
//         variant: 'default',
//       });
//     }
//   };

//   if (!unityAvailable) {
//     return <UnityPlaceholder />;
//   }

//   return (
//     <div className="space-y-6 flex flex-col items-center w-full">
//       {/* <div className="space-y-2 w-full max-w-4xl">
//         <div className="flex items-center justify-between text-sm">
//           <span>Assessment Progress</span>
//           <span>{progress}% Complete</span>
//         </div>
//         <Progress value={progress} className="h-2" />
//       </div> */}
      
//       <div className="flex justify-center mt-6">  
//       <UnityEmbed
//   ref={unityRef}
//   src="https://prettywired.github.io/WebGL_text2/"
//   width="1920px"
//   height="1080px"
//   onGameMessage={handleUnityMessage}
// />
// </div>

//       {progress > 0 && progress < 100 && (
//         <div className="flex justify-center">
//           <Button 
//             variant="outline" 
//             onClick={handleSaveProgress}
//             className="flex items-center"
//           >
//             <Save className="mr-2 h-4 w-4" />
//             Save Progress
//           </Button>
//         </div>
//       )}
      

        
//     </div>
//   );
// };

// // The Unity game handles scenario questions and send the responses back to React.

// export default UnityAssessment;


