import React, { useState, useEffect } from 'react';
import { audioManager } from './AudioManager';

const GlobalVolumeControl: React.FC = () => {
  const [volume, setVolume] = useState<number>(audioManager.getGlobalVolume());

  useEffect(() => {
    audioManager.setGlobalVolume(volume);
  }, [volume]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  return (
    <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000 }}>
      <label htmlFor="global-volume">Volume: {Math.round(volume * 100)}%</label>
      <input
        id="global-volume"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        style={{ marginLeft: 8 }}
      />
    </div>
  );
};

export default GlobalVolumeControl;
