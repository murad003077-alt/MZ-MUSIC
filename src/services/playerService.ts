import { Audio } from 'expo-av';
import { Track } from '../types/music';

let soundObject: Audio.Sound | null = null;

export async function loadAndPlayTrack(track: Track, onProgress?: (progress: number) => void) {
  try {
    if (!track.audioUrl) {
      throw new Error('No audio URL available for this track');
    }

    // Detener sonido anterior
    if (soundObject) {
      await soundObject.unloadAsync();
    }

    // Crear nuevo sonido
    const { sound } = await Audio.Sound.createAsync(
      { uri: track.audioUrl },
      { shouldPlay: true }
    );

    soundObject = sound;

    // Configurar listener de progreso
    if (onProgress) {
      sound.setProgressUpdateIntervalAsync(500);
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && !status.didJustFinish) {
          onProgress(status.positionMillis / 1000);
        }
      });
    }

    console.log(`🎵 Reproduciendo: ${track.title}`);
    return sound;
  } catch (error) {
    console.error('❌ Error al reproducir:', error);
    throw error;
  }
}

export async function pausePlayback() {
  if (soundObject) {
    await soundObject.pauseAsync();
  }
}

export async function resumePlayback() {
  if (soundObject) {
    await soundObject.playAsync();
  }
}

export async function stopPlayback() {
  if (soundObject) {
    await soundObject.unloadAsync();
    soundObject = null;
  }
}

export async function seekTo(positionMillis: number) {
  if (soundObject) {
    await soundObject.setPositionAsync(positionMillis);
  }
}

export async function getCurrentStatus() {
  if (soundObject) {
    return await soundObject.getStatusAsync();
  }
  return null;
}
