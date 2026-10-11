import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <View style={styles.card}>
        <Text style={styles.name}>Maya Ruiz</Text>
        <Text style={styles.info}>Plan gratuito • MZ MUSIC</Text>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.stat}><Text style={styles.statValue}>24</Text><Text style={styles.statLabel}>Playlists</Text></View>
        <View style={styles.stat}><Text style={styles.statValue}>87</Text><Text style={styles.statLabel}>Favoritos</Text></View>
        <View style={styles.stat}><Text style={styles.statValue}>12</Text><Text style={styles.statLabel}>Descargas</Text></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, padding: 18 },
  title: { color: Colors.white, fontSize: 26, fontWeight: '900', marginBottom: 18 },
  card: { backgroundColor: Colors.panel, borderRadius: 18, padding: 20 },
  name: { color: Colors.white, fontSize: 22, fontWeight: '800' },
  info: { color: Colors.muted, marginTop: 6 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 },
  stat: { flex: 1, backgroundColor: Colors.panel, borderRadius: 14, paddingVertical: 20, marginHorizontal: 6, alignItems: 'center' },
  statValue: { color: Colors.green, fontSize: 24, fontWeight: '800' },
  statLabel: { color: Colors.muted, marginTop: 4 },
});
