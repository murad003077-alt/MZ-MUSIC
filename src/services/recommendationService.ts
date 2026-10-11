import { Track } from '../types/music';

export function buildRecommendations(
  allTracks: Track[],
  recentlyPlayed: string[] = [],
  favorites: string[] = [],
  limit: number = 15
): Track[] {
  if (!allTracks.length) return [];

  const recentTracks = recentlyPlayed.slice(0, 5);
  const favoriteTracks = favorites.slice(0, 5);

  // Contar géneros y artistas
  const genreWeights = new Map<string, number>();
  const artistWeights = new Map<string, number>();

  allTracks
    .filter((t) => recentTracks.includes(t.id) || favoriteTracks.includes(t.id))
    .forEach((track) => {
      genreWeights.set(track.genre, (genreWeights.get(track.genre) || 0) + 1);
      artistWeights.set(track.artist, (artistWeights.get(track.artist) || 0) + 1);
    });

  // Puntuar tracks
  const scored = allTracks.map((track) => {
    let score = 0;

    // Bonus por género
    if (genreWeights.has(track.genre)) {
      score += (genreWeights.get(track.genre) || 0) * 10;
    }

    // Bonus por artista
    if (artistWeights.has(track.artist)) {
      score += (artistWeights.get(track.artist) || 0) * 15;
    }

    // Penalidad si ya se escuchó
    if (recentTracks.includes(track.id)) {
      score -= 100;
    }

    return { track, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.track);
}

export function buildRadio(track: Track, allTracks: Track[], limit: number = 30): Track[] {
  const artistTracks = allTracks.filter(
    (t) => t.artist === track.artist && t.id !== track.id
  );

  const genreTracks = allTracks.filter(
    (t) => t.genre === track.genre && t.id !== track.id
  );

  const combined = [track, ...artistTracks.slice(0, 10), ...genreTracks.slice(0, 10)];
  return combined.slice(0, limit);
}
