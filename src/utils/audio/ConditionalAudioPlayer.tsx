import React, { useEffect } from 'react';
import { audioManager } from './AudioManager';

const ConditionalAudioPlayer: React.FC<{ location: any }> = ({ location }) => {
  useEffect(() => {}, []);

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
      audioManager.stopSound('menu');
      audioManager.setPlaylist(['electron', 'nexus']);
    } else if (shouldPlayMenu) {
      audioManager.stopSound('nexus');
      audioManager.stopSound('electron');
      audioManager.playSound('menu');
    } else {
      audioManager.stopSound('electron');
      audioManager.stopSound('menu');
    }
  }, [location.pathname]);

  return null;
};

export default ConditionalAudioPlayer;
