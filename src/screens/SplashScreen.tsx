import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography } from '../utils/theme';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Home');
    }, 2000);

    return () => clearTimeout(timer);
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