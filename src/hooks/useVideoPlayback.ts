
import { useRef, useEffect } from 'react';

export const useVideoPlayback = (currentVideoIndex: number, videos: any[]) => {
  const iframeRefs = useRef<(HTMLIFrameElement | null)[]>([]);

  // Helper function to pause all videos except the current one
  const updateVideoPlayback = (currentIndex: number) => {
    iframeRefs.current.forEach((iframe, index) => {
      if (iframe) {
        if (index === currentIndex) {
          // Play current video
          iframe.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        } else {
          // Pause other videos
          iframe.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        }
      }
    });
  };

  // Update playback when videos load
  useEffect(() => {
    if (videos.length > 0) {
      setTimeout(() => updateVideoPlayback(currentVideoIndex), 1000);
    }
  }, [videos, currentVideoIndex]);

  return { iframeRefs, updateVideoPlayback };
};
