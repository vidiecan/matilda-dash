export class AudioManager {
  constructor() {
    this.music = null;
    this.musicEnabled = true;
    this.currentTrack = 'none';
  }

  playMusic(track) {
    if (this.music) {
      this.music.pause();
      this.music.currentTime = 0;
    }

    if (track === 'none' || !this.musicEnabled) {
      this.currentTrack = 'none';
      return;
    }

    // For now, we don't have actual music files
    // This is a placeholder for future implementation
    this.currentTrack = track;
    console.log(`Would play music: ${track}`);
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (!this.musicEnabled && this.music) {
      this.music.pause();
    } else if (this.musicEnabled && this.currentTrack !== 'none') {
      this.playMusic(this.currentTrack);
    }
    return this.musicEnabled;
  }

  setVolume(volume) {
    if (this.music) {
      this.music.volume = Math.max(0, Math.min(1, volume));
    }
  }
}
