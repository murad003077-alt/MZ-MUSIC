import axios from 'axios';
import { Track } from '../types/music';

const BASE_URL = 'https://api.jamendo.com/v3.0';

export async function fetchJamendoTracks(query: string = 'indie', limit = 20): Promise<Track[]> {
  try {
    const response = await axios.get(`${BASE_URL}/tracks`, {
      params: {
        client_id: process.env.REACT_APP_JAMENDO_CLIENT_ID || 'demo_client_id',
        format: 'json',
        limit,
        search: query,
      },
    });

    const items = response.data.results ?? [];
    return items.map((track: any) => ({
      id: String(track.id),
      title: track.name,
      artist: track.artist_name,
      album: track.album_name || 'Independent',
      duration: Number(track.duration || 180),
      genre: 'Independiente',
      cover: track.image || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=700&q=80',
      audioUrl: track.audio || track.audio_high || track.audio_low || '',
      source: 'jamendo',
      license: 'Creative Commons',
      explicit: false,
      lyrics: ['Letras no disponibles para esta licencia.'],
    }));
  } catch (error) {
    console.error('Jamendo fetch error:', error);
    return [];
  }
}

export async function fetchJamendoLatest(limit = 20): Promise<Track[]> {
  return fetchJamendoTracks('new', limit);
}
