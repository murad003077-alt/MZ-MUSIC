import React, { useEffect, useMemo } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useMusicStore } from '../store/musicStore';
import { Colors } from '../constants/colors';
import { buildRecommendations } from '../services/recommendationService';

export default function HomeScreen() {
  const { tracks, setCurrentTrack, setQueue, favorites, playlists } = useMusicStore();

  const recommended = useMemo(() => buildRecommendations(tracks, tracks.slice(0, 2), 8), [tracks]);

  const playTrack = (item: any) => {
    setCurrentTrack(item);
    setQueue(tracks);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MZ MUSIC</Text>
      <Text style={styles.subtitle}>Tu mezcla diaria</Text>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recomendaciones</Text>
      </View>

      <FlatList
        horizontal
        data={recommended}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => playTrack(item)}>
            <Image source={{ uri: item.cover }} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardArtist}>{item.artist}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Tus playlists</Text>
      </View>

      {playlists.length > 0 ? (
        <FlatList
          data={playlists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.playlistRow}>
              <Image source={{ uri: item.cover }} style={styles.playlistImage} />
              <View style={{ flex: 1 }}>
                <Text style={styles.playlistTitle}>{item.name}</Text>
                <Text style={styles.playlistDescription}>{item.description}</Text>
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={styles.empty}>No hay playlists todavía.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, padding: 18 },
  title: { color: Colors.white, fontSize: 26, fontWeight: '900', marginTop: 14 },
  subtitle: { color: Colors.muted, fontSize: 15, marginBottom: 18 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18, marginBottom: 12 },
  sectionTitle: { color: Colors.white, fontSize: 18, fontWeight: '700' },
  card: { width: 160, marginRight: 14 },
  cardImage: { width: 160, height: 160, borderRadius: 18 },
  cardTitle: { color: Colors.white, marginTop: 8, fontWeight: '700' },
  cardArtist: { color: Colors.muted },
  playlistRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12, padding: 10, backgroundColor: Colors.panel, borderRadius: 16 },
  playlistImage: { width: 64, height: 64, borderRadius: 12 },
  playlistTitle: { color: Colors.white, fontWeight: '700' },
  playlistDescription: { color: Colors.muted, marginTop: 4 },
  empty: { color: Colors.muted },
});
