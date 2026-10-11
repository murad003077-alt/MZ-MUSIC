import { Track } from '../store/musicStore';

export interface MoodPlaylist {
  id: string;
  name: string;
  mood: string;
  description: string;
  color: string;
  genre: string[];
}

// Playlists predefinidas por mood
export const moodPlaylists: MoodPlaylist[] = [
  {
    id: 'mood-1',
    name: 'Noche Intensa',
    mood: 'Dark',
    description: 'Sonidos oscuros para la madrugada',
    color: '#7EE7B0',
    genre: ['hip-hop', 'trap', 'dark'],
  },
  {
    id: 'mood-2',
    name: 'Drive Mode',
    mood: 'Alta energía',
    description: 'Ritmo puro para el viaje',
    color: '#6AD7FF',
    genre: ['trap', 'reggaeton', 'hip-hop'],
  },
  {
    id: 'mood-3',
    name: 'Relajación',
    mood: 'Flow',
    description: 'Sonidos suaves para desconectar',
    color: '#F7C873',
    genre: ['ambient', 'chill', 'lo-fi'],
  },
  {
    id: 'mood-4',
    name: 'Fiesta',
    mood: 'Club',
    description: 'Puro groove para la pista',
    color: '#FF5E8C',
    genre: ['house', 'reggaeton', 'dance'],
  },
];

export const aiRecommendationService = {
  /**
   * Obtener playlist según mood
   * En producción, esto se conectaría con IA real (OpenAI, Firebase ML, etc)
   */
  getMoodPlaylist(mood: string): MoodPlaylist | undefined {
    return moodPlaylists.find((p) => p.mood.toLowerCase() === mood.toLowerCase());
  },

  /**
   * Generar recomendaciones basadas en historial de reproducción
   * NOTA: Esto es una simulación. En producción usar OpenAI, TensorFlow, etc
   */
  async generateRecommendations(
    recentTracks: Track[],
    allAvailableTracks: Track[],
  ): Promise<Track[]> {
    try {
      if (!recentTracks.length) {
        return allAvailableTracks.slice(0, 10);
      }

      // Extraer géneros del historial
      const recentGenres = recentTracks.map((t) => t.genre);
      const artistsPlayed = recentTracks.map((t) => t.artist);

      // Filtrar tracks similares
      const recommendations = allAvailableTracks.filter(
        (track) =>
          (recentGenres.includes(track.genre) || artistsPlayed.includes(track.artist)) &&
          !recentTracks.some((t) => t.id === track.id),
      );

      // Aleatorizar y limitar
      return recommendations.sort(() => Math.random() - 0.5).slice(0, 20);
    } catch (error) {
      console.error('Error generando recomendaciones:', error);
      return allAvailableTracks.slice(0, 10);
    }
  },

  /**
   * Generar radio personalizada a partir de una canción
   */
  async generateRadio(track: Track, allAvailableTracks: Track[]): Promise<Track[]> {
    try {
      // Buscar tracks del mismo artista
      const artistTracks = allAvailableTracks.filter(
        (t) => t.artist === track.artist && t.id !== track.id,
      );

      // Buscar tracks del mismo género
      const genreTracks = allAvailableTracks.filter(
        (t) => t.genre === track.genre && t.id !== track.id,
      );

      // Mezclar y aleatorizar
      const mixed = [
        ...artistTracks.slice(0, 5),
        ...genreTracks.slice(0, 15),
      ].sort(() => Math.random() - 0.5);

      return [track, ...mixed.slice(0, 30)];
    } catch (error) {
      console.error('Error generando radio:', error);
      return [track];
    }
  },

  /**
   * Obtener playlist basada en hora del día
   */
  getTimeBasedPlaylist(allTracks: Track[]): Track[] {
    const hour = new Date().getHours();
    let mood = 'Relax';

    if (hour >= 6 && hour < 12) mood = 'Morning';
    if (hour >= 12 && hour < 18) mood = 'Afternoon';
    if (hour >= 18 && hour < 22) mood = 'Evening';
    if (hour >= 22 || hour < 6) mood = 'Night';

    // Filtrar según mood
    const moodGenres: { [key: string]: string[] } = {
      Morning: ['pop', 'indie', 'alternative'],
      Afternoon: ['hip-hop', 'trap', 'reggaeton'],
      Evening: ['rnb', 'soul', 'indie'],
      Night: ['ambient', 'chill', 'lo-fi', 'trap'],
      Relax: ['ambient', 'chill', 'lo-fi'],
    };

    return allTracks
      .filter((t) => moodGenres[mood]?.includes(t.genre))
      .sort(() => Math.random() - 0.5)
      .slice(0, 30);
  },
};
