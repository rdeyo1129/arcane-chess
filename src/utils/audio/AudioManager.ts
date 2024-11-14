import { AudioPlayer } from './audioUtils';

class AudioManager {
  private sounds: { [key: string]: AudioPlayer } = {};
  private globalVolume: number;

  constructor() {
    const storedVolume = localStorage.getItem('globalVolume');
    this.globalVolume = storedVolume !== null ? parseFloat(storedVolume) : 0.2;
  }

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
