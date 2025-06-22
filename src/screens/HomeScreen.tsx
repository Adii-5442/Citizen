import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import {RootStackParamList} from '../navigators/AppNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import RantCard from '../components/RantCard';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

// Custom theme with beautiful color palette
const theme = {
  colors: {
    primary: '#2E86AB', // Vibrant Purple
    secondary: '#00CEC9', // Turquoise
    accent: '#FD79A8', // Pink
    background: '#FFFFFF', // Pure White
    card: '#F9F9FF', // Light Lavender
    textPrimary: '#2D3436', // Dark Grey
    textSecondary: '#636E72', // Medium Grey
    border: '#E6E6F0', // Soft Lavender border
    location: '#dfe6e9', // Light Blue Grey
    success: '#00B894', // Green
    gradient: ['#2E86AB', '#8E5CE7'], // Purple gradient
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    h1: {
      fontSize: 28,
      fontWeight: '700',
      fontFamily: 'Poppins-Bold',
      color: '#2D3436',
    },
    h2: {
      fontSize: 22,
      fontWeight: '600',
      fontFamily: 'Poppins-SemiBold',
      color: '#2D3436',
    },
    body: {
      fontSize: 16,
      fontFamily: 'Poppins-Regular',
      color: '#636E72',
    },
    caption: {
      fontSize: 14,
      fontFamily: 'Poppins-Regular',
      color: '#636E72',
    },
    small: {
      fontSize: 12,
      fontFamily: 'Poppins-Regular',
      color: '#636E72',
    },
  },
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    circle: 9999,
  },
};

const DUMMY_RANTS = [
  {
    id: '1',
    text: 'The potholes on Main Street are getting worse every day! The city needs to address this issue before someone gets hurt or damages their vehicle.',
    url: 'https://assets.dnainfo.com/generated/photo/2014/09/3-1411740404.jpg/extralarge.jpg',
    city: 'New York',
    upvotes: 15,
    timeAgo: '2h ago',
  },
  {
    id: '2',
    text: 'Why is the recycling collection always late in our neighborhood? This is the third week in a row that pickup has been delayed by at least a day.',
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_Necw8YXxy8MjohW8Ayr3cl3r3yxvbhZAIivUbgcVTR7HVjuoLtk9Dj7aVEbwMQSD63o&usqp=CAU',
    city: 'Los Angeles',
    upvotes: 8,
    timeAgo: '5h ago',
  },
  {
    id: '3',
    text: 'The new park beautification project has been abandoned halfway through. Now we have half a nice park and half an eyesore!',
    url: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGFya3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    city: 'Chicago',
    upvotes: 23,
    timeAgo: '1d ago',
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
            message:
              'Citizen needs access to your location to show local rants.',
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
      async position => {
        const {latitude, longitude} = position.coords;
        console.log('latitude', latitude);
        console.log('longitude', longitude);
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          );
          const data = await response.json();
          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            'Unknown Location';
          setCurrentLocation(city);
          setLocationError(null);
        } catch (error) {
          console.error('Error fetching location name:', error);
          setLocationError('Error getting location name');
        }
      },
      error => {
        console.error('Error getting location:', error);
        setLocationError('Error getting location');
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
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
    StatusBar.setBarStyle('dark-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }
  }, []);

  const handleUpvote = (rantId: string) => {
    setRants(prevRants =>
      prevRants.map(rant =>
        rant.id === rantId ? {...rant, upvotes: rant.upvotes + 1} : rant,
      ),
    );
  };

  const sortedRants = [...rants].sort((a, b) => {
    if (sortBy === 'recent') {
      return 0; // Maintain original order
    } else {
      return b.upvotes - a.upvotes;
    }
  });

  return (
    <ScrollView
      style={styles.container}
      stickyHeaderIndices={[1]}
      showsVerticalScrollIndicator={false}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.leftSection}>
            <Text style={styles.logoText}>CITIZEN</Text>
          </View>
          
          <View style={styles.centerSection}>
            <View style={styles.levelBadge}>
              <View style={styles.levelBadgeInner}>
                <Text style={styles.levelIcon}>⭐️</Text>
                <Text style={styles.levelText}>Level 5</Text>
              </View>
            </View>
          </View>

          <View style={styles.rightSection}>
            <TouchableOpacity
              style={styles.locationContainer}
              onPress={getCurrentLocation}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.locationText} numberOfLines={1}>
                {locationError || currentLocation}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Sort Tabs */}
      <View style={styles.sortTabsContainer}>
        <View style={styles.sortTabs}>
          <TouchableOpacity
            style={[styles.sortTab, sortBy === 'recent' && styles.activeTab]}
            onPress={() => setSortBy('recent')}>
            <Text
              style={[
                styles.sortTabText,
                sortBy === 'recent' && styles.activeTabText,
              ]}>
              Recent
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sortTab,
              sortBy === 'trending' && styles.activeTab,
            ]}
            onPress={() => setSortBy('trending')}>
            <Text
              style={[
                styles.sortTabText,
                sortBy === 'trending' && styles.activeTabText,
              ]}>
              Trending
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Rants List */}
      <View style={styles.rantsContainer}>
        {sortedRants.map(item => (
          <RantCard
            key={item.id}
            text={item.text}
            city={item.city}
            upvotes={item.upvotes}
            timeAgo={item.timeAgo}
            imageUrl={item.url}
            onUpvote={() => handleUpvote(item.id)}
          />
        ))}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fabContainer}
        onPress={() => navigation.navigate('PostRant')}
        activeOpacity={0.9}>
        <View style={styles.fab}>
          <Text style={styles.fabIcon}>+</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight,
    backgroundColor: theme.colors.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  logoContainer: {
    height: 40,
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.background,
    letterSpacing: 1.5,
    fontFamily: 'Poppins-Bold',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  levelBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 2,
  },
  levelBadgeInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 18,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  levelIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  levelText: {
    ...theme.typography.caption,
    color: theme.colors.background,
    fontWeight: '600',
    fontSize: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
    width: 140,
    justifyContent: 'center',
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  locationText: {
    ...theme.typography.caption,
    color: theme.colors.background,
    fontWeight: '500',
    flex: 1,
  },
  sortTabsContainer: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  sortTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: 30,
    padding: 4,
    width: 200,
    alignSelf: 'center',
  },
  sortTab: {
    flex: 1,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: theme.colors.background,
  },
  sortTabText: {
    ...theme.typography.caption,
    fontWeight: '600',
    color: theme.colors.background,
  },
  activeTabText: {
    color: theme.colors.primary,
  },
  rantsContainer: {
    padding: theme.spacing.lg,
  },
  fabContainer: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: theme.spacing.xl,
    shadowColor: theme.colors.primary,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
  },
  fabIcon: {
    color: theme.colors.background,
    fontSize: 32,
    fontWeight: '300',
    marginBottom: 2,
  },
});

export default HomeScreen;
