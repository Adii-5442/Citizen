import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utils/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigators/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const scaleAnim = useMemo(() => new Animated.Value(0.8), []);

  useEffect(() => {
    // Animate the logo
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    const checkAuth = async () => {
      try {
        // In a real app, you'd verify a token with your backend
        const userToken = await AsyncStorage.getItem('userToken');

        // Check if onboarding has been completed
        const hasOnboarded = await AsyncStorage.getItem('hasOnboarded');

        setTimeout(() => {
          if (userToken) {
            navigation.replace('MainTabs');
          } else {
            if (hasOnboarded) {
              console.log('Login');
              navigation.replace('Login');
            } else {
              console.log('Onboarding');
              navigation.replace('Onboarding');
            }
          }
        }, 2500);
      } catch (e) {
        console.error('Failed to check auth state:', e);
        navigation.replace('Login');
      }
    };

    checkAuth();
  }, [navigation, fadeAnim, scaleAnim]);

  return (
    <LinearGradient colors={colors.gradient} style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>🏛️</Text>
          </View>
          <Text style={styles.logo}>CITIZEN</Text>
        </Animated.View>
        
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.tagline}>Voice Your Local Concerns</Text>
          <Text style={styles.subtitle}>Connect • Share • Impact</Text>
        </Animated.View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Empowering Communities</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoIcon: {
    fontSize: 40,
  },
  logo: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: colors.background,
    letterSpacing: 4,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.background,
    textAlign: 'center',
    marginBottom: 8,
    opacity: 0.9,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.background,
    textAlign: 'center',
    opacity: 0.7,
    letterSpacing: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: colors.background,
    opacity: 0.6,
    letterSpacing: 1,
  },
});

export default SplashScreen; 