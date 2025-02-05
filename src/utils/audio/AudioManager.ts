import { AudioPlayer } from './audioUtils';

class AudioManager {
  private sounds: { [key: string]: AudioPlayer } = {};
  private playlist: string[] = [];
  private currentSongIndex: number = 0;
  private globalVolume: number;

  constructor() {
    this.globalVolume = 0.25;
  }

  setPlaylist(songs: string[]): void {
    this.playlist = songs;
    this.currentSongIndex = Math.floor(Math.random() * this.playlist.length);
    if (this.playlist.length > 0) this.playCurrentSong();
  }

  private playCurrentSong(): void {
    const currentSongKey = this.playlist[this.currentSongIndex];
    const sound = this.sounds[currentSongKey];
    if (sound) {
      sound.play();
      sound.on('ended', this.handleSongEnd);
    }
  }

  private handleSongEnd = (): void => {
    const currentSongKey = this.playlist[this.currentSongIndex];
    const sound = this.sounds[currentSongKey];
    if (sound) sound.off('ended', this.handleSongEnd);

    this.currentSongIndex = (this.currentSongIndex + 1) % this.playlist.length;
    this.playCurrentSong();
  };

  registerSound(key: string, src: string, loop: boolean = false): void {
    const sound = new AudioPlayer(src, this.globalVolume, loop);
    sound.load();
    this.sounds[key] = sound;
  }

  isSoundRegistered(key: string): boolean {
    return !!this.sounds[key];
  }

  playSound(key: string): void {
    const sound = this.sounds[key];
    if (sound) sound.play();
  }

  pauseSound(key: string): void {
    const sound = this.sounds[key];
    if (sound) sound.pause();
  }

  stopSound(key: string): void {
    const sound = this.sounds[key];
    if (sound) sound.stop();
  }

  setGlobalVolume(volume: number): void {
    this.globalVolume = volume;
    localStorage.setItem('globalVolume', volume.toString());
    Object.values(this.sounds).forEach((sound) => sound.setVolume(volume));
  }

  getGlobalVolume() {
    return localStorage.getItem('globalVolume') ?? (0 as number);
  }

  isSoundPlaying(key: string): boolean {
    const sound = this.sounds[key];
    return sound ? sound.isPlaying() : false;
  }

  on(key: string, event: string, callback: () => void): void {
    const sound = this.sounds[key];
    if (sound) sound.on(event, callback);
  }

  off(key: string, event: string, callback: () => void): void {
    const sound = this.sounds[key];
    if (sound) sound.off(event, callback);
  }
}

export const audioManager = new AudioManager();
