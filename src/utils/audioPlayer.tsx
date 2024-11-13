import React, { useEffect, useRef } from 'react';

interface AudioPlayerProps {
  src: string;
  volume?: number;
  loop?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  volume = 1.0,
  loop = false,
}) => {
  const audioRef = useRef(new Audio(src));

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = loop;
    audio.volume = volume;

    console.log(src);

    audio.play();

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [src, volume, loop]);

  return null;
};

export default AudioPlayer;
