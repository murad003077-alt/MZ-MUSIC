import { Track } from '../store/musicStore';

// Catálogo de demostración (fallback seguro)
export const mockCatalog: Track[] = [
  {
    id: 'track-1',
    title: 'Tensión',
    artist: 'Morad',
    album: 'Calendario',
    duration: 202,
    genre: 'Hip-Hop',
    cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80',
    availableOffline: false,
    status: 'Spotify Premium requerido',
    source: 'Mock Catalog - Conectar a Spotify API',
    lyrics: [
      'Cierro los ojos y dejo el ruido atrás',
      'Mi barrio me guía, mi pulso va más alto',
      'No busco permiso, me invento mi lugar',
      'Entre luces verdes y pasos sin final.',
    ],
  },
  {
    id: 'track-2',
    title: 'Zona de sombra',
    artist: 'Beny Jr',
    album: 'Mente al 100',
    duration: 168,
    genre: 'Rap & Drill',
    cover: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=600&q=80',
    availableOffline: false,
    status: 'Spotify Premium requerido',
    source: 'Mock Catalog - Conectar a Spotify API',
    lyrics: [
      'Vuelvo a la calle con la cabeza en marcha',
      'La luna se refleja en la carretera y en mi mirada',
      'Dejo la duda y sigo sin mirar atrás',
      'Cada paso tiene un pulso que me empuja a brillar.',
    ],
  },
  {
    id: 'track-3',
    title: 'Baila sin parar',
    artist: 'JUL',
    album: 'Nocturno',
    duration: 191,
    genre: 'Trap',
    cover: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    availableOffline: false,
    status: 'Spotify Premium requerido',
    source: 'Mock Catalog - Conectar a Spotify API',
    lyrics: [
      'La noche se empapa de color y energía',
      'Todos en la pista, sin freno y sin miedo',
      'Sube la presión, se larga la melodía',
      'Y cada paso llama a otra historia en movimiento.',
    ],
  },
  {
    id: 'track-4',
    title: 'Skyline',
    artist: 'Ava Nova',
    album: 'Night Shift',
    duration: 186,
    genre: 'Hip-Hop',
    cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=600&q=80',
    availableOffline: false,
    status: 'Spotify Premium requerido',
    source: 'Mock Catalog - Conectar a Spotify API',
    lyrics: [
      'La ciudad se enciende con mi nombre',
      'Cada semáforo me empuja a seguir',
      'Sostengo el pulso entre el humo y la espuma',
      'Y el futuro se hace presente en cada latido.',
    ],
  },
];

export const mockPlaylists = [
  {
    id: 'p1',
    name: 'MZ Flow',
    description: 'Una mezcla de ritmos urbanos y energía premium.',
    cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=750&q=80',
    tracks: mockCatalog.slice(0, 2),
  },
  {
    id: 'p2',
    name: 'Noche Callejera',
    description: 'Sonidos oscuros para salir y brillar.',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=750&q=80',
    tracks: mockCatalog.slice(1, 3),
  },
];
