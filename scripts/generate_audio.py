#!/usr/bin/env python3
"""
Generate simple audio files for the game
Creates basic tone sequences as placeholder music
"""
from pathlib import Path
import struct
import math

OUTPUT_DIR = Path(__file__).parent.parent / "assets" / "sounds"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def create_wav_file(filename, frequency=440, duration=2.0, sample_rate=44100):
    """Create a simple WAV file with a sine wave"""
    num_samples = int(sample_rate * duration)
    
    # WAV file header
    with open(OUTPUT_DIR / filename, 'wb') as f:
        # RIFF header
        f.write(b'RIFF')
        f.write(struct.pack('<I', 36 + num_samples * 2))
        f.write(b'WAVE')
        
        # Format chunk
        f.write(b'fmt ')
        f.write(struct.pack('<I', 16))  # Chunk size
        f.write(struct.pack('<H', 1))   # PCM format
        f.write(struct.pack('<H', 1))   # Mono
        f.write(struct.pack('<I', sample_rate))
        f.write(struct.pack('<I', sample_rate * 2))
        f.write(struct.pack('<H', 2))   # Block align
        f.write(struct.pack('<H', 16))  # Bits per sample
        
        # Data chunk
        f.write(b'data')
        f.write(struct.pack('<I', num_samples * 2))
        
        # Audio data - simple sine wave with fade out
        for i in range(num_samples):
            # Fade out in last 20%
            fade = 1.0 if i < num_samples * 0.8 else (num_samples - i) / (num_samples * 0.2)
            sample = int(32767 * 0.3 * fade * math.sin(2 * math.pi * frequency * i / sample_rate))
            f.write(struct.pack('<h', sample))

def create_music_tracks():
    """Create placeholder music tracks"""
    # Track 1 - C major melody
    print("Creating music track 1...")
    create_wav_file("music1.wav", frequency=523, duration=1.5)  # C note
    
    # Track 2 - G major melody
    print("Creating music track 2...")
    create_wav_file("music2.wav", frequency=392, duration=1.5)  # G note
    
    print("✓ Created music tracks")

if __name__ == "__main__":
    print("Generating audio assets...")
    create_music_tracks()
    print("\nAll audio assets generated successfully!")
