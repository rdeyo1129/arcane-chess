import { AudioPlayer } from './audioUtils';

class AudioManager {
  private sounds: { [key: string]: AudioPlayer } = {};
  private playlist: string[] = [];
  private currentSongIndex: number = 0;
  private globalVolume: number;

  constructor() {
    const storedVolume = localStorage.getItem('globalVolume');
    this.globalVolume = storedVolume !== null ? parseFloat(storedVolume) : 0.2;
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

  getGlobalVolume(): number {
    return this.globalVolume;
  }

  isSoundPlaying(key: string): boolean {
    const sound = this.sounds[key];
    return sound ? sound.isPlaying() : false;
  }

  /**
   * Adds an event listener to a sound.
   * @param key - The key of the sound to add the listener to.
   * @param event - The event to listen for (e.g., "ended").
   * @param callback - The callback to invoke when the event occurs.
   */
  on(key: string, event: string, callback: () => void): void {
    const sound = this.sounds[key];
    if (sound) sound.on(event, callback);
  }

  /**
   * Removes an event listener from a sound.
   * @param key - The key of the sound to remove the listener from.
   * @param event - The event to stop listening for.
   * @param callback - The callback to remove.
   */
  off(key: string, event: string, callback: () => void): void {
    const sound = this.sounds[key];
    if (sound) sound.off(event, callback);
  }
}

export const audioManager = new AudioManager();
