import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Image,
  StatusBar,
  ImageStyle,
  TextStyle,
  Dimensions,
  Animated,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import {RootStackParamList} from '../navigators/AppNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import RantCard from '../components/RantCard';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

// Modern theme with a fresh color palette
const theme = {
  colors: {
    primary: '#2563EB', // Modern Blue
    secondary: '#3B82F6', // Light Blue
    accent: '#60A5FA', // Sky Blue
    background: '#F8FAFC', // Light Gray Background
    card: '#FFFFFF', // White
    textPrimary: '#1E293B', // Dark Slate
    textSecondary: '#64748B', // Slate
    border: '#E2E8F0', // Light Gray
    location: '#EFF6FF', // Blue Gray
    success: '#10B981', // Emerald
    gradient: ['#2563EB', '#3B82F6'], // Blue gradient
    danger: '#EF4444', // Red
    warning: '#F59E0B', // Amber
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
      fontSize: 32,
      fontWeight: '700',
      fontFamily: 'Poppins-Bold',
      color: '#1E293B',
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
      fontFamily: 'Poppins-SemiBold',
      color: '#1E293B',
    },
    body: {
      fontSize: 16,
      fontFamily: 'Poppins-Regular',
      color: '#64748B',
    },
    caption: {
      fontSize: 14,
      fontFamily: 'Poppins-Regular',
      color: '#64748B',
    },
    small: {
      fontSize: 12,
      fontFamily: 'Poppins-Regular',
      color: '#64748B',
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
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = new Animated.Value(0);

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
    StatusBar.setBarStyle('light-content');
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

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const sortedRants = [...rants].sort((a, b) => {
    if (sortBy === 'recent') {
      return 0; // Maintain original order
    } else {
      return b.upvotes - a.upvotes;
    }
  });

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [160, 100],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          {
            height: headerHeight,
            opacity: headerOpacity,
          },
        ]}>
        <LinearGradient
          colors={theme.colors.gradient}
          style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/logo-ss.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.appName}>Citizen</Text>
            </View>
            <TouchableOpacity
              style={styles.locationContainer}
              onPress={getCurrentLocation}>
              <Icon name="map-marker" size={20} color={theme.colors.primary} />
              <Text style={styles.locationText}>
                {locationError || currentLocation}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sort Tabs */}
          <View style={styles.sortTabsContainer}>
            <View style={styles.sortTabs}>
              <TouchableOpacity
                style={[styles.sortTab, sortBy === 'recent' && styles.activeTab]}
                onPress={() => setSortBy('recent')}>
                <Icon
                  name="clock-outline"
                  size={20}
                  color={sortBy === 'recent' ? '#fff' : theme.colors.textSecondary}
                />
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
                <Icon
                  name="trending-up"
                  size={20}
                  color={sortBy === 'trending' ? '#fff' : theme.colors.textSecondary}
                />
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
        </LinearGradient>
      </Animated.View>

      {/* Rants List */}
      <Animated.FlatList
        data={sortedRants}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
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
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}
        scrollEventThrottle={16}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
  },
  headerGradient: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 0,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  } as ImageStyle,
  appName: {
    ...theme.typography.h1,
    color: '#fff',
    marginLeft: theme.spacing.sm,
    fontSize: 24,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
  },
  locationText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
  },
  sortTabsContainer: {
    alignItems: 'center',
    marginTop: 0,
  },
  sortTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: theme.borderRadius.lg,
    padding: 4,
    width: '70%',
  },
  sortTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  sortTabText: {
    ...theme.typography.caption,
    fontWeight: '600',
    color: '#fff',
  },
  activeTabText: {
    color: '#fff',
  },
  listContent: {
    paddingTop: 220, // Account for header height
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  postButton: {
    position: 'absolute',
    right: theme.spacing.lg,
    top: Platform.OS === 'ios' ? 50 : 40,
    zIndex: 20,
  },
  postButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default HomeScreen;
