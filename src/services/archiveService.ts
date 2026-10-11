import axios from 'axios';
import { Track } from '../types/music';

const ARCHIVE_API = 'https://archive.org/advancedsearch.php';

export async function fetchArchiveTracks(query: string = 'music audio', limit: number = 15): Promise<Track[]> {
  try {
    console.log(`📡 Buscando en Archive.org: ${query}`);
    const response = await axios.get(ARCHIVE_API, {
      params: {
        q: `${query} AND mediatype:audio AND (licenseurl:"publicdomain" OR licenseurl:"creativecommons")`,
        fl: ['identifier', 'title', 'creator', 'format', 'licenseurl'],
        output: 'json',
        rows: limit,
      },
      timeout: 5000,
    });

    const docs = response.data.response?.docs || [];
    return docs
      .filter((doc: any) => doc.format && doc.format.includes('MP3'))
      .map((doc: any, index: number) => ({
        id: `archive-${doc.identifier || index}`,
        title: doc.title || `Track ${index + 1}`,
        artist: Array.isArray(doc.creator) ? doc.creator[0] : doc.creator || 'Archive.org',
        album: 'Archive.org Collection',
        duration: 180,
        genre: 'Public Domain',
        cover: `https://archive.org/services/img/${doc.identifier}`,
        audioUrl: `https://archive.org/download/${doc.identifier}/${doc.identifier}_64kb.mp3`,
        source: 'archive' as const,
        license: doc.licenseurl ? 'Public Domain / Creative Commons' : 'Public Domain',
        canDownload: true,
        explicit: false,
        attribution: `Source: Archive.org. Artist: ${doc.creator || 'Unknown'}`,
      }));
  } catch (error) {
    console.warn('⚠️ Archive.org API error:', error);
    return [];
  }
}
