import axios from 'axios';
import { Track } from '../types/music';

const BASE_URL = 'https://archive.org/advancedsearch.php';

export async function fetchArchiveTracks(query: string = 'genre:audio', limit = 20): Promise<Track[]> {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: `${query} AND mediatype:audio AND collection:audio_music`,
        fl: ['identifier', 'title', 'creator', 'format', 'collection'],
        rows: limit,
        output: 'json',
      },
    });

    const docs = response.data.response?.docs ?? [];
    return docs
      .filter((doc: any) => doc.format && String(doc.format).includes('MP3'))
      .map((doc: any, index: number) => ({
        id: `archive-${doc.identifier || index}`,
        title: doc.title || `Track ${index + 1}`,
        artist: doc.creator || 'Archivo público',
        album: doc.collection || 'Archive.org',
        duration: 180,
        genre: 'Público',
        cover: `https://archive.org/services/img/${doc.identifier}`,
        audioUrl: `https://archive.org/download/${doc.identifier}/${doc.identifier}_64kb.mp3`,
        source: 'archive',
        license: 'Dominio Público / Creative Commons',
        explicit: false,
      }));
  } catch (error) {
    console.error('Archive.org fetch error:', error);
    return [];
  }
}
