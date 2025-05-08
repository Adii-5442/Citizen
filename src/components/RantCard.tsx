import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { RantCardProps } from '../types';
import { colors, spacing, typography } from '../utils/theme';

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
    backgroundColor: colors.background,
    borderRadius: 16,
    marginBottom: spacing.md,
    padding: spacing.md,
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
    marginBottom: spacing.sm,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: 14,
    height: 14,
    marginRight: spacing.xs,
    tintColor: colors.primary,
  },
  cityText: {
    ...typography.caption,
    fontWeight: '600',
    marginRight: spacing.xs,
  },
  timeText: {
    ...typography.caption,
    color: colors.textLight,
    opacity: 0.7,
  },
  rantText: {
    ...typography.body,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  rantImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  upvoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  upvoteIcon: {
    fontSize: 16,
    color: colors.textLight,
    marginRight: 4,
  },
  upvotedIcon: {
    color: colors.primary,
  },
  upvoteCount: {
    ...typography.body,
    fontWeight: '600',
    marginRight: 4,
  },
  upvotedCount: {
    color: colors.primary,
  },
  upvoteLabel: {
    ...typography.caption,
    color: colors.textLight,
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xs,
  },
  commentIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  commentText: {
    ...typography.caption,
    color: colors.textLight,
  },
});

export default RantCard; 