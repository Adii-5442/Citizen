import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import { colors, spacing, typography } from '../utils/theme';
import RantCard from '../components/RantCard';
import { RootStackParamList } from '../navigators/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const DUMMY_RANTS = [
  {
    id: '1',
    text: 'The potholes on Main Street are getting worse every day!',
    url: 'https://assets.dnainfo.com/generated/photo/2014/09/3-1411740404.jpg/extralarge.jpg',
    city: 'New York',
    upvotes: 15,
    timeAgo: '2h ago',
  },
  {
    id: '2',
    text: 'Why is the recycling collection always late in our neighborhood?',
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_Necw8YXxy8MjohW8Ayr3cl3r3yxvbhZAIivUbgcVTR7HVjuoLtk9Dj7aVEbwMQSD63o&usqp=CAU',
    city: 'Los Angeles',
    upvotes: 8,
    timeAgo: '5h ago',
  },
];

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [sortBy, setSortBy] = useState<'recent' | 'trending'>('recent');
  const [rants, setRants] = useState(DUMMY_RANTS);
  const [currentLocation, setCurrentLocation] = useState('Loading...');
  const [locationError, setLocationError] = useState<string | null>(null);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Citizen needs access to your location to show local rants.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await response.json();
          const city = data.address.city || data.address.town || data.address.village || 'Unknown Location';
          setCurrentLocation(city);
          setLocationError(null);
        } catch (error) {
          console.error('Error fetching location name:', error);
          setLocationError('Error getting location name');
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationError('Error getting location');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    const initLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        getCurrentLocation();
      } else {
        setLocationError('Location permission denied');
      }
    };

    initLocation();
  }, []);

  const handleUpvote = (rantId: string) => {
    setRants(prevRants =>
      prevRants.map(rant =>
        rant.id === rantId ? { ...rant, upvotes: rant.upvotes + 1 } : rant
      )
    );
  };

  const sortedRants = [...rants].sort((a, b) => {
    if (sortBy === 'recent') {
      return 0;
    } else {
      return b.upvotes - a.upvotes;
    }
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Citizen</Text>
          <View style={styles.locationContainer}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>
              {locationError || currentLocation}
            </Text>
          </View>
        </View>

        {/* Sort Tabs */}
        <View style={styles.sortContainer}>
          {['recent', 'trending'].map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.sortButton,
                sortBy === option && styles.activeSortButton,
              ]}
              onPress={() => setSortBy(option as 'recent' | 'trending')}
            >
              <Text style={[
                styles.sortText,
                sortBy === option && styles.activeSortText,
              ]}>
                {option === 'recent' ? 'Recent' : 'Trending'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Rants List */}
      <FlatList
        data={sortedRants}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <RantCard
            text={item.text}
            city={item.city}
            upvotes={item.upvotes}
            timeAgo={item.timeAgo}
            imageUrl={item.url}
            onUpvote={() => handleUpvote(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('PostRant')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  locationIcon: {
    marginRight: spacing.xs,
  },
  locationText: {
    ...typography.caption,
    color: colors.text,
  },
  sortContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: colors.border,
    borderRadius: 24,
    padding: spacing.xs,
  },
  sortButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
    borderRadius: 24,
  },
  activeSortButton: {
    backgroundColor: colors.primary,
  },
  sortText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600' as const,
  },
  activeSortText: {
    color: colors.background,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: 100, // so FAB doesn't block last rant
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    color: colors.background,
    fontSize: 24,
    fontWeight: 'bold' as const,
  },
});

export default HomeScreen;
