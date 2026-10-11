import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { Colors } from '../constants/colors';

const releases = [
  { id: 'n1', title: 'Urban Flow Vol. 9', artist: 'Morad', cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=700&q=80' },
  { id: 'n2', title: 'Nocturnal Echo', artist: 'JUL', cover: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80' },
  { id: 'n3', title: 'Night Drive', artist: 'Beny Jr', cover: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=700&q=80' },
];

export default function NewsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novedades</Text>
      <FlatList
        data={releases}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.cover }} style={styles.image} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.name}>{item.title}</Text>
              <Text style={styles.artist}>{item.artist}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, padding: 18 },
  title: { color: Colors.white, fontSize: 26, fontWeight: '900', marginBottom: 18 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.panel, borderRadius: 16, padding: 12, marginBottom: 12 },
  image: { width: 70, height: 70, borderRadius: 14 },
  name: { color: Colors.white, fontWeight: '700' },
  artist: { color: Colors.muted, marginTop: 4 },
});
