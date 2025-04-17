import React, { useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';

const UnityEmbed = forwardRef(({ src, width = '1920px', height = '1080px', onGameMessage }, ref) => {
  const iframeRef = useRef(null);

  // Optional: for messaging between iframe & React
  useEffect(() => {
    const handleMessage = (event) => {
      if (typeof onGameMessage === 'function') {
        onGameMessage(event.data);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onGameMessage]);

  useImperativeHandle(ref, () => ({
    sendMessageToUnity: (message) => {
      if (iframeRef.current) {
        iframeRef.current.contentWindow.postMessage(message, '*');
      }
    },
  }));

  return (
    <Card
      className="relative overflow-hidden rounded-lg border shadow-lg"
      style={{
        width: '1000px',
        height: '700px',
        maxWidth: width,
        maxHeight: '100%',
      }}
    >
      <iframe
        ref={iframeRef}
        src={src}
        title="Unity WebGL Game"
        width="100%"
        height="100%"
        allowFullScreen
        className="bg-black"
        style={{
          border: 'none',
        }}
      />
    </Card>
  );
});

UnityEmbed.displayName = 'UnityEmbed';

export default UnityEmbed;
