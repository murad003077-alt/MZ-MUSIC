import axios from 'axios';
import { Track } from '../types/music';

const JAMENDO_API = 'https://api.jamendo.com/v3.0';
const CLIENT_ID = 'demo_client_id';

export async function fetchJamendoTracks(query: string = 'indie', limit: number = 15): Promise<Track[]> {
  try {
    console.log(`📡 Buscando en Jamendo: ${query}`);
    const response = await axios.get(`${JAMENDO_API}/tracks`, {
      params: {
        client_id: CLIENT_ID,
        format: 'json',
        limit,
        search: query,
        audiodlformat: 'mp32',
      },
      timeout: 5000,
    });

    const results = response.data.results || [];
    return results
      .filter((track: any) => track.audio && track.audio.length > 0)
      .map((track: any) => ({
        id: `jamendo-${track.id}`,
        title: track.name,
        artist: track.artist_name,
        album: track.album_name || 'Independent',
        duration: Number(track.duration) || 180,
        genre: 'Independent',
        cover: track.image || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=700&q=80',
        audioUrl: track.audio || '',
        source: 'jamendo' as const,
        license: 'Creative Commons',
        canDownload: true,
        explicit: false,
        attribution: `Artist: ${track.artist_name}`,
      }));
  } catch (error) {
    console.warn('⚠️ Jamendo API error:', error);
    return [];
  }
}

export async function fetchJamendoLatest(limit: number = 15): Promise<Track[]> {
  try {
    return fetchJamendoTracks('new releases', limit);
  } catch (error) {
    console.warn('⚠️ Error fetching latest from Jamendo:', error);
    return [];
  }
}
