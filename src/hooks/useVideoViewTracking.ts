
import { useEffect, useRef } from 'react';

export const useVideoViewTracking = (
  videoId: string,
  isCurrentVideo: boolean,
  onViewCountIncrement: (videoId: string) => void
) => {
  const viewStartTimeRef = useRef<number | null>(null);
  const hasIncrementedRef = useRef<boolean>(false);

  useEffect(() => {
    if (isCurrentVideo) {
      // Start tracking view time
      viewStartTimeRef.current = Date.now();
      hasIncrementedRef.current = false;
      
      const interval = setInterval(() => {
        if (viewStartTimeRef.current && !hasIncrementedRef.current) {
          const viewDuration = Date.now() - viewStartTimeRef.current;
          
          // If user has watched for 10 seconds, increment view count
          if (viewDuration >= 10000) {
            console.log(`User watched video ${videoId} for 10+ seconds, incrementing view count`);
            onViewCountIncrement(videoId);
            hasIncrementedRef.current = true;
            clearInterval(interval);
          }
        }
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    } else {
      // Reset when video is no longer current
      viewStartTimeRef.current = null;
      hasIncrementedRef.current = false;
    }
  }, [isCurrentVideo, videoId, onViewCountIncrement]);
};
