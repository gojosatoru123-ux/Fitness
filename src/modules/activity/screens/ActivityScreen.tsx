import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { Text } from '../../../components/common/Text';
import { Button } from '../../../components/common/Button';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../constants/theme';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Play, Pause, StopCircle, Navigation, Map as MapIcon, Timer, Flame, MapPin } from 'lucide-react-native';
import { useHealthStore } from '../../../store/healthStore';

const { width, height } = Dimensions.get('window');

export const ActivityScreen: React.FC = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [route, setRoute] = useState<Array<{ latitude: number; longitude: number }>>([]);
  const [stats, setStats] = useState({ distance: 0, duration: 0, calories: 0 });
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mapRef = useRef<MapView>(null);

  const { addActivity } = useHealthStore();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      
      // Auto-center map on first load
      if (loc && mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      }
    })();
  }, []);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    if (isTracking) {
      (async () => {
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 5,
          },
          (newLocation) => {
            const point = {
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
            };
            setRoute((prev) => [...prev, point]);
            setLocation(newLocation);
            
            // Auto-center on new location if tracking
            mapRef.current?.animateToRegion({
              ...point,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            });

            // Calculate distance (very rough approximation)
            if (route.length > 0) {
              const lastPoint = route[route.length - 1];
              const dist = Math.sqrt(
                Math.pow(point.latitude - lastPoint.latitude, 2) +
                Math.pow(point.longitude - lastPoint.longitude, 2)
              ) * 111; // 1 degree lat is ~111km
              setStats((prev) => ({ ...prev, distance: prev.distance + dist }));
            }
          }
        );
      })();

      timerRef.current = setInterval(() => {
        setStats((prev) => ({
          ...prev,
          duration: prev.duration + 1,
          calories: Math.floor(prev.duration / 60) * 10, // Mock calories
        }));
      }, 1000);
    } else {
      if (subscription) (subscription as any).remove();
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (subscription) (subscription as any).remove();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTracking]);

  const handleStartStop = () => {
    setIsTracking(!isTracking);
  };

  const handleFinish = () => {
    if (route.length > 0) {
      addActivity({
        id: Math.random().toString(),
        date: new Date().toISOString(),
        type: 'run',
        distance: parseFloat(stats.distance.toFixed(2)),
        duration: stats.duration,
        calories: stats.calories,
        pace: (stats.duration / 60 / (stats.distance || 1)).toFixed(2),
        route,
      });
      setRoute([]);
      setStats({ distance: 0, duration: 0, calories: 0 });
      setIsTracking(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation
        followsUserLocation={isTracking}
        initialRegion={location ? {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        } : undefined}
      >
        {route.length > 0 && (
          <Polyline
            coordinates={route}
            strokeWidth={4}
            strokeColor={COLORS.primary}
          />
        )}
        {location && (
          <Marker coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}>
            <View style={styles.marker}>
              <Navigation color="#FFF" size={16} fill="#FFF" />
            </View>
          </Marker>
        )}
      </MapView>

      <SafeAreaView style={styles.overlay}>
        <View style={styles.header}>
          <View style={styles.headerTitle}>
            <MapIcon color={COLORS.primary} size={24} />
            <Text variant="h2" weight="800" style={{ marginLeft: 8 }}>Run Tracker</Text>
          </View>
        </View>

        <View style={{ flex: 1 }} />

        <View style={styles.statsPanel}>
          <View style={styles.mainStats}>
            <View style={styles.statBox}>
              <Timer color={COLORS.text.secondary.light} size={20} />
              <Text style={styles.statValue}>{formatTime(stats.duration)}</Text>
              <Text variant="caption" color={COLORS.text.secondary.light}>Duration</Text>
            </View>
            <View style={styles.statBox}>
              <MapPin color={COLORS.text.secondary.light} size={20} />
              <Text style={styles.statValue}>{stats.distance.toFixed(2)}</Text>
              <Text variant="caption" color={COLORS.text.secondary.light}>Distance (km)</Text>
            </View>
            <View style={styles.statBox}>
              <Flame color={COLORS.text.secondary.light} size={20} />
              <Text style={styles.statValue}>{stats.calories}</Text>
              <Text variant="caption" color={COLORS.text.secondary.light}>Calories</Text>
            </View>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity
              style={[styles.controlBtn, { backgroundColor: isTracking ? COLORS.warning : COLORS.primary }]}
              onPress={handleStartStop}
            >
              {isTracking ? <Pause color="#FFF" size={32} /> : <Play color="#FFF" size={32} fill="#FFF" />}
            </TouchableOpacity>

            {!isTracking && route.length > 0 && (
              <TouchableOpacity
                style={[styles.controlBtn, { backgroundColor: COLORS.success }]}
                onPress={handleFinish}
              >
                <StopCircle color="#FFF" size={32} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    padding: SPACING.m,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.m,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.s,
    borderRadius: BORDER_RADIUS.xl,
  },
  statsPanel: {
    backgroundColor: '#FFF',
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  mainStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1C1E',
    marginVertical: 4,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xl,
  },
  controlBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    borderWidth: 3,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
