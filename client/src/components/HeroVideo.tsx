import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroVideoProps {
  videoUrl: string;
  posterUrl?: string;
  fallbackImageUrl: string;
  altText?: string;
  className?: string;
  showControls?: boolean;
}

export function HeroVideo({ 
  videoUrl, 
  posterUrl, 
  fallbackImageUrl, 
  altText = 'Hero video',
  className = '',
  showControls = false
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsLoaded(true);
      video.play().catch(() => {
        // Autoplay was prevented, that's okay
        setIsPlaying(false);
      });
    };

    const handleError = () => {
      setHasError(true);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [videoUrl]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // If video fails to load, show fallback image
  if (hasError) {
    return (
      <img 
        src={fallbackImageUrl}
        alt={altText}
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Fallback image shown while video loads */}
      {!isLoaded && (
        <img 
          src={posterUrl || fallbackImageUrl}
          alt={altText}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      
      <video
        ref={videoRef}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        autoPlay
        muted
        loop
        playsInline
        poster={posterUrl || fallbackImageUrl}
      >
        <source src={videoUrl} type="video/mp4" />
        <source src={videoUrl.replace('.mp4', '.webm')} type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Video Controls */}
      {showControls && isLoaded && (
        <div className="absolute bottom-4 right-4 flex gap-2 z-20">
          <Button
            variant="secondary"
            size="icon"
            className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white border-0"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white border-0"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>
      )}
    </div>
  );
}
