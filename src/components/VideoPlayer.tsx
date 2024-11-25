import { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
} from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
}

export function VideoPlayer({ url, isOpen, onClose }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setMuted(value[0] === 0);
  };

  const handleToggleMute = () => {
    setMuted(!muted);
  };

  const handleProgress = (state: { played: number }) => {
    if (!seeking) {
      setPlayed(state.played);
    }
  };

  const handleSeekChange = (value: number[]) => {
    setPlayed(value[0]);
    setSeeking(true);
  };

  const handleSeekMouseUp = () => {
    setSeeking(false);
    if (playerRef.current) {
      playerRef.current.seekTo(played);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>動画プレーヤー</DialogTitle>
        </DialogHeader>
        <div ref={containerRef} className="relative group">
          <ReactPlayer
            ref={playerRef}
            url={url}
            width="100%"
            height="auto"
            playing={playing}
            volume={volume}
            muted={muted}
            onProgress={handleProgress}
            style={{ aspectRatio: '16/9' }}
          />

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
            {/* Progress bar */}
            <Slider
              value={[played]}
              max={1}
              step={0.001}
              onValueChange={handleSeekChange}
              onValueCommit={handleSeekMouseUp}
              className="mb-6"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                {/* Play/Pause button */}
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handlePlayPause}
                  className="text-white hover:text-white/80 hover:bg-white/20 h-12 w-12 p-0"
                >
                  {playing ? (
                    <Pause className="h-7 w-7" />
                  ) : (
                    <Play className="h-7 w-7" />
                  )}
                </Button>

                {/* Volume controls */}
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={handleToggleMute}
                    className="text-white hover:text-white/80 hover:bg-white/20 h-12 w-12 p-0"
                  >
                    {muted || volume === 0 ? (
                      <VolumeX className="h-7 w-7" />
                    ) : (
                      <Volume2 className="h-7 w-7" />
                    )}
                  </Button>
                  <Slider
                    value={[muted ? 0 : volume]}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="w-32"
                  />
                </div>
              </div>

              {/* Fullscreen button */}
              <Button
                variant="ghost"
                size="lg"
                onClick={toggleFullscreen}
                className="text-white hover:text-white/80 hover:bg-white/20 h-12 w-12 p-0"
              >
                {isFullscreen ? (
                  <Minimize className="h-7 w-7" />
                ) : (
                  <Maximize className="h-7 w-7" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}