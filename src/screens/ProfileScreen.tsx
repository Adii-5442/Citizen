import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../utils/theme';

const ProfileScreen = () => {
  // Dummy stats - in a real app, these would come from local storage
  const stats = {
    postsMade: 12,
    upvotesReceived: 156,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Stats</Text>
        <Text style={styles.subtitle}>Anonymous Citizen</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.postsMade}</Text>
          <Text style={styles.statLabel}>Posts Made</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.upvotesReceived}</Text>
          <Text style={styles.statLabel}>Upvotes Received</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Your identity remains completely anonymous. We only track your
          contributions to help improve your local community.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textLight,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.lg,
    marginHorizontal: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: colors.border,
    padding: spacing.lg,
    borderRadius: 12,
  },
  infoText: {
    ...typography.body,
    color: colors.textLight,
    textAlign: 'center',
  },
});

export default ProfileScreen; 