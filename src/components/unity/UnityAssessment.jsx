import React, { useState, useEffect, useRef } from 'react';
import UnityWebGLPlayer from './UnityWebGLPlayer';
import UnityPlaceholder from './UnityPlaceholder';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { Save, AlertCircle } from 'lucide-react';

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
          setAnswers(prev => ({
            ...prev,
            [data.questionId]: data.optionId
          }));
          break;
          
        case 'progress':
          const newProgress = Math.round(data.value * 100);
          setProgress(newProgress);
          onProgress(newProgress);
          break;
          
        case 'complete':
          onComplete(data.answers);
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
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Assessment Progress</span>
          <span>{progress}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <UnityWebGLPlayer
        ref={unityRef}
        unityLoaderUrl="/unity/Build/UnityLoader.js"
        unityDataUrl="/unity/Build/Build.data"
        unityFrameworkUrl="/unity/Build/Build.framework.js"
        unityCodeUrl="/unity/Build/Build.wasm"
        width="100%"
        height="600px"
        onGameLoaded={() => setUnityLoaded(true)}
        onGameMessage={handleUnityMessage}
      />
      
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
      
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm text-blue-700">
        <p className="flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>
            <strong>Note:</strong> This integration requires Unity WebGL build files to be placed in your project's public directory.
            The Unity game should handle scenario questions and send the responses back to React.
          </span>
        </p>
      </div>
    </div>
  );
};

export default UnityAssessment;