import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography } from '../utils/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigators/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();

  useEffect(() => {
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
        }, 2000);
      } catch (e) {
        console.error('Failed to check auth state:', e);
        navigation.replace('Login');
      }
    };

    checkAuth();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Citizen</Text>
      <Text style={styles.tagline}>Voice Your Local Concerns</Text>
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
  logo: {
    ...typography.h1,
    fontSize: 48,
    color: colors.primary,
    marginBottom: 8,
  },
  tagline: {
    ...typography.caption,
    fontSize: 16,
    color: colors.textLight,
  },
});

export default SplashScreen; 