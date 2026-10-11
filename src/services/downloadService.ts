import { Track } from '../types/music';

export function buildRecommendations(tracks: Track[], recentlyPlayed: Track[] = [], limit = 15): Track[] {
  if (!tracks.length) return [];

  const history = recentlyPlayed.length ? recentlyPlayed : tracks.slice(0, 3);
  const weights = new Map<string, number>();

  for (const track of history) {
    weights.set(track.genre, (weights.get(track.genre) || 0) + 1);
    weights.set(track.artist, (weights.get(track.artist) || 0) + 2);
  }

  return tracks
    .map((track) => {
      let score = 0;

      if (weights.has(track.genre)) score += (weights.get(track.genre) || 0) * 10;
      if (weights.has(track.artist)) score += (weights.get(track.artist) || 0) * 15;

      if (recentlyPlayed.some((t) => t.id === track.id)) score -= 100;

      return { track, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.track);
}
