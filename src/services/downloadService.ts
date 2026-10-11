import * as FileSystem from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';
import { Track } from '../store/musicStore';

const DOWNLOADS_DIR = `${FileSystem.documentDirectory}mz_music_downloads/`;
const DOWNLOADS_MANIFEST = 'mzMusicDownloadsManifest';

export interface DownloadedTrack extends Track {
  localPath: string;
  downloadedAt: Date;
}

export const downloadService = {
  /**
   * Asegurar que el directorio de descargas existe
   */
  async ensureDownloadsDirectory(): Promise<void> {
    try {
      const info = await FileSystem.getInfoAsync(DOWNLOADS_DIR);
      if (!info.exists) {
        await FileSystem.makeDirectoryAsync(DOWNLOADS_DIR, { intermediates: true });
      }
    } catch (error) {
      console.error('Error creando directorio de descargas:', error);
    }
  },

  /**
   * Descargar una canción
   * NOTA: Requiere URL de audio válida desde la API de música
   */
  async downloadTrack(track: Track, audioUrl: string): Promise<DownloadedTrack> {
    try {
      await this.ensureDownloadsDirectory();

      // Crear nombre de archivo único
      const filename = `${track.id}-${track.title.replace(/\s+/g, '-')}.mp3`;
      const localPath = `${DOWNLOADS_DIR}${filename}`;

      // Descargar archivo
      const downloadResult = await FileSystem.downloadAsync(audioUrl, localPath);

      if (downloadResult.status !== 200) {
        throw new Error(`Error en descarga: ${downloadResult.status}`);
      }

      // Guardar en manifest
      await this.addToManifest({
        ...track,
        localPath,
        downloadedAt: new Date(),
      });

      return {
        ...track,
        localPath,
        downloadedAt: new Date(),
      };
    } catch (error) {
      console.error('Error descargando track:', error);
      throw error;
    }
  },

  /**
   * Eliminar una canción descargada
   */
  async deleteDownloadedTrack(trackId: string): Promise<void> {
    try {
      const downloads = await this.getDownloads();
      const track = downloads.find((t) => t.id === trackId);

      if (track && track.localPath) {
        await FileSystem.deleteAsync(track.localPath);
        await this.removeFromManifest(trackId);
      }
    } catch (error) {
      console.error('Error eliminando track:', error);
      throw error;
    }
  },

  /**
   * Obtener todas las canciones descargadas
   */
  async getDownloads(): Promise<DownloadedTrack[]> {
    try {
      const manifest = await SecureStore.getItemAsync(DOWNLOADS_MANIFEST);
      if (manifest) {
        return JSON.parse(manifest);
      }
      return [];
    } catch (error) {
      console.error('Error obteniendo descargas:', error);
      return [];
    }
  },

  /**
   * Agregar track al manifest
   */
  private async addToManifest(track: DownloadedTrack): Promise<void> {
    try {
      const downloads = await this.getDownloads();
      const updated = [...downloads.filter((t) => t.id !== track.id), track];
      await SecureStore.setItemAsync(DOWNLOADS_MANIFEST, JSON.stringify(updated));
    } catch (error) {
      console.error('Error agregando al manifest:', error);
    }
  },

  /**
   * Remover track del manifest
   */
  private async removeFromManifest(trackId: string): Promise<void> {
    try {
      const downloads = await this.getDownloads();
      const updated = downloads.filter((t) => t.id !== trackId);
      await SecureStore.setItemAsync(DOWNLOADS_MANIFEST, JSON.stringify(updated));
    } catch (error) {
      console.error('Error removiendo del manifest:', error);
    }
  },
};
