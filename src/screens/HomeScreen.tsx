import React, { useState, useEffect } from 'react';
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
  Animated,
  ImageStyle,
  TextStyle
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import { RootStackParamList } from '../navigators/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// Custom theme with beautiful color palette
const theme = {
  colors: {
    primary: '#2E86AB',        // Vibrant Purple
    secondary: '#00CEC9',      // Turquoise
    accent: '#FD79A8',         // Pink
    background: '#FFFFFF',     // Pure White
    card: '#F9F9FF',           // Light Lavender
    textPrimary: '#2D3436',    // Dark Grey
    textSecondary: '#636E72',  // Medium Grey
    border: '#E6E6F0',         // Soft Lavender border
    location: '#dfe6e9',       // Light Blue Grey
    success: '#00B894',        // Green
    gradient: ['#2E86AB', '#8E5CE7'] // Purple gradient
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },
  typography: {
    h1: {
      fontSize: 28,
      fontWeight: '700',
      fontFamily: 'Poppins-Bold',
      color: '#2D3436'
    },
    h2: {
      fontSize: 22,
      fontWeight: '600',
      fontFamily: 'Poppins-SemiBold',
      color: '#2D3436'
    },
    body: {
      fontSize: 16,
      fontFamily: 'Poppins-Regular',
      color: '#636E72'
    },
    caption: {
      fontSize: 14,
      fontFamily: 'Poppins-Regular',
      color: '#636E72'
    },
    small: {
      fontSize: 12,
      fontFamily: 'Poppins-Regular',
      color: '#636E72'
    }
  },
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    circle: 9999
  }
};

// Add type for RantCard props
type RantCardProps = {
  text: string;
  city: string;
  upvotes: number;
  timeAgo: string;
  imageUrl: string;
  onUpvote: () => void;
};

// Modified RantCard component with enhanced design
const RantCard = ({ text, city, upvotes, timeAgo, imageUrl, onUpvote }: RantCardProps) => {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const scaleAnim = useState(new Animated.Value(1))[0];

  const handleUpvote = () => {
    if (!isUpvoted) {
      setIsUpvoted(true);
      onUpvote();
      
      // Animation effect
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  return (
    <View style={rantStyles.cardContainer}>
      <View style={rantStyles.cardHeader}>
        <View style={rantStyles.locationContainer}>
          <Text style={rantStyles.locationIcon}>📍</Text>
          <Text style={rantStyles.cityText}>{city}</Text>
          <Text style={rantStyles.timeText}>{timeAgo}</Text>
        </View>
      </View>
      
      <Text style={rantStyles.rantText}>{text}</Text>
      
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={rantStyles.rantImage}
          resizeMode="cover"
        />
      )}
      
      <View style={rantStyles.cardFooter}>
        <TouchableOpacity 
          onPress={handleUpvote}
          activeOpacity={0.7}
          style={rantStyles.upvoteButton}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Text style={[
              rantStyles.upvoteIcon, 
              isUpvoted && rantStyles.upvotedIcon
            ]}>▲</Text>
          </Animated.View>
          <Text style={[
            rantStyles.upvoteCount, 
            isUpvoted && rantStyles.upvotedCount
          ]}>{upvotes}</Text>
          <Text style={rantStyles.upvoteLabel}>upvotes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={rantStyles.commentButton} activeOpacity={0.7}>
          <Text style={rantStyles.commentIcon}>💬</Text>
          <Text style={rantStyles.commentText}>Comment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const rantStyles = StyleSheet.create({
  cardContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: 14,
    height: 14,
    marginRight: theme.spacing.xs,
    tintColor: theme.colors.primary,
  } as ImageStyle,
  cityText: {
    ...theme.typography.small,
    fontWeight: '600',
    marginRight: theme.spacing.xs,
  },
  timeText: {
    ...theme.typography.small,
    color: theme.colors.textSecondary,
    opacity: 0.7,
  },
  rantText: {
    ...theme.typography.body,
    marginBottom: theme.spacing.md,
    lineHeight: 22,
  },
  rantImage: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  upvoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  upvoteIcon: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginRight: 4,
  },
  upvotedIcon: {
    color: theme.colors.primary,
  },
  upvoteCount: {
    ...theme.typography.body,
    fontWeight: '600',
    marginRight: 4,
  },
  upvotedCount: {
    color: theme.colors.primary,
  },
  upvoteLabel: {
    ...theme.typography.small,
    color: theme.colors.textSecondary,
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.xs,
  },
  commentIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  commentText: {
    ...theme.typography.small,
    color: theme.colors.textSecondary,
  },
});

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
    StatusBar.setBarStyle('dark-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }
  }, []);

  const handleUpvote = (rantId: string) => {
    setRants(prevRants =>
      prevRants.map(rant =>
        rant.id === rantId ? { ...rant, upvotes: rant.upvotes + 1 } : rant
      )
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image 
            source={require('../assets/logo-ss.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <TouchableOpacity style={styles.locationContainer} onPress={getCurrentLocation}>
            <Text style={styles.locationIcon}>📍</Text>
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
              onPress={() => setSortBy('recent')}
            >
              <Text style={[styles.sortTabText, sortBy === 'recent' && styles.activeTabText]}>
                Recent
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.sortTab, sortBy === 'trending' && styles.activeTab]}
              onPress={() => setSortBy('trending')}
            >
              <Text style={[styles.sortTabText, sortBy === 'trending' && styles.activeTabText]}>
                Trending
              </Text>
            </TouchableOpacity>
          </View>
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
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fabContainer}
        onPress={() => navigation.navigate('PostRant')}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={theme.colors.gradient}
          style={styles.fab}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.fabIcon}>+</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 20 : 30,
    paddingBottom: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: '#2E86AB',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
    height: 60,
  },
  logo: {
    width: 150,
    height: 150,
    marginLeft: -theme.spacing.xs,
    resizeMode: 'contain',
    borderRadius: 125, // Half of width/height
    overflow: 'hidden',
  } as ImageStyle,
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.location,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
  },
  locationIcon: {
    marginRight: theme.spacing.xs,
    fontSize: 16,
  } as TextStyle,
  locationText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    maxWidth: 120,
  },
  sortTabsContainer: {
    alignItems: 'center',
  },
  sortTabs: {
    flexDirection: 'row',
    backgroundColor: theme.colors.location,
    borderRadius: theme.borderRadius.lg,
    padding: 4,
    width: '70%',
  },
  sortTab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
  },
  sortTabText: {
    ...theme.typography.caption,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  activeTabText: {
    color: theme.colors.background,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: 100, // Make room for FAB
  },
  fabContainer: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: theme.spacing.xl,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
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
  },
  fabIcon: {
    color: theme.colors.background,
    fontSize: 32,
    fontWeight: '300',
    marginBottom: 2,
  },
});

export default HomeScreen;
