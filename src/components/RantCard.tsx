import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, spacing, typography, shadows } from '../utils/theme';

interface RantCardProps {
  text: string;
  city: string;
  upvotes: number;
  timeAgo: string;
  imageUrl: string;
  onUpvote: () => void;
}

const RantCard: React.FC<RantCardProps> = ({
  text,
  city,
  upvotes,
  timeAgo,
  imageUrl,
  onUpvote,
}) => {
  return (
    <View style={[styles.container, shadows.small]}>
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <Text style={styles.text}>{text}</Text>
      <View style={styles.footer}>
        <View style={styles.locationContainer}>
          <Text style={styles.city}>{city}</Text>
          <Text style={styles.timeAgo}>{timeAgo}</Text>
        </View>
        <TouchableOpacity style={styles.upvoteButton} onPress={onUpvote}>
          <Text style={styles.upvoteText}>▲ {upvotes}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    marginHorizontal: spacing.md,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  text: {
    ...typography.body,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  city: {
    ...typography.caption,
    marginRight: spacing.sm,
  },
  timeAgo: {
    ...typography.caption,
    color: colors.textLight,
  },
  upvoteButton: {
    backgroundColor: colors.upvote,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  upvoteText: {
    color: colors.background,
    fontWeight: 'bold',
  },
});

export default RantCard; 