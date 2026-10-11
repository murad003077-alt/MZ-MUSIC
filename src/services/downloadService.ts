import * as FileSystem from 'expo-file-system';
import { Track } from '../types/music';
import { canDownloadTrack } from './catalogService';

const DOWNLOAD_DIR = `${FileSystem.documentDirectory}mz_music_downloads/`;

export async function ensureDownloadDir() {
  try {
    const info = await FileSystem.getInfoAsync(DOWNLOAD_DIR);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(DOWNLOAD_DIR, { intermediates: true });
      console.log('✅ Directorio de descargas creado');
    }
  } catch (error) {
    console.error('❌ Error creando directorio:', error);
  }
}

export async function downloadTrack(track: Track): Promise<boolean> {
  if (!canDownloadTrack(track)) {
    console.warn(`⚠️ Track ${track.title} no tiene licencia para descargar`);
    return false;
  }

  if (!track.audioUrl) {
    console.warn(`⚠️ Track ${track.title} no tiene URL de audio`);
    return false;
  }

  try {
    await ensureDownloadDir();
    const filename = `${track.id.replace(/[^a-z0-9]/gi, '_')}.mp3`;
    const filePath = `${DOWNLOAD_DIR}${filename}`;

    console.log(`📥 Descargando: ${track.title}`);
    const downloadResumable = FileSystem.createDownloadResumable(
      track.audioUrl,
      filePath,
      {}
    );

    const result = await downloadResumable.downloadAsync();
    if (result && result.status === 200) {
      console.log(`✅ Descargado: ${track.title}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error descargando ${track.title}:`, error);
    return false;
  }
}

export async function getDownloadedTrackPath(trackId: string): Promise<string | null> {
  try {
    const filename = `${trackId.replace(/[^a-z0-9]/gi, '_')}.mp3`;
    const filePath = `${DOWNLOAD_DIR}${filename}`;
    const info = await FileSystem.getInfoAsync(filePath);
    return info.exists ? filePath : null;
  } catch (error) {
    console.error('❌ Error obteniendo ruta:', error);
    return null;
  }
}

export async function deleteDownloadedTrack(trackId: string): Promise<boolean> {
  try {
    const filename = `${trackId.replace(/[^a-z0-9]/gi, '_')}.mp3`;
    const filePath = `${DOWNLOAD_DIR}${filename}`;
    await FileSystem.deleteAsync(filePath);
    console.log(`✅ Eliminado: ${trackId}`);
    return true;
  } catch (error) {
    console.error('❌ Error eliminando:', error);
    return false;
  }
}
