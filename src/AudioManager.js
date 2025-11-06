export class AudioManager {
  constructor() {
    this.music = null;
    this.musicEnabled = true;
    this.currentTrack = 'none';
    this.tracks = {
      music1: 'assets/sounds/music1.wav',
      music2: 'assets/sounds/music2.wav',
    };
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

    if (this.tracks[track]) {
      this.music = new Audio(this.tracks[track]);
      this.music.loop = true;
      this.music.volume = 0.3;
      this.music.play().catch((err) => {
        console.warn('Audio playback failed:', err);
      });
      this.currentTrack = track;
      console.log(`Playing music: ${track}`);
    }
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
