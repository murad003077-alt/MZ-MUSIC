import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  genre: string;
  cover: string;
  availableOffline: boolean;
  status: string;
  source: string;
  lyrics: string[];
  audioUrl?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  cover: string;
  tracks: Track[];
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  favorites: string[];
  playlists: Playlist[];
  downloadedTracks: string[];
  recentlyPlayed: Track[];
}

interface MusicStore {
  // Tracks
  tracks: Track[];
  setTracks: (tracks: Track[]) => void;
  currentTrack: Track | null;
  setCurrentTrack: (track: Track | null) => void;

  // Playback
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  queue: Track[];
  setQueue: (queue: Track[]) => void;
  queueIndex: number;
  setQueueIndex: (index: number) => void;

  // User
  user: User | null;
  setUser: (user: User | null) => void;
  favorites: Set<string>;
  toggleFavorite: (trackId: string) => void;
  downloadedTracks: Set<string>;
  toggleDownload: (trackId: string) => void;

  // Playlists
  playlists: Playlist[];
  setPlaylists: (playlists: Playlist[]) => void;
  createPlaylist: (name: string, description: string) => void;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;

  // Loading & Error
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;

  // Persistence
  saveState: () => Promise<void>;
  loadState: () => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set, get) => ({
  tracks: [],
  setTracks: (tracks) => set({ tracks }),
  currentTrack: null,
  setCurrentTrack: (currentTrack) => set({ currentTrack }),

  isPlaying: false,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  currentTime: 0,
  setCurrentTime: (currentTime) => set({ currentTime }),
  queue: [],
  setQueue: (queue) => set({ queue }),
  queueIndex: 0,
  setQueueIndex: (queueIndex) => set({ queueIndex }),

  user: null,
  setUser: (user) => set({ user }),
  favorites: new Set<string>(),
  toggleFavorite: (trackId) =>
    set((state) => {
      const favorites = new Set(state.favorites);
      if (favorites.has(trackId)) {
        favorites.delete(trackId);
      } else {
        favorites.add(trackId);
      }
      return { favorites };
    }),
  downloadedTracks: new Set<string>(),
  toggleDownload: (trackId) =>
    set((state) => {
      const downloadedTracks = new Set(state.downloadedTracks);
      if (downloadedTracks.has(trackId)) {
        downloadedTracks.delete(trackId);
      } else {
        downloadedTracks.add(trackId);
      }
      return { downloadedTracks };
    }),

  playlists: [],
  setPlaylists: (playlists) => set({ playlists }),
  createPlaylist: (name, description) =>
    set((state) => {
      const newPlaylist: Playlist = {
        id: `playlist-${Date.now()}`,
        name,
        description,
        cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=750&q=80',
        tracks: [],
        createdAt: new Date(),
      };
      return { playlists: [...state.playlists, newPlaylist] };
    }),
  addTrackToPlaylist: (playlistId, track) =>
    set((state) => {
      const playlists = state.playlists.map((p) =>
        p.id === playlistId ? { ...p, tracks: [...p.tracks, track] } : p,
      );
      return { playlists };
    }),
  removeTrackFromPlaylist: (playlistId, trackId) =>
    set((state) => {
      const playlists = state.playlists.map((p) =>
        p.id === playlistId ? { ...p, tracks: p.tracks.filter((t) => t.id !== trackId) } : p,
      );
      return { playlists };
    }),

  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
  error: null,
  setError: (error) => set({ error }),

  saveState: async () => {
    try {
      const state = get();
      await SecureStore.setItemAsync(
        'mzMusicState',
        JSON.stringify({
          favorites: Array.from(state.favorites),
          downloadedTracks: Array.from(state.downloadedTracks),
          playlists: state.playlists,
        }),
      );
    } catch (error) {
      console.error('Error saving state:', error);
    }
  },

  loadState: async () => {
    try {
      const saved = await SecureStore.getItemAsync('mzMusicState');
      if (saved) {
        const parsed = JSON.parse(saved);
        set({
          favorites: new Set(parsed.favorites || []),
          downloadedTracks: new Set(parsed.downloadedTracks || []),
          playlists: parsed.playlists || [],
        });
      }
    } catch (error) {
      console.error('Error loading state:', error);
    }
  },
}));
