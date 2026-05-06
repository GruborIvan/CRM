import { useState } from 'react';
import { Image } from 'expo-image';
import { Alert, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLogout } from '@/src/modules/auth/hooks/use-auth';

const NAV_ITEMS = ['Ljudi', 'Firme', 'Taskovi', 'Grupe'] as const;

export default function HomeScreen() {
  const { logout } = useLogout();
  const theme = useColorScheme() ?? 'light';

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={styles.root}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
        }>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome!</ThemedText>
          <HelloWave />
        </ThemedView>
        <ThemedView style={styles.grid}>
          {NAV_ITEMS.map((label) => (
            <NavCard key={label} label={label} />
          ))}
        </ThemedView>
      </ParallaxScrollView>

      <TouchableOpacity
        style={[styles.logoutBtn, theme === 'dark' ? styles.logoutBtnDark : styles.logoutBtnLight]}
        onPress={handleLogout}
        activeOpacity={0.7}>
        <Ionicons
          name="log-out-outline"
          size={22}
          color={theme === 'dark' ? '#9BA1A6' : '#687076'}
        />
      </TouchableOpacity>
    </View>
  );
}

function NavCard({ label }: { label: string }) {
  const [hovered, setHovered] = useState(false);
  const theme = useColorScheme() ?? 'light';
  const isDark = theme === 'dark';

  return (
    <Pressable
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={({ pressed }) => [
        styles.card,
        isDark ? styles.cardDark : styles.cardLight,
        hovered && (isDark ? styles.cardDarkHovered : styles.cardLightHovered),
        pressed && styles.cardPressed,
      ]}>
      <ThemedText type="defaultSemiBold" style={styles.cardLabel}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  logoutBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  logoutBtnLight: {
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  logoutBtnDark: {
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%',
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
    cursor: 'pointer',
  },
  cardLight: {
    backgroundColor: '#f0f4f8',
    borderColor: '#dde3ea',
  },
  cardDark: {
    backgroundColor: '#252a2e',
    borderColor: '#333b42',
  },
  cardLightHovered: {
    backgroundColor: '#dce8f2',
    borderColor: '#a8c8e0',
  },
  cardDarkHovered: {
    backgroundColor: '#323a42',
    borderColor: '#4a5660',
  },
  cardPressed: {
    opacity: 0.75,
  },
  cardLabel: {
    fontSize: 17,
    textAlign: 'center',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
