import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import {RantCardProps} from '../types/index';
import theme, {colors, spacing, typography} from '../utils/theme';

const {width} = Dimensions.get('window');

const RantCard = ({
  id,
  text,
  city,
  upvotes,
  timeAgo,
  imageUrl,
  onUpvote,
}: RantCardProps) => {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const scaleAnim = useState(new Animated.Value(1))[0];

  const handleUpvote = () => {
    if (!isUpvoted) {
      setIsUpvoted(true);
      onUpvote(id);

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
      {imageUrl && (
        <Image
          source={{uri: imageUrl}}
          style={rantStyles.rantImage}
          resizeMode="cover"
        />
      )}

      <View style={rantStyles.contentContainer}>
        <View style={rantStyles.cardHeader}>
          <View style={rantStyles.locationContainer}>
            <Text style={rantStyles.locationIcon}>📍</Text>
            <Text style={rantStyles.cityText}>{city}</Text>
            <View style={rantStyles.dotSeparator} />
            <Text style={rantStyles.timeText}>{timeAgo}</Text>
          </View>
        </View>

        <Text style={rantStyles.rantText} numberOfLines={3}>
          {text}
        </Text>

      <View style={rantStyles.cardFooter}>
        <TouchableOpacity
          onPress={handleUpvote}
          activeOpacity={0.7}
            style={[
              rantStyles.actionButton,
              isUpvoted && rantStyles.upvotedButton,
            ]}>
          <Animated.View style={{transform: [{scale: scaleAnim}]}}>
            <Text
              style={[
                rantStyles.upvoteIcon,
                isUpvoted && rantStyles.upvotedIcon,
              ]}>
              ▲
            </Text>
          </Animated.View>
          <Text
            style={[
              rantStyles.upvoteCount,
              isUpvoted && rantStyles.upvotedCount,
            ]}>
            {upvotes}
          </Text>
        </TouchableOpacity>

          <TouchableOpacity style={rantStyles.actionButton} activeOpacity={0.7}>
          <Text style={rantStyles.commentIcon}>💬</Text>
          <Text style={rantStyles.commentText}>Comment</Text>
        </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const rantStyles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: spacing.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contentContainer: {
    padding: spacing.md,
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
    fontSize: 14,
    marginRight: spacing.xs,
  },
  cityText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textSecondary,
    marginHorizontal: spacing.xs,
    opacity: 0.5,
  },
  timeText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  rantText: {
    ...typography.body,
    lineHeight: 22,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  rantImage: {
    width: '100%',
    height: 220,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    marginRight: spacing.sm,
  },
  upvotedButton: {
    backgroundColor: colors.primary + '20',
  },
  upvoteIcon: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 4,
  },
  upvotedIcon: {
    color: colors.primary,
  },
  upvoteCount: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  upvotedCount: {
    color: colors.primary,
  },
  commentIcon: {
    fontSize: 14,
    marginRight: 4,
    color: colors.textSecondary,
  },
  commentText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});

export default RantCard;
