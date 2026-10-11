import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Track, Playlist, UserProfile } from '../types/music';

interface MusicStore {
  tracks: Track[];
  setTracks: (tracks: Track[]) => void;
  currentTrack: Track | null;
  setCurrentTrack: (track: Track | null) => void;
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  currentTime: number;
  setCurrentTime: (value: number) => void;
  queue: Track[];
  setQueue: (queue: Track[]) => void;
  favorites: string[];
  toggleFavorite: (trackId: string) => void;
  downloaded: string[];
  toggleDownload: (trackId: string) => void;
  playlists: Playlist[];
  addPlaylist: (playlist: Playlist) => void;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (message: string | null) => void;
  loadState: () => Promise<void>;
  saveState: () => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set, get) => ({
  tracks: [],
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  queue: [],
  favorites: [],
  downloaded: [],
  playlists: [],
  user: null,
  isLoading: true,
  error: null,

  setTracks: (tracks) => set({ tracks }),
  setCurrentTrack: (currentTrack) => set({ currentTrack }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setQueue: (queue) => set({ queue }),
  toggleFavorite: (trackId) =>
    set((state) => ({
      favorites: state.favorites.includes(trackId)
        ? state.favorites.filter((id) => id !== trackId)
        : [...state.favorites, trackId],
    })),
  toggleDownload: (trackId) =>
    set((state) => ({
      downloaded: state.downloaded.includes(trackId)
        ? state.downloaded.filter((id) => id !== trackId)
        : [...state.downloaded, trackId],
    })),
  addPlaylist: (playlist) =>
    set((state) => ({ playlists: [...state.playlists, playlist] })),
  addTrackToPlaylist: (playlistId, track) =>
    set((state) => ({
      playlists: state.playlists.map((playlist) =>
        playlist.id === playlistId
          ? { ...playlist, tracks: [...playlist.tracks, track] }
          : playlist
      ),
    })),
  setUser: (user) => set({ user }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  loadState: async () => {
    try {
      const saved = await AsyncStorage.getItem('mz-music-store');
      if (!saved) return;
      const parsed = JSON.parse(saved);
      set({
        favorites: parsed.favorites ?? [],
        downloaded: parsed.downloaded ?? [],
        playlists: parsed.playlists ?? [],
        user: parsed.user ?? null,
      });
    } catch (error) {
      console.warn('No se pudo cargar el estado local', error);
    }
  },

  saveState: async () => {
    try {
      const state = get();
      await AsyncStorage.setItem(
        'mz-music-store',
        JSON.stringify({
          favorites: state.favorites,
          downloaded: state.downloaded,
          playlists: state.playlists,
          user: state.user,
        })
      );
    } catch (error) {
      console.warn('No se pudo guardar el estado local', error);
    }
  },
}));
