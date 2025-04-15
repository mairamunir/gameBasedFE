import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Gamepad2 } from 'lucide-react';

const UnityPlaceholder = ({ 
  message = "Unity content is not available. This feature requires the Unity WebGL build to be deployed.",
  onRetry 
}) => {
  return (
    <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
      <CardContent className="flex flex-col items-center justify-center p-10 text-center">
        <Gamepad2 className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Unity Assessment Game</h3>
        <p className="text-gray-500 mb-6">{message}</p>
        
        <div className="flex items-center p-4 text-amber-600 bg-amber-50 rounded-lg mb-6">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm">The Unity game build needs to be available in your project's public directory.</p>
        </div>
        
        {onRetry && (
          <Button onClick={onRetry}>
            Retry Loading
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default UnityPlaceholder;
