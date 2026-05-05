'use client';

import { Pause, Play, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  audioSrc: string;
  title: string;
}

export default function AudioPlayer({ audioSrc, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.75);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => setDuration(audio.duration);
    const setAudioTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Handle play/pause
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Handle time change
  const handleTimeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = value[0];
    setVolume(value[0]);
  };

  // Skip forward/backward
  const skipTime = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio || isNaN(audio.duration)) return;

    let newTime = audio.currentTime + seconds;

    // Clamp value between 0 and duration
    newTime = Math.max(0, Math.min(newTime, audio.duration));

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Format time
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
      />

      <div className="mb-4 flex items-center justify-between">
        <div className="text-lg font-medium line-clamp-1 w-[50%]">{title}</div>
        <div className="text-sm text-muted-foreground">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      <div className="mb-6">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleTimeChange}
          className="cursor-pointer"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => skipTime(-10)}
          >
            <SkipBack className="h-4 w-4" />
            <span className="sr-only">Skip back 10 seconds</span>
          </Button>

          <Button
            variant="default"
            size="icon"
            className={cn(
              'h-12 w-12 rounded-full',
              isPlaying
                ? 'bg-primary text-primary-foreground'
                : 'bg-primary text-primary-foreground',
            )}
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 pl-1" />}
            <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => skipTime(10)}
          >
            <SkipForward className="h-4 w-4" />
            <span className="sr-only">Skip forward 10 seconds</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={[volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
}
