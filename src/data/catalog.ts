import * as FileSystem from 'expo-file-system';
import { Track } from '../types/music';

const DOWNLOAD_DIR = `${FileSystem.documentDirectory}mz_music_downloads/`;

export async function ensureDownloadDir() {
  const info = await FileSystem.getInfoAsync(DOWNLOAD_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(DOWNLOAD_DIR, { intermediates: true });
  }
}

export function canDownload(track: Track): boolean {
  const allowedLicenses = ['Creative Commons', 'Dominio Público', 'CC0', 'CC BY', 'CC BY-SA'];
  return allowedLicenses.some((license) => track.license.includes(license));
}

export async function downloadTrack(track: Track): Promise<string | null> {
  if (!canDownload(track) || !track.audioUrl) return null;

  await ensureDownloadDir();
  const filename = `${track.id}.mp3`;
  const localPath = `${DOWNLOAD_DIR}${filename}`;

  try {
    const result = await FileSystem.downloadAsync(track.audioUrl, localPath);
    if (result.status !== 200) {
      throw new Error(`Download failed with status ${result.status}`);
    }
    return localPath;
  } catch (error) {
    console.error('Download error:', error);
    return null;
  }
}

export async function getDownloadedTrackPath(trackId: string): Promise<string | null> {
  const filePath = `${DOWNLOAD_DIR}${trackId}.mp3`;
  const info = await FileSystem.getInfoAsync(filePath);
  return info.exists ? filePath : null;
}
