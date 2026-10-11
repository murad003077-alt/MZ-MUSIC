export type MusicSource = 'jamendo' | 'archive' | 'local';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // segundos
  genre: string;
  cover: string; // URL
  audioUrl: string; // URL del archivo
  source: MusicSource;
  license: string;
  canDownload: boolean; // Validado según licencia
  explicit?: boolean;
  lyrics?: string[];
  releaseDate?: string;
  attribution?: string; // Atribución requerida
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  cover: string;
  tracks: Track[];
  createdAt: string;
  isLocal: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  queue: Track[];
  queueIndex: number;
}
