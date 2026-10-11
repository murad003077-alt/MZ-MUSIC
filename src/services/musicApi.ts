import axios from 'axios';

const MUSIC_API_URL = process.env.VITE_MUSIC_API_URL || '';
const MUSIC_API_KEY = process.env.VITE_MUSIC_API_KEY || '';

const api = axios.create({
  baseURL: MUSIC_API_URL,
  headers: {
    'Authorization': `Bearer ${MUSIC_API_KEY}`,
  },
});

export interface TrackResponse {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: { name: string; images: Array<{ url: string }> };
  duration_ms: number;
  explicit: boolean;
  popularity: number;
  external_urls: { spotify: string };
}

export interface PlaylistResponse {
  id: string;
  name: string;
  description: string;
  images: Array<{ url: string }>;
  tracks: { items: TrackResponse[] };
}

export const musicApi = {
  /**
   * Buscar canciones por query (título, artista, género)
   * Requiere conexión a Spotify API
   */
  async searchTracks(query: string, limit: number = 20) {
    if (!MUSIC_API_URL) {
      console.warn('VITE_MUSIC_API_URL no configurada. Se usará catálogo local.');
      return [];
    }

    try {
      const response = await api.get('/search', {
        params: {
          q: query,
          type: 'track',
          limit,
        },
      });
      return response.data.tracks?.items || [];
    } catch (error) {
      console.error('Error en búsqueda de tracks:', error);
      return [];
    }
  },

  /**
   * Obtener top tracks de un artista
   */
  async getArtistTopTracks(artistId: string, country: string = 'ES') {
    if (!MUSIC_API_URL) return [];

    try {
      const response = await api.get(`/artists/${artistId}/top-tracks`, {
        params: { market: country },
      });
      return response.data.tracks || [];
    } catch (error) {
      console.error('Error obteniendo top tracks del artista:', error);
      return [];
    }
  },

  /**
   * Obtener playlists recomendadas
   */
  async getRecommendedPlaylists() {
    if (!MUSIC_API_URL) return [];

    try {
      const response = await api.get('/browse/featured-playlists', {
        params: { limit: 10 },
      });
      return response.data.playlists?.items || [];
    } catch (error) {
      console.error('Error obteniendo playlists recomendadas:', error);
      return [];
    }
  },

  /**
   * Obtener nuevos lanzamientos
   */
  async getNewReleases(limit: number = 20) {
    if (!MUSIC_API_URL) return [];

    try {
      const response = await api.get('/browse/new-releases', {
        params: { limit },
      });
      return response.data.albums?.items || [];
    } catch (error) {
      console.error('Error obteniendo nuevos lanzamientos:', error);
      return [];
    }
  },

  /**
   * Obtener recomendaciones basadas en tracks/géneros/artistas
   */
  async getRecommendations(
    seedArtists: string[] = [],
    seedGenres: string[] = [],
    seedTracks: string[] = [],
  ) {
    if (!MUSIC_API_URL) return [];

    try {
      const response = await api.get('/recommendations', {
        params: {
          seed_artists: seedArtists.slice(0, 5).join(','),
          seed_genres: seedGenres.slice(0, 5).join(','),
          seed_tracks: seedTracks.slice(0, 5).join(','),
          limit: 20,
        },
      });
      return response.data.tracks || [];
    } catch (error) {
      console.error('Error obteniendo recomendaciones:', error);
      return [];
    }
  },

  /**
   * Buscar un artista específico
   */
  async searchArtist(name: string) {
    if (!MUSIC_API_URL) return [];

    try {
      const response = await api.get('/search', {
        params: {
          q: name,
          type: 'artist',
          limit: 5,
        },
      });
      return response.data.artists?.items || [];
    } catch (error) {
      console.error('Error buscando artista:', error);
      return [];
    }
  },
};
