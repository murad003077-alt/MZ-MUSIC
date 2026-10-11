import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { useMusicStore } from '../store/musicStore';
import { Colors } from '../constants/colors';

export default function LibraryScreen() {
  const { favorites, downloaded, tracks } = useMusicStore();

  const savedTracks = tracks.filter((track) => favorites.includes(track.id) || downloaded.includes(track.id));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi música</Text>
      {savedTracks.length > 0 ? (
        <FlatList
          data={savedTracks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Image source={{ uri: item.cover }} style={styles.cover} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.title}</Text>
                <Text style={styles.artist}>{item.artist}</Text>
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={styles.empty}>Todavía no has guardado música.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, padding: 18 },
  title: { color: Colors.white, fontSize: 26, fontWeight: '900', marginBottom: 18 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, backgroundColor: Colors.panel, padding: 12, borderRadius: 14 },
  cover: { width: 54, height: 54, borderRadius: 12, marginRight: 12 },
  name: { color: Colors.white, fontWeight: '700' },
  artist: { color: Colors.muted },
  empty: { color: Colors.muted },
});
