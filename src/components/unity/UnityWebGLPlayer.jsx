import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'; 
import { Card } from '@/components/ui/card';

const UnityWebGLPlayer = forwardRef(({
  unityLoaderUrl,
  unityDataUrl,
  unityFrameworkUrl,
  unityCodeUrl,
  width = '100%',
  height = '600px',
  onGameLoaded,
  onGameMessage,
}, ref) => {
  const canvasRef = useRef(null);
  const loadingBarRef = useRef(null);
  const progressBarRef = useRef(null);
  const loadingTextRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = unityLoaderUrl;
    script.async = true;

    script.onload = () => {
      if (window.createUnityInstance && canvasRef.current) {
        window.createUnityInstance(canvasRef.current, {
          dataUrl: unityDataUrl,
          frameworkUrl: unityFrameworkUrl,
          codeUrl: unityCodeUrl,
          streamingAssetsUrl: "StreamingAssets",
          companyName: "Assessment System",
          productName: "Scenario Assessment",
          productVersion: "1.0",
        }, (progress) => {
          if (progressBarRef.current && loadingTextRef.current) {
            progressBarRef.current.style.width = `${progress * 100}%`;
            loadingTextRef.current.innerText = `Loading: ${Math.round(progress * 100)}%`;
          }
        }).then((unityInstance) => {
          window.unityInstance = unityInstance;

          if (loadingBarRef.current) {
            loadingBarRef.current.style.display = 'none';
          }

          const handleUnityMessage = (message) => {
            if (onGameMessage) {
              onGameMessage(message);
            }
          };

          window.receiveUnityMessage = handleUnityMessage;

          if (onGameLoaded) {
            onGameLoaded();
          }
        }).catch((error) => {
          console.error('Unity WebGL build error:', error);
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      if (window.unityInstance) {
        window.unityInstance.Quit();
        window.unityInstance = null;
      }
      document.body.removeChild(script);
    };
  }, [unityLoaderUrl, unityDataUrl, unityFrameworkUrl, unityCodeUrl, onGameLoaded, onGameMessage]);

  const sendMessageToUnity = (gameObject, method, parameter) => {
    if (window.unityInstance) {
      window.unityInstance.SendMessage(gameObject, method, parameter);
    }
  };

  useImperativeHandle(ref, () => ({
    sendMessageToUnity,
  }));

  return (
    <Card className="relative overflow-hidden rounded-lg border shadow-lg">
      <div 
        ref={loadingBarRef} 
        className="absolute top-0 left-0 w-full bg-gray-200 h-4 z-10"
      >
        <div 
          ref={progressBarRef} 
          className="h-full bg-candidate-primary transition-all duration-300"
          style={{ width: '0%' }}
        ></div>
        <div 
          ref={loadingTextRef} 
          className="absolute top-0 left-0 w-full text-center text-xs text-white font-medium"
        >
          Loading: 0%
        </div>
      </div>
      <canvas 
        ref={canvasRef} 
        style={{ width, height }}
        className="bg-black"
      />
    </Card>
  );
});

UnityWebGLPlayer.displayName = 'UnityWebGLPlayer';

export default UnityWebGLPlayer;