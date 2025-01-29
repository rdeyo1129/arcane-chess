import React, { useEffect } from 'react';
import { audioManager } from './AudioManager';

import audioLinks from 'src/utils/audio/audioLinks.json';

import impact from 'night-chess-noise/noise1/impact.mp3';

const ConditionalAudioPlayer: React.FC<{ location: any }> = ({ location }) => {
  useEffect(() => {
    // Register Sounds
    if (!audioManager.isSoundRegistered('move')) {
      audioManager.registerSound('move', audioLinks.moveSoundUrl);
    }
    if (!audioManager.isSoundRegistered('capture')) {
      audioManager.registerSound('capture', audioLinks.captureSoundUrl);
    }
    if (!audioManager.isSoundRegistered('victory')) {
      // audioManager.registerSound('victory', audioLinks.victorySoundUrl);
    }
    if (!audioManager.isSoundRegistered('defeat')) {
      // audioManager.registerSound('defeat', audioLinks.defeatSoundUrl);
    }
    if (!audioManager.isSoundRegistered('impact')) {
      audioManager.registerSound('impact', impact);
    }

    // Register Songs
    if (!audioManager.isSoundRegistered('nexus')) {
      // audioManager.registerSound('nexus', audioLinks.nexusSongUrl);
    }
    if (!audioManager.isSoundRegistered('electron')) {
      // audioManager.registerSound('electron', audioLinks.electronSongUrl);
    }
    if (!audioManager.isSoundRegistered('menu')) {
      // audioManager.registerSound('menu', audioLinks.menuSongUrl, true);
    }
  }, []);

  // Trigger song play/stop based on the current route
  useEffect(() => {
    const nexusRoutes = ['/lesson', '/temple', '/mission', '/quickplay'];
    const menuRoutes = [
      '/',
      '/dashboard',
      '/campaign',
      '/chapter',
      '/profile',
      '/leaderboard',
      '/lexicon',
      '/manifest',
    ];
    const shouldPlayNexus = nexusRoutes.includes(location.pathname);
    const shouldPlayMenu = menuRoutes.includes(location.pathname);

    if (shouldPlayNexus) {
      // audioManager.stopSound('menu');
      // audioManager.setPlaylist(['electron', 'nexus']);
    } else if (shouldPlayMenu) {
      // audioManager.stopSound('nexus');
      // audioManager.stopSound('electron');
      // audioManager.playSound('menu');
    } else {
      // audioManager.stopSound('electron');
      // audioManager.stopSound('menu');
    }
  }, [location.pathname]);

  return null;
};

export default ConditionalAudioPlayer;
