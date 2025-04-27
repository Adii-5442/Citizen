import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing, typography } from '../utils/theme';

const PetitionGeneratedScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    // In a real app, this would trigger the email generation
    console.log('Petition generated for rant:', route.params?.rantId);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.title}>Congratulations!</Text>
        <Text style={styles.message}>
          Your rant has received 25+ upvotes! We've automatically generated and
          sent a formal complaint to your local authority.
        </Text>
        <Text style={styles.subMessage}>
          This helps bring attention to important local issues and encourages
          action from those who can make a difference.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 24,
  },
  subMessage: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.textLight,
    lineHeight: 20,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PetitionGeneratedScreen; 