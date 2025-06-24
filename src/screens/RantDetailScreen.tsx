import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {colors, spacing, typography} from '../utils/theme';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigators/AppNavigator';

// Mock comment data
const COMMENTS = [
  {
    id: 'c1',
    user: { name: 'Priya Sharma', avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg' },
    text: 'Absolutely agree! This needs to be fixed ASAP.',
    timeAgo: '1h ago',
  },
  {
    id: 'c2',
    user: { name: 'Alex Kim', avatarUrl: 'https://randomuser.me/api/portraits/men/23.jpg' },
    text: 'I almost tripped here last week. Thanks for posting!',
    timeAgo: '2h ago',
  },
];

type RantDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'RantDetail'>;
const RantDetailScreen = ({ route, navigation }: RantDetailScreenProps) => {
  const commentInputRef = useRef<TextInput>(null);
  
  // For now, use mock data. In real use, get rant from route.params
  const rant = route?.params?.rant || {
    id: '1',
    user: { name: 'Maria Garcia', avatarUrl: 'https://randomuser.me/api/portraits/women/31.jpg' },
    text: 'The potholes on Main Street are getting worse every day! The city needs to address this issue before someone gets hurt or damages their vehicle.',
    imageUrl: 'https://assets.dnainfo.com/generated/photo/2014/09/3-1411740404.jpg/extralarge.jpg',
    city: 'New York',
    upvotes: 152,
    commentCount: 12,
    timeAgo: '2h ago',
  };

  // Focus on comment input when screen loads (useful when coming from comment icon tap)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (commentInputRef.current) {
        commentInputRef.current.focus();
      }
    }, 500); // Small delay to ensure screen is fully loaded

    return () => clearTimeout(timer);
  }, []);

  const renderRantDetails = () => (
    <View style={styles.scrollContent}>
      {/* Image */}
      {rant.imageUrl && (
        <Image source={{uri: rant.imageUrl}} style={styles.rantImage} />
      )}
      {/* User Info */}
      <View style={styles.userRow}>
        <Image source={{uri: rant.user.avatarUrl}} style={styles.avatar} />
        <View style={{flex: 1}}>
          <Text style={styles.userName}>{rant.user.name}</Text>
          <Text style={styles.cityText}>{rant.city} • {rant.timeAgo}</Text>
        </View>
        <View style={styles.upvoteBox}>
          <MaterialIcons name="thumb-up" size={18} color={colors.primary} />
          <Text style={styles.upvoteCount}>{rant.upvotes}</Text>
        </View>
      </View>
      {/* Rant Text */}
      <Text style={styles.rantText}>{rant.text}</Text>
      {/* Divider */}
      <View style={styles.divider} />
      {/* Comments */}
      <Text style={styles.commentsTitle}>Comments</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">{rant.title || 'Rant Details'}</Text>
        <View style={{width: 28}} />
      </View>
      <FlatList
        data={COMMENTS}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderRantDetails}
        renderItem={({item}) => (
          <View style={styles.commentRow}>
            <Image source={{uri: item.user.avatarUrl}} style={styles.commentAvatar} />
            <View style={styles.commentContent}>
              <Text style={styles.commentUser}>{item.user.name}</Text>
              <Text style={styles.commentText}>{item.text}</Text>
              <Text style={styles.commentTime}>{item.timeAgo}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{paddingBottom: 80}}
        showsVerticalScrollIndicator={false}
      />
      {/* Comment Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
        style={styles.inputBarContainer}
      >
        <View style={styles.inputBar}>
          <TextInput
            ref={commentInputRef}
            style={styles.input}
            placeholder="Add a comment..."
            placeholderTextColor={colors.textSecondary}
          />
          <TouchableOpacity>
            <MaterialIcons name="send" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 54 : StatusBar.currentHeight || 32,
    paddingBottom: 12,
    paddingHorizontal: 18,
    backgroundColor: colors.background,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '600' as '600',
    color: colors.textPrimary,
    letterSpacing: 0.1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 0,
  },
  rantImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: spacing.md,
    marginBottom: spacing.md,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
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
  upvoteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  upvoteCount: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
    marginLeft: 4,
  },
  rantText: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    fontSize: 17,
    lineHeight: 26,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
    borderRadius: 1,
  },
  commentsTitle: {
    ...typography.h2,
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    fontWeight: '700' as '700',
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  commentContent: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  commentUser: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  commentText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  commentTime: {
    ...typography.small,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  inputBarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    marginBottom: 16,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
});

export default RantDetailScreen; 