import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Track, Playlist, PlayerState, UserProfile } from '../types/music';

interface MusicStore {
  // Player
  player: PlayerState;
  setCurrentTrack: (track: Track | null) => void;
  setIsPlaying: (value: boolean) => void;
  setCurrentTime: (value: number) => void;
  setDuration: (value: number) => void;
  setQueue: (queue: Track[]) => void;
  nextTrack: () => void;
  previousTrack: () => void;

  // Tracks
  tracks: Track[];
  setTracks: (tracks: Track[]) => void;

  // User data
  favorites: string[];
  toggleFavorite: (trackId: string) => void;
  isFavorite: (trackId: string) => boolean;

  downloaded: string[];
  toggleDownload: (trackId: string) => void;
  isDownloaded: (trackId: string) => boolean;

  // Playlists
  playlists: Playlist[];
  createPlaylist: (name: string, description: string) => void;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  deletePlaylist: (playlistId: string) => void;

  // Recent
  recentlyPlayed: string[];
  addToRecent: (trackId: string) => void;

  // User
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;

  // UI
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (message: string | null) => void;

  // Persistence
  loadState: () => Promise<void>;
  saveState: () => Promise<void>;
}

const initialPlayerState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  queue: [],
  queueIndex: 0,
};

export const useMusicStore = create<MusicStore>((set, get) => ({
  player: initialPlayerState,
  tracks: [],
  favorites: [],
  downloaded: [],
  playlists: [],
  recentlyPlayed: [],
  user: { id: 'user-1', name: 'Usuario MZ' },
  isLoading: true,
  error: null,

  setCurrentTrack: (currentTrack) => {
    set((state) => ({
      player: { ...state.player, currentTrack, currentTime: 0 },
    }));
  },

  setIsPlaying: (isPlaying) => {
    set((state) => ({
      player: { ...state.player, isPlaying },
    }));
  },

  setCurrentTime: (currentTime) => {
    set((state) => ({
      player: { ...state.player, currentTime },
    }));
  },

  setDuration: (duration) => {
    set((state) => ({
      player: { ...state.player, duration },
    }));
  },

  setQueue: (queue) => {
    set((state) => ({
      player: { ...state.player, queue, queueIndex: 0 },
    }));
  },

  nextTrack: () => {
    const state = get();
    const { queue, queueIndex } = state.player;
    if (queue.length === 0) return;
    const nextIndex = (queueIndex + 1) % queue.length;
    const nextTrack = queue[nextIndex];
    set((s) => ({
      player: {
        ...s.player,
        currentTrack: nextTrack,
        queueIndex: nextIndex,
        currentTime: 0,
      },
    }));
    get().addToRecent(nextTrack.id);
  },

  previousTrack: () => {
    const state = get();
    const { queue, queueIndex } = state.player;
    if (queue.length === 0) return;
    const prevIndex = (queueIndex - 1 + queue.length) % queue.length;
    const prevTrack = queue[prevIndex];
    set((s) => ({
      player: {
        ...s.player,
        currentTrack: prevTrack,
        queueIndex: prevIndex,
        currentTime: 0,
      },
    }));
    get().addToRecent(prevTrack.id);
  },

  setTracks: (tracks) => set({ tracks }),

  toggleFavorite: (trackId) => {
    set((state) => {
      const isFav = state.favorites.includes(trackId);
      return {
        favorites: isFav
          ? state.favorites.filter((id) => id !== trackId)
          : [...state.favorites, trackId],
      };
    });
  },

  isFavorite: (trackId) => get().favorites.includes(trackId),

  toggleDownload: (trackId) => {
    set((state) => {
      const isDownloaded = state.downloaded.includes(trackId);
      return {
        downloaded: isDownloaded
          ? state.downloaded.filter((id) => id !== trackId)
          : [...state.downloaded, trackId],
      };
    });
  },

  isDownloaded: (trackId) => get().downloaded.includes(trackId),

  createPlaylist: (name, description) => {
    const playlist: Playlist = {
      id: `pl-${Date.now()}`,
      name,
      description,
      cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=700&q=80',
      tracks: [],
      createdAt: new Date().toISOString(),
      isLocal: true,
    };
    set((state) => ({
      playlists: [...state.playlists, playlist],
    }));
  },

  addTrackToPlaylist: (playlistId, track) => {
    set((state) => ({
      playlists: state.playlists.map((p) =>
        p.id === playlistId
          ? { ...p, tracks: [...p.tracks, track] }
          : p
      ),
    }));
  },

  deletePlaylist: (playlistId) => {
    set((state) => ({
      playlists: state.playlists.filter((p) => p.id !== playlistId),
    }));
  },

  addToRecent: (trackId) => {
    set((state) => {
      const filtered = state.recentlyPlayed.filter((id) => id !== trackId);
      return {
        recentlyPlayed: [trackId, ...filtered].slice(0, 50),
      };
    });
  },

  setUser: (user) => set({ user }),

  setIsLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  loadState: async () => {
    try {
      const saved = await AsyncStorage.getItem('mz-music-state');
      if (!saved) return;
      const state = JSON.parse(saved);
      set({
        favorites: state.favorites || [],
        downloaded: state.downloaded || [],
        playlists: state.playlists || [],
        recentlyPlayed: state.recentlyPlayed || [],
      });
      console.log('✅ Estado local restaurado');
    } catch (error) {
      console.warn('⚠️ Error cargando estado local:', error);
    }
  },

  saveState: async () => {
    try {
      const state = get();
      await AsyncStorage.setItem(
        'mz-music-state',
        JSON.stringify({
          favorites: state.favorites,
          downloaded: state.downloaded,
          playlists: state.playlists,
          recentlyPlayed: state.recentlyPlayed,
        })
      );
      console.log('✅ Estado guardado');
    } catch (error) {
      console.warn('⚠️ Error guardando estado:', error);
    }
  },
}));
