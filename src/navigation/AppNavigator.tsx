import { Track } from '../types/music';
import { fetchJamendoTracks, fetchJamendoLatest } from '../services/jamendoService';
import { fetchArchiveTracks } from '../services/archiveOrgService';

const DEFAULT_CATALOG: Track[] = [
  {
    id: 'local-morad-1',
    title: 'Tensión',
    artist: 'Morad',
    album: 'Rooftop Sessions',
    duration: 203,
    genre: 'Hip-Hop',
    cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=700&q=80',
    audioUrl: '',
    source: 'local',
    license: 'Demo local — no reproducción real',
    explicit: false,
    lyrics: ['Ritmo y poder', 'Bajo la noche', 'Sin mirar atrás'],
  },
  {
    id: 'local-beny-1',
    title: 'Zona de sombra',
    artist: 'Beny Jr',
    album: 'Noche Premium',
    duration: 188,
    genre: 'Rap & Drill',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=700&q=80',
    audioUrl: '',
    source: 'local',
    license: 'Demo local — no reproducción real',
    explicit: false,
    lyrics: ['Cruzo la ciudad', 'Sin miedo ni pausa'],
  },
  {
    id: 'local-jul-1',
    title: 'Baila sin parar',
    artist: 'JUL',
    album: 'Nocturno',
    duration: 211,
    genre: 'Trap',
    cover: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80',
    audioUrl: '',
    source: 'local',
    license: 'Demo local — no reproducción real',
    explicit: false,
    lyrics: ['La noche prende', 'Con fuerza y color'],
  },
];

export async function loadCatalog(): Promise<Track[]> {
  try {
    const jamendoTracks = await fetchJamendoTracks('urban', 10);
    const archiveTracks = await fetchArchiveTracks('music', 10);
    const latestTracks = await fetchJamendoLatest(10);

    const merged = [...jamendoTracks, ...archiveTracks, ...latestTracks, ...DEFAULT_CATALOG];

    const unique = merged.filter(
      (track, index, arr) => arr.findIndex((item) => item.id === track.id) === index
    );

    return unique.filter((track) => track.audioUrl && track.audioUrl.length > 0).slice(0, 30);
  } catch (error) {
    console.warn('Catalog fallback mode:', error);
    return DEFAULT_CATALOG;
  }
}

export const defaultPlaylists = [
  { id: 'pl-1', name: 'MZ Flow', description: 'Urban energy', cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=700&q=80', tracks: DEFAULT_CATALOG.slice(0, 2), createdAt: new Date().toISOString() },
  { id: 'pl-2', name: 'Night Drive', description: 'Late-night motion', cover: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=700&q=80', tracks: DEFAULT_CATALOG.slice(1, 3), createdAt: new Date().toISOString() },
];
