import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Share,
  Alert,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {RantCardProps} from '../types/index';
import theme, {colors, spacing, typography} from '../utils/theme';

const {width: screenWidth} = Dimensions.get('window');

const RantCard = ({
  id,
  user,
  title,
  text,
  city,
  upvotes,
  commentCount,
  timeAgo,
  imageUrl,
  onUpvote,
  onCommentPress,
}: RantCardProps) => {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const scaleAnim = useState(new Animated.Value(1))[0];

  const handleUpvote = () => {
    // Animate and call onUpvote only if not already upvoted
    if (!isUpvoted) {
      setIsUpvoted(true);
      onUpvote(id);
      Animated.spring(scaleAnim, {
        toValue: 1.15,
        friction: 2,
        useNativeDriver: true,
      }).start(() => {
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 2,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const handleCommentPress = () => {
    if (onCommentPress) {
      onCommentPress();
    }
  };

  const handleSharePress = async () => {
    try {
      const shareContent = {
        title: title || 'Check out this rant',
        message: `${title}\n\n${text}\n\nShared via Citizen`,
        url: `citizen://rant/${id}`, // Deep link to the rant
      };
      
      await Share.share(shareContent, {
        dialogTitle: 'Share this rant',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleMorePress = () => {
    setShowReportPopup(!showReportPopup);
  };

  const handleReportPress = () => {
    setShowReportPopup(false);
    Alert.alert(
      'Report Rant',
      'Are you sure you want to report this rant?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Report',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Reported', 'Thank you for your report. We will review it shortly.');
          },
        },
      ]
    );
  };

  const handleOutsidePress = () => {
    setShowReportPopup(false);
  };

  return (
    <View style={styles.cardContainer}>
      {/* Report Popup Overlay */}
      {showReportPopup && (
        <TouchableOpacity 
          style={styles.popupOverlay} 
          activeOpacity={1} 
          onPress={handleOutsidePress}
        />
      )}

      {/* Card Header */}
      <View style={styles.cardHeader}>
        <Image source={{uri: user.avatarUrl}} style={styles.avatar} />
        <View style={styles.headerText}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.cityText}>{city}</Text>
        </View>
        <View style={styles.moreButtonContainer}>
          <TouchableOpacity onPress={handleMorePress} style={styles.moreButton}>
            <MaterialIcons name="more-horiz" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          
          {/* Report Popup */}
          {showReportPopup && (
            <View style={styles.reportPopup}>
              <TouchableOpacity 
                style={styles.reportOption} 
                onPress={handleReportPress}
                activeOpacity={0.7}
              >
                <MaterialIcons name="report" size={16} color={colors.error} />
                <Text style={styles.reportText}>Report</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Image */}
      {imageUrl && (
        <Image source={{uri: imageUrl}} style={styles.rantImage} />
      )}

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <Animated.View style={{transform: [{scale: scaleAnim}]}}>
          <TouchableOpacity onPress={handleUpvote} style={styles.actionButton}>
            <MaterialIcons
              name={isUpvoted ? 'thumb-up' : 'thumb-up-off-alt'}
              size={24}
              color={isUpvoted ? colors.primary : colors.textSecondary}
            />
          </TouchableOpacity>
        </Animated.View>
        <TouchableOpacity onPress={handleCommentPress} style={styles.actionButton}>
          <MaterialIcons
            name="chat-bubble-outline"
            size={24}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSharePress} style={[styles.actionButton, styles.lastActionButton]}>
          <MaterialIcons name="share" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.upvoteText}>{upvotes} upvotes</Text>
        {title && <Text style={styles.rantTitle}>{title}</Text>}
        <Text style={styles.rantText} numberOfLines={2}>
          <Text style={styles.userName}>{user.name}</Text>
          {'  '}
          {text}
        </Text>
        <TouchableOpacity onPress={handleCommentPress}>
          <Text style={styles.commentText}>
            See all {commentCount} comments
          </Text>
        </TouchableOpacity>
        <Text style={styles.timeText}>{timeAgo}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.card,
    borderRadius: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerText: {
    flex: 1,
  },
  userName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  cityText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  moreButtonContainer: {
    position: 'relative',
  },
  moreButton: {
    padding: spacing.xs,
  },
  reportPopup: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: colors.card,
    borderRadius: spacing.sm,
    padding: spacing.xs,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
    minWidth: 100,
  },
  reportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  reportText: {
    ...typography.caption,
    color: colors.error,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  rantImage: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  actionButton: {
    padding: spacing.sm,
  },
  lastActionButton: {
    marginLeft: 'auto',
  },
  contentContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  upvoteText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  rantText: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: spacing.xs,
  },
  commentText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  timeText: {
    ...typography.small,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  rantTitle: {
    ...typography.h2,
    fontSize: 18,
    color: colors.primary,
    marginBottom: 2,
    fontWeight: '700',
  },
});

export default RantCard;
