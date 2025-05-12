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
    <View style={styles.container}>
      {/* Newspaper Header */}
      <View style={styles.header}>
        <Text style={styles.newspaperTitle}>THE DAILY RANT</Text>
        <View style={styles.headerInfo}>
          <Text style={styles.headerText}>VOL. XCIII NO. 311</Text>
          <Text style={styles.headerText}>{timeAgo.toUpperCase()}</Text>
          <Text style={styles.headerText}>FIVE CENTS</Text>
        </View>
      </View>

      {/* Article Content */}
      <View style={styles.content}>
        {/* Location and Time */}
        <View style={styles.metaInfo}>
          <View style={styles.locationContainer}>
            <MaterialIcons name="location-on" size={14} color={colors.text} />
            <Text style={styles.locationText}>{city}</Text>
          </View>
          <View style={styles.timeContainer}>
            <MaterialIcons name="access-time" size={14} color={colors.text} />
            <Text style={styles.timeText}>{timeAgo}</Text>
          </View>
        </View>

        {/* Headline */}
        <Text style={styles.headline} numberOfLines={2}>
          {text.split(' ').slice(0, 8).join(' ')}...
        </Text>

        {/* Article Text */}
        <View style={styles.articleContainer}>
          <View style={styles.column}>
            <Text style={styles.articleText}>
              {text}
            </Text>
          </View>

          {/* Image Section */}
          {imageUrl && (
            <View style={styles.imageSection}>
              <View style={styles.imageContainer}>
                <Image
                  source={{uri: imageUrl}}
                  style={styles.articleImage}
                  resizeMode="cover"
                />
                <Text style={styles.imageCaption}>
                  {city} - Local residents share their concerns
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleUpvote}
            style={styles.upvoteButton}>
            <Animated.View style={{transform: [{scale: scaleAnim}]}}>
              <MaterialIcons
                name="arrow-upward"
                size={20}
                color={isUpvoted ? colors.primary : colors.text}
              />
            </Animated.View>
            <Text style={[styles.upvoteText, isUpvoted && styles.upvotedText]}>
              {upvotes} Upvotes
            </Text>
          </TouchableOpacity>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="chat-bubble-outline" size={20} color={colors.text} />
              <Text style={styles.actionText}>Comments</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="share" size={20} color={colors.text} />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginHorizontal: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    width: Dimensions.get('window').width - 20,
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    padding: spacing.md,
  },
  newspaperTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: spacing.sm,
    fontFamily: 'serif',
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: spacing.xs,
  },
  headerText: {
    fontSize: 10,
    color: colors.text,
  },
  content: {
    padding: spacing.md,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    color: colors.text,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    marginLeft: 4,
    color: colors.text,
  },
  headline: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    fontFamily: 'serif',
    color: colors.text,
  },
  articleContainer: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    marginRight: spacing.md,
  },
  articleText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
    textAlign: 'justify',
  },
  imageSection: {
    flex: 1,
  },
  imageContainer: {
    marginBottom: spacing.sm,
  },
  articleImage: {
    width: '100%',
    height: 200,
    marginBottom: spacing.xs,
  },
  imageCaption: {
    fontSize: 10,
    fontStyle: 'italic',
    color: colors.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  upvoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upvoteText: {
    fontSize: 12,
    marginLeft: 4,
    color: colors.text,
  },
  upvotedText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    marginLeft: 4,
    color: colors.text,
  },
});

export default RantCard;
