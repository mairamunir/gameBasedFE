import React, { useState, useEffect, useRef } from 'react';
//import UnityWebGLPlayer from './UnityWebGLPlayer';
import UnityPlaceholder from './UnityPlaceholder';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { Save, AlertCircle } from 'lucide-react';
import UnityEmbed from './UnityEmbed';

const UnityAssessment = ({
  assessmentId,
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
    try {
      const data = typeof message === 'string' ? JSON.parse(message) : message;
      
      switch (data.type) {
        case 'answer':
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
        console.log('Leadership Score from Unity:', data.score);
        toast({
          title: 'Score Received',
          description: `Your leadership score is ${data.score}`,
        });

        // You can optionally treat this as completion:
        onComplete?.({ score: data.score, answers });
        break;
          
        case 'error':
          toast({
            title: 'Unity Error',
            description: data.message,
            variant: 'destructive',
          });
          break;
          
        default:
          console.log('Unknown message from Unity:', data);
      }
    } catch (error) {
      console.error('Error processing Unity message:', error, message);
    }
  };

  useEffect(() => {
    if (unityLoaded && unityRef.current) {
      unityRef.current.sendMessageToUnity(
        'AssessmentManager', 
        'LoadAssessment', 
        assessmentId
      );
    }
  }, [unityLoaded, assessmentId]);

  const handleSaveProgress = () => {
    if (answers && Object.keys(answers).length > 0) {
      onSaveProgress(answers);
    } else {
      toast({
        title: 'No Progress to Save',
        description: 'You haven\'t answered any questions yet.',
        variant: 'default',
      });
    }
  };

  if (!unityAvailable) {
    return <UnityPlaceholder />;
  }

  return (
    <div className="space-y-6flex flex-col items-center w-full">
      <div className="space-y-2 w-full max-w-4xl">
        <div className="flex items-center justify-between text-sm">
          <span>Assessment Progress</span>
          <span>{progress}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
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
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={handleSaveProgress}
            className="flex items-center"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Progress
          </Button>
        </div>
      )}
      

        
    </div>
  );
};

// The Unity game handles scenario questions and send the responses back to React.

export default UnityAssessment;