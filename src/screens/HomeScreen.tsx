import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  StatusBar,
  FlatList,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import RantCard from '../components/RantCard';
import LinearGradient from 'react-native-linear-gradient';
import theme, { colors } from '../utils/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigators/AppNavigator';

const DUMMY_RANTS = [
  {
    id: '1',
    user: {
      name: 'Maria Garcia',
      avatarUrl: 'https://randomuser.me/api/portraits/women/31.jpg',
    },
    text: 'The potholes on Main Street are getting worse every day! The city needs to address this issue before someone gets hurt or damages their vehicle.',
    url: 'https://assets.dnainfo.com/generated/photo/2014/09/3-1411740404.jpg/extralarge.jpg',
    city: 'New York',
    upvotes: 152,
    commentCount: 12,
    timeAgo: '2h ago',
  },
  {
    id: '2',
    user: {
      name: 'David Smith',
      avatarUrl: 'https://randomuser.me/api/portraits/men/45.jpg',
    },
    text: 'Why is the recycling collection always late in our neighborhood? This is the third week in a row that pickup has been delayed by at least a day.',
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_Necw8YXxy8MjohW8Ayr3cl3r3yxvbhZAIivUbgcVTR7HVjuoLtk9Dj7aVEbwMQSD63o&usqp=CAU',
    city: 'Los Angeles',
    upvotes: 89,
    commentCount: 7,
    timeAgo: '5h ago',
  },
  {
    id: '3',
    user: {
      name: 'Chen Wang',
      avatarUrl: 'https://randomuser.me/api/portraits/men/75.jpg',
    },
    text: 'The new park beautification project has been abandoned halfway through. Now we have half a nice park and half an eyesore!',
    url: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGFya3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    city: 'Chicago',
    upvotes: 231,
    commentCount: 28,
    timeAgo: '1d ago',
  },
];

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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
      return 0;
    } else {
      return b.upvotes - a.upvotes;
    }
  });

  // Header component
  const renderHeader = () => (
    <LinearGradient
      colors={theme.colors.gradient}
      style={styles.headerGradient}>
      <View style={styles.headerRow}>
        {/* Logo */}
        <View style={styles.logoLeft}>
          <Text style={styles.logoText}>CITIZEN</Text>
        </View>
        {/* Badge system (center) */}
        <View style={styles.badgeCenter}>
          <View style={styles.levelBadge}>
            <View style={styles.levelBadgeInner}>
              <Text style={styles.levelIcon}>⭐️</Text>
              <Text style={styles.levelText}>Level 5</Text>
            </View>
          </View>
        </View>
        {/* Location */}
        <TouchableOpacity style={styles.locationPill} onPress={getCurrentLocation}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationPillText} numberOfLines={1}>
            {locationError || currentLocation}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  // Sort tabs
  const renderSortTabs = () => (
    <View style={styles.floatingSortTabsWrapper}>
      <LinearGradient
        colors={theme.colors.gradient}
        style={styles.sortTabs}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
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
          style={[styles.sortTab, sortBy === 'trending' && styles.activeTab]}
          onPress={() => setSortBy('trending')}>
          <Text
            style={[
              styles.sortTabText,
              sortBy === 'trending' && styles.activeTabText,
            ]}>
            Trending
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      {renderHeader()}
      <FlatList
        data={sortedRants}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderSortTabs}
        renderItem={({item}) => (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('RantDetail', { rant: item })}
          >
            <RantCard
              id={item.id}
              user={item.user}
              text={item.text}
              city={item.city}
              upvotes={item.upvotes}
              commentCount={item.commentCount}
              timeAgo={item.timeAgo}
              imageUrl={item.url}
              onUpvote={() => handleUpvote(item.id)}
            />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.rantsContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 54 : StatusBar.currentHeight || 32,
    paddingBottom: 18,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  badgeCenter: {
    flex: 1,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.background,
    letterSpacing: 2,
    fontFamily: 'Poppins-Bold',
    textShadowColor: 'rgba(0,0,0,0.08)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    maxWidth: 140,
  },
  locationIcon: {
    fontSize: 15,
    marginRight: 4,
  },
  locationPillText: {
    ...theme.typography.caption,
    color: theme.colors.background,
    fontWeight: '600',
    flex: 1,
  },
  floatingSortTabsWrapper: {
    alignItems: 'center',
    marginTop:-10,
    backgroundColor: 'transparent',
    marginBottom: 5,
  },
  sortTabs: {
    flexDirection: 'row',
    borderRadius: 30,
    padding: 4,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
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
    paddingBottom: 120,
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
  levelBadge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    padding: 4,
    paddingHorizontal:10,
    borderWidth:1,
    borderColor:colors.background
  },
  levelBadgeInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelIcon: {
    fontSize: 15,
    marginRight: 4,
  },
  levelText: {
    ...theme.typography.caption,
    fontWeight: '400',
    fontSize:12,
    color: theme.colors.background,
  },
});

export default HomeScreen;
