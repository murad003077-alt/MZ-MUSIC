export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  genre: string;
  cover: string;
  audioUrl: string;
  source: 'jamendo' | 'archive' | 'local';
  license: string;
  explicit?: boolean;
  lyrics?: string[];
  releaseDate?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  cover: string;
  tracks: Track[];
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  favorites: string[];
  downloaded: string[];
  playlists: Playlist[];
  recentlyPlayed: string[];
}
