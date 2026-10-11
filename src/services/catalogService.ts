import { Track } from '../types/music';

// Catálogo local de demostración con licencias válidas
const LOCAL_CATALOG: Track[] = [
  {
    id: 'demo-1',
    title: 'Tensión',
    artist: 'Morad (Demo)',
    album: 'Demos de demostración',
    duration: 203,
    genre: 'Hip-Hop',
    cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=700&q=80',
    audioUrl: '',
    source: 'local',
    license: 'Demo local (no reproducible)',
    canDownload: false,
    explicit: false,
    lyrics: ['Ritmo y poder', 'Bajo la noche', 'Sin mirar atrás', 'Sigue adelante'],
    attribution: 'Demo version for MZ MUSIC testing',
  },
  {
    id: 'demo-2',
    title: 'Zona de Sombra',
    artist: 'Beny Jr (Demo)',
    album: 'Demos de demostración',
    duration: 188,
    genre: 'Rap & Drill',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=700&q=80',
    audioUrl: '',
    source: 'local',
    license: 'Demo local (no reproducible)',
    canDownload: false,
    explicit: false,
    lyrics: ['Cruzo la ciudad', 'Sin miedo ni pausa'],
    attribution: 'Demo version for MZ MUSIC testing',
  },
  {
    id: 'demo-3',
    title: 'Baila Sin Parar',
    artist: 'JUL (Demo)',
    album: 'Demos de demostración',
    duration: 211,
    genre: 'Trap',
    cover: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80',
    audioUrl: '',
    source: 'local',
    license: 'Demo local (no reproducible)',
    canDownload: false,
    explicit: false,
    lyrics: ['La noche prende', 'Con fuerza y color', 'Sin parar'],
    attribution: 'Demo version for MZ MUSIC testing',
  },
];

export async function loadCatalog(): Promise<Track[]> {
  try {
    console.log('📡 Cargando catálogo...');
    // En producción, aquí se conectaría a Jamendo, Archive.org, etc.
    // Por ahora, devolvemos el catálogo local
    return LOCAL_CATALOG;
  } catch (error) {
    console.error('❌ Error cargando catálogo:', error);
    return LOCAL_CATALOG;
  }
}

export function canDownloadTrack(track: Track): boolean {
  const downloadableLicenses = [
    'Creative Commons',
    'CC0',
    'CC BY',
    'CC BY-SA',
    'Dominio Público',
  ];
  return downloadableLicenses.some((license) =>
    track.license.toLowerCase().includes(license.toLowerCase())
  );
}
