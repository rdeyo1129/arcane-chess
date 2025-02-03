import React, { useEffect } from 'react';
import { audioManager } from './AudioManager';

import explosion from '/assets/noise/sounds/explosion.wav';
import click1 from '/assets/noise/sounds/click1.mp3';
import click3 from '/assets/noise/sounds/click3.mp3';

import tactoriusmenu from '/assets/noise/music/tactoriusmenu.wav';

import caller from '/assets/noise/music/caller.mp3';

import darkcity from '/assets/noise/music/darkcity.wav';
import Dream2Ambience from '/assets/noise/music/Dream2Ambience.mp3';
import monoliths from '/assets/noise/music/monoliths.mp3';
import booyab from '/assets/noise/music/booyab.mp3';
import v312 from '/assets/noise/music/v312.wav';
import darkamb from '/assets/noise/music/Dark-Amb.mp3';

const ConditionalAudioPlayer: React.FC<{ location: any }> = ({ location }) => {
  useEffect(() => {
    // Register Sounds
    if (!audioManager.isSoundRegistered('move')) {
      audioManager.registerSound('move', click1);
    }
    if (!audioManager.isSoundRegistered('capture')) {
      audioManager.registerSound('capture', click3);
    }
    if (!audioManager.isSoundRegistered('victory')) {
      // audioManager.registerSound('victory', audioLinks.victorySoundUrl);
    }
    if (!audioManager.isSoundRegistered('defeat')) {
      // audioManager.registerSound('defeat', audioLinks.defeatSoundUrl);
    }
    if (!audioManager.isSoundRegistered('impact')) {
      audioManager.registerSound('impact', explosion);
    }

    // Register Songs
    if (!audioManager.isSoundRegistered('lessons')) {
      audioManager.registerSound('lesson1', caller, true);
    }

    if (!audioManager.isSoundRegistered('game1')) {
      audioManager.registerSound('game1', darkcity);
    }
    if (!audioManager.isSoundRegistered('game2')) {
      audioManager.registerSound('game2', Dream2Ambience);
    }
    if (!audioManager.isSoundRegistered('game3')) {
      audioManager.registerSound('game3', monoliths);
    }
    if (!audioManager.isSoundRegistered('game4')) {
      audioManager.registerSound('game4', booyab);
    }
    if (!audioManager.isSoundRegistered('game5')) {
      audioManager.registerSound('game5', v312);
    }
    if (!audioManager.isSoundRegistered('game6')) {
      audioManager.registerSound('game6', darkamb);
    }

    if (!audioManager.isSoundRegistered('menu')) {
      audioManager.registerSound('menu', tactoriusmenu, true);
    }
  }, []);

  // Trigger song play/stop based on the current route
  useEffect(() => {
    const lessonRoutes = ['/lexicon', '/lesson'];
    const gameRoutes = ['/temple', '/mission', '/quickplay'];
    const menuRoutes = [
      '/',
      '/campaign',
      '/chapter',
      '/profile',
      '/leaderboard',
      '/manifest',
    ];

    const shouldPlayLesson = lessonRoutes.includes(location.pathname);
    const shouldPlayGame = gameRoutes.includes(location.pathname);
    const shouldPlayMenu = menuRoutes.includes(location.pathname);

    if (shouldPlayLesson) {
      audioManager.stopSound('menu');
      audioManager.stopSound('game1');
      audioManager.stopSound('game2');
      audioManager.stopSound('game3');
      audioManager.stopSound('game4');
      audioManager.stopSound('game5');
      audioManager.stopSound('game6');
      audioManager.playSound('lesson1');
    } else if (shouldPlayGame) {
      audioManager.stopSound('menu');
      audioManager.stopSound('lesson1');
      audioManager.setPlaylist(['game1', 'game2', 'game3', 'game4', 'game5']);
    } else if (shouldPlayMenu) {
      audioManager.stopSound('lesson1');
      audioManager.stopSound('game1');
      audioManager.stopSound('game2');
      audioManager.stopSound('game3');
      audioManager.stopSound('game4');
      audioManager.stopSound('game5');
      audioManager.stopSound('game6');
      audioManager.playSound('menu');
    } else {
      audioManager.stopSound('menu');
      audioManager.stopSound('lesson1');
      audioManager.stopSound('game1');
      audioManager.stopSound('game2');
      audioManager.stopSound('game3');
      audioManager.stopSound('game4');
      audioManager.stopSound('game5');
      audioManager.stopSound('game6');
    }
  }, [location.pathname]);

  return null;
};

export default ConditionalAudioPlayer;
