import React, { useState, useEffect } from 'react';
import { audioManager } from './AudioManager';
import './GlobalVolumeControl.scss';

import Button from 'src/components/Button/Button';

const GlobalVolumeControl: React.FC = () => {
  const [volume, setVolume] = useState<number>(
    audioManager.getGlobalVolume() as number
  );

  useEffect(() => {
    audioManager.setGlobalVolume(volume);
  }, [volume]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioManager.setGlobalVolume(newVolume);
  };

  const muteVolume = () => {
    setVolume(0);
    audioManager.setGlobalVolume(0);
  };

  return (
    <div className="global-volume-control">
      <Button
        className="tertiary"
        onClick={muteVolume}
        text="MUTE"
        color="B"
        width={160}
        height={30}
        backgroundColorOverride="#222222"
      />
      <div className="volume-bar">
        <label className="volume-level" htmlFor="global-volume">
          {Math.round(volume * 100)}%
        </label>
        <input
          id="global-volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          style={{
            cursor: `url('/assets/images/cursors/pointer.svg') 12 4, pointer`,
          }}
          className="volume-slider"
        />
      </div>
    </div>
  );
};

export default GlobalVolumeControl;
