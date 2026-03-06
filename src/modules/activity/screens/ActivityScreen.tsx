import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, Platform } from 'react-native';
import MapView, { Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Text } from '../../../components/common/Text';
import { Button } from '../../../components/common/Button';
import { COLORS, SPACING, BORDER_RADIUS } from '../../../constants/theme';
import { Play, Pause, Square, Map as MapIcon, History, Activity } from 'lucide-react-native';
import { useHealthStore, ActivityEntry } from '../../../store/healthStore';

const { width, height } = Dimensions.get('window');

export const ActivityScreen: React.FC = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [route, setRoute] = useState<Array<{ latitude: number; longitude: number }>>([]);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { addActivity } = useHealthStore();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let initialLocation = await Location.getCurrentPositionAsync({});
      setLocation(initialLocation);
    })();
  }, []);

  const startTracking = async () => {
    setIsTracking(true);
    setRoute([]);
    setDistance(0);
    setDuration(0);

    timerRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 5,
      },
      (newLocation) => {
        setLocation(newLocation);
        setRoute((prev) => [
          ...prev,
          { latitude: newLocation.coords.latitude, longitude: newLocation.coords.longitude },
        ]);
        // Simple distance calculation (not precise here but for UI)
        if (route.length > 0) {
          setDistance((prev) => prev + 0.005); // Add 5 meters per update for dummy
        }
      }
    );
  };

  const stopTracking = () => {
    setIsTracking(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    const newActivity: ActivityEntry = {
      id: Math.random().toString(),
      date: new Date().toISOString(),
      type: 'run',
      distance: Number(distance.toFixed(2)),
      duration,
      calories: Math.round(distance * 60),
      pace: (duration / 60 / distance).toFixed(2),
      route: route,
    };
    addActivity(newActivity);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location?.coords.latitude || 37.78825,
          longitude: location?.coords.longitude || -122.4324,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        provider={PROVIDER_GOOGLE}
      >
        <Polyline
          coordinates={route}
          strokeColor={COLORS.primary}
          strokeWidth={6}
        />
      </MapView>

      <SafeAreaView style={styles.uiContainer}>
        {/* Header Overlay */}
        <View style={styles.statsHeader}>
          <View style={styles.statBox}>
            <Text variant="h3" weight="700">{distance.toFixed(2)}</Text>
            <Text variant="caption">Distance (km)</Text>
          </View>
          <View style={styles.statBox}>
            <Text variant="h3" weight="700">{formatTime(duration)}</Text>
            <Text variant="caption">Time</Text>
          </View>
          <View style={styles.statBox}>
            <Text variant="h3" weight="700">{(distance / (duration / 3600) || 0).toFixed(1)}</Text>
            <Text variant="caption">Speed (km/h)</Text>
          </View>
        </View>

        {/* Controls Overlay */}
        <View style={styles.controls}>
          {!isTracking ? (
            <TouchableOpacity style={styles.startCircle} onPress={startTracking}>
              <Play fill="#FFF" color="#FFF" size={32} />
              <Text variant="headline" color="#FFF" weight="700">START</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.trackingControls}>
              <TouchableOpacity style={styles.stopBtn} onPress={stopTracking}>
                <Square fill="#FFF" color="#FFF" size={24} />
              </TouchableOpacity>
            </View>
          )}
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
  uiContainer: {
    flex: 1,
    justifyContent: 'space-between',
    pointerEvents: 'box-none',
  },
  statsHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.9)',
    margin: SPACING.m,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.m,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  controls: {
    alignItems: 'center',
    marginBottom: 100,
    pointerEvents: 'box-none',
  },
  startCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
    gap: 4,
  },
  trackingControls: {
    flexDirection: 'row',
    gap: SPACING.xl,
  },
  stopBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.error,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
});
