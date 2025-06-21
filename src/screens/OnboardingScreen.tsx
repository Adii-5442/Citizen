import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigators/AppNavigator';
import {colors, spacing, typography} from '../utils/theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const {width} = Dimensions.get('window');

interface Slide {
  key: string;
  title: string;
  description: string;
  icon: string;
  color?: string;
  iconBackgroundColor?: string;
}

const slides: Slide[] = [
  {
    key: '1',
    title: 'Voice Your Concerns',
    description: 'See a local issue? Report it anonymously. Your voice is the first step to real change.',
    icon: 'campaign',
    color: '#3B82F6', // Blue-500
    iconBackgroundColor: 'rgba(59, 130, 246, 0.15)', // Light Blue
  },
  {
    key: '2',
    title: 'Upvote & Amplify',
    description: 'Support rants you agree with. The more upvotes, the louder the message gets.',
    icon: 'trending-up',
    color: '#10B981', // Emerald-500
    iconBackgroundColor: 'rgba(16, 185, 129, 0.15)', // Light Emerald
  },
  {
    key: '3',
    title: 'Earn Reputation Points',
    description: 'Be a responsible citizen. Post, comment, and contribute to earn points and build your influence.',
    icon: 'military-tech',
    color: '#FFBF00', // Amber-Gold
    iconBackgroundColor: 'rgba(255, 191, 0, 0.15)', // Light Amber-Gold
  },
  {
    key: '4',
    title: 'Automated Escalation',
    description: 'When a rant gets enough support, we automatically send a formal complaint to local authorities.',
    icon: 'gavel',
    color: '#A91D3A', // Crimson Red
    iconBackgroundColor: 'rgba(169, 29, 58, 0.15)', // Light Crimson
  },
];

const OnboardingScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(({viewableItems}: any) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({viewAreaCoveragePercentThreshold: 50}).current;

  const handleNext = async () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({index: currentIndex + 1});
    } else {
      try {
        await AsyncStorage.setItem('hasOnboarded', 'true');
        navigation.replace('Login');
      } catch (e) {
        console.error('Failed to save onboarding state:', e);
        navigation.replace('Login');
      }
    }
  };

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem('hasOnboarded', 'true');
      navigation.replace('Login');
    } catch (e) {
      console.error('Failed to save onboarding state:', e);
      navigation.replace('Login');
    }
  };

  const renderSlide = ({item}: {item: Slide}) => (
    <View style={styles.slide}>
      <View
        style={[
          styles.iconContainer,
          item.iconBackgroundColor && {backgroundColor: item.iconBackgroundColor},
        ]}>
        <MaterialIcons
          name={item.icon}
          size={100}
          color={item.color || colors.primary}
        />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {currentIndex < slides.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      )}
      <View style={{flex: 3}}>
        <FlatList
          ref={slidesRef}
          data={slides}
          renderItem={renderSlide}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: false},
          )}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          scrollEventThrottle={32}
        />
      </View>

      <View style={styles.footer}>
        <Pagination data={slides} scrollX={scrollX} />
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          {currentIndex === slides.length - 1 ? (
            <View style={styles.getStartedContent}>
              <Text style={styles.buttonText}>Get Started</Text>
              <MaterialIcons
                name="arrow-forward"
                size={22}
                color={colors.background}
                style={{marginLeft: 8}}
              />
            </View>
          ) : (
            <Text style={styles.buttonText}>Next</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Pagination = ({
  data,
  scrollX,
}: {
  data: any[];
  scrollX: Animated.Value;
}) => {
  return (
    <View style={styles.pagination}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: 'clamp',
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View
            key={i.toString()}
            style={[styles.paginationDot, {width: dotWidth, opacity}]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  iconContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl * 2,
  },
  title: {
    ...typography.h1,
    fontSize: 28,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    flex: 1,
    justifyContent: 'space-around',
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginHorizontal: 8,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    width: width * 0.8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 18,
  },
  getStartedContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
  },
  skipButtonText: {
    ...typography.body,
    color: colors.primary,
    fontSize: 16,
  },
});

export default OnboardingScreen; 