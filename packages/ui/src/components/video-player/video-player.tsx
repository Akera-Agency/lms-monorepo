import { useEffect, useState, useCallback, useMemo } from 'react';
import videojs from 'video.js';

import 'video.js/dist/video-js.css';
import './video-player.css';

type VideoPlayerProps = {
  techOrder: string[];
  autoplay: boolean;
  controls: boolean;
  sources: {
    src: string;
    type: string;
  }[];
  lessonId?: string;
  onHalfReached?: () => void;
  onStartPlayer?: () => void;
  onExitPlayer?: (timestamp: number) => void;
};

const VideoPlayer = (props: VideoPlayerProps) => {
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const playerOptions = useMemo(
    () => ({
      ...props,
      fluid: true,
    }),
    [props],
  );

  const onVideo = useCallback((el: HTMLVideoElement) => {
    setVideoEl(el);
  }, []);

  useEffect(() => {
    if (!videoEl) return;

    const player = videojs(videoEl, playerOptions);

    // const handleVideoStart = () => props.onStartPlayer?.();
    const handleVideoEnd = () => {};
    let hasReachedHalf = false;

    const handleReachedHalf = () => {
      const currentTime = player.currentTime() || 0;
      const duration = player.duration() || 1;
      const percent = (currentTime / duration) * 100;

      if (percent >= 50 && !hasReachedHalf) {
        hasReachedHalf = true;
        props.onHalfReached?.();
      }
    };

    // player.on('loadstart', handleVideoStart);
    player.on('ended', handleVideoEnd);
    player.on('timeupdate', handleReachedHalf);

    return () => {
      // props.onExitPlayer?.(player.currentTime() || 0);
    };
  }, [videoEl, playerOptions, props]);

  return (
    <div data-vjs-player>
      <video
        ref={onVideo}
        className="video-js vjs-custom-skin w-full overflow-hidden rounded-lg"
        playsInline
      />
    </div>
  );
};

export default VideoPlayer;
