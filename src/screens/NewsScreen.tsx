import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';
import { useMusicStore } from '../store/musicStore';

export default function SearchScreen() {
  const { tracks, setCurrentTrack, setQueue } = useMusicStore();
  const [query, setQuery] = useState('');

  const filtered = tracks.filter((track) => {
    const haystack = `${track.title} ${track.artist} ${track.genre}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Busca artistas, canciones o géneros"
        placeholderTextColor={Colors.muted}
        value={query}
        onChangeText={setQuery}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              setCurrentTrack(item);
              setQueue(tracks);
            }}
          >
            <Image source={{ uri: item.cover }} style={styles.artwork} />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.artist}>{item.artist}</Text>
            </View>
            <Text style={styles.genre}>{item.genre}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, padding: 16 },
  input: {
    backgroundColor: '#101a15',
    borderColor: 'rgba(124,242,180,0.2)',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    color: Colors.white,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.panel,
    borderRadius: 14,
    marginBottom: 10,
  },
  artwork: { width: 52, height: 52, borderRadius: 12, marginRight: 12 },
  title: { color: Colors.white, fontWeight: '700' },
  artist: { color: Colors.muted },
  genre: { color: Colors.green, fontSize: 12 },
});
