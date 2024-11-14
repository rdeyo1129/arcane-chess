import React, { useEffect } from 'react';
import { audioManager } from './AudioManager';

const ConditionalAudioPlayer: React.FC<{ location: any }> = ({ location }) => {
  useEffect(() => {
    // Register sounds
    if (!audioManager.isSoundRegistered('move')) {
      audioManager.registerSound(
        'move',
        'https://www.dropbox.com/scl/fi/9kb7z491z8ptjyhtwi152/move.wav?rlkey=5bbnv6n1qz6rts379zgxod3a3&st=3oo4jgsw&raw=1'
      );
    }
    if (!audioManager.isSoundRegistered('capture')) {
      audioManager.registerSound(
        'capture',
        'https://www.dropbox.com/scl/fi/3gi72isg3f8q1vppvoxyy/capture.wav?rlkey=lvnlkekf12wyoqtr0401mg3y0&st=445o11lg&raw=1'
      );
    }
    if (!audioManager.isSoundRegistered('victory')) {
      audioManager.registerSound(
        'victory',
        'https://www.dropbox.com/scl/fi/vgstgwhl8vmcez7uliw0r/victory.wav?rlkey=j4wb2t3fcofhr50j4ij9xjp95&st=u2iw5ado&raw=1'
      );
    }
    if (!audioManager.isSoundRegistered('defeat')) {
      audioManager.registerSound(
        'defeat',
        'https://www.dropbox.com/scl/fi/0pedwzym3czyict09rmxl/defeat.wav?rlkey=u9cxsw3m5bg5uv3vzygt9hkqj&st=leh0el99&raw=1'
      );
    }
    if (!audioManager.isSoundRegistered('impact')) {
      audioManager.registerSound(
        'impact',
        'https://www.dropbox.com/scl/fi/xlpl9ggaox9b9w7oye6aa/impact.mp3?rlkey=mbzbemp8bnixvnn5p2eduribh&st=4pjud5mw&raw=1'
      );
    }

    // Register music tracks
    if (!audioManager.isSoundRegistered('nexus')) {
      audioManager.registerSound(
        'nexus',
        'https://www.dropbox.com/scl/fi/1fwt64gy2tw1dy8ptdqgv/nexus-edit-2.mp3?rlkey=vlm9qagrhulxkatkhmx0tg6e6&st=lq3cqolp&raw=1'
      );
    }
    if (!audioManager.isSoundRegistered('electron')) {
      audioManager.registerSound(
        'electron',
        'https://www.dropbox.com/scl/fi/oeuuocar7rc8z80ejkuy9/electron-song.wav?rlkey=8exe91na26ysplqcu345mdj6o&st=gzvzk3ty&raw=1'
      );
    }
    if (!audioManager.isSoundRegistered('menu')) {
      audioManager.registerSound(
        'menu',
        'https://www.dropbox.com/scl/fi/g947vbvbkesgbzfzicoqf/menu.wav?rlkey=j8k4yq5m9znex5mlhfxv015hh&st=2n3a7hya&raw=1',
        true
      );
    }
  }, []);

  // Trigger song play/stop based on the current route
  useEffect(() => {
    const nexusRoutes = [
      '/chapter',
      '/lesson',
      '/temple',
      '/mission',
      '/quickplay',
    ];
    const menuRoutes = [
      '/',
      '/dashboard',
      '/campaign',
      '/profile',
      '/leaderboard',
      '/lexicon',
      '/manifest',
    ];
    const shouldPlayNexus = nexusRoutes.includes(location.pathname);
    const shouldPlayMenu = menuRoutes.includes(location.pathname);

    if (shouldPlayNexus) {
      audioManager.stopSound('menu');
      audioManager.playSound('nexus');
    } else if (shouldPlayMenu) {
      audioManager.stopSound('nexus');
      audioManager.playSound('menu');
    } else {
      audioManager.stopSound('electron');
      audioManager.stopSound('menu');
    }
  }, [location.pathname]);

  return null;
};

export default ConditionalAudioPlayer;
