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
import {RantCardProps} from '../types';
import {colors, spacing, typography} from '../utils/theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');

const RantCard = ({
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
      onUpvote();

      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
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
    <View style={rantStyles.container}>
      {/* Left Side - Upvote Section */}
      <View style={rantStyles.upvoteSection}>
        <TouchableOpacity
          onPress={handleUpvote}
          activeOpacity={0.7}
          style={rantStyles.upvoteButton}>
          <Animated.View style={{transform: [{scale: scaleAnim}]}}>
            <MaterialIcons
              name={isUpvoted ? 'arrow-upward' : 'arrow-upward'}
              size={24}
              color={isUpvoted ? colors.primary : colors.textLight}
            />
          </Animated.View>
          <Text
            style={[
              rantStyles.upvoteCount,
              isUpvoted && rantStyles.upvotedCount,
            ]}>
            {upvotes}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Right Side - Content Section */}
      <View style={rantStyles.contentSection}>
        {/* Header */}
        <View style={rantStyles.header}>
          <View style={rantStyles.locationContainer}>
            <MaterialIcons name="location-on" size={16} color={colors.primary} />
            <Text style={rantStyles.cityText}>{city}</Text>
          </View>
          <View style={rantStyles.timeContainer}>
            <MaterialIcons name="access-time" size={14} color={colors.textLight} />
            <Text style={rantStyles.timeText}>{timeAgo}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={rantStyles.content}>
          <Text style={rantStyles.rantText} numberOfLines={3}>
            {text}
          </Text>
          {imageUrl && (
            <View style={rantStyles.imageWrapper}>
              <Image
                source={{uri: imageUrl}}
                style={rantStyles.rantImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.3)']}
                style={rantStyles.imageGradient}
              />
            </View>
          )}
        </View>

        {/* Footer Actions */}
        <View style={rantStyles.footer}>
          <TouchableOpacity style={rantStyles.actionButton}>
            <MaterialIcons name="chat-bubble-outline" size={20} color={colors.textLight} />
            <Text style={rantStyles.actionText}>Comment</Text>
          </TouchableOpacity>

          <TouchableOpacity style={rantStyles.actionButton}>
            <MaterialIcons name="share" size={20} color={colors.textLight} />
            <Text style={rantStyles.actionText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity style={rantStyles.moreButton}>
            <MaterialIcons name="more-horiz" size={24} color={colors.textLight} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const rantStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: spacing.md,
  },
  upvoteSection: {
    width: 60,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  upvoteButton: {
    alignItems: 'center',
  },
  upvoteCount: {
    ...typography.body,
    fontWeight: '600',
    marginTop: spacing.xs,
    color: colors.text,
  },
  upvotedCount: {
    color: colors.primary,
  },
  contentSection: {
    flex: 1,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cityText: {
    ...typography.caption,
    fontWeight: '600',
    marginLeft: spacing.xs,
    color: colors.text,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    ...typography.caption,
    color: colors.textLight,
    marginLeft: 2,
  },
  content: {
    marginBottom: spacing.sm,
  },
  rantText: {
    ...typography.body,
    lineHeight: 22,
    color: colors.text,
    marginBottom: spacing.md,
  },
  imageWrapper: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  rantImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xs,
  },
  actionText: {
    ...typography.caption,
    color: colors.textLight,
    marginLeft: spacing.xs,
  },
  moreButton: {
    padding: spacing.xs,
  },
});

export default RantCard;
