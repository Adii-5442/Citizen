import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {colors, typography} from '../utils/theme';

const ActivityScreen = () => {
  const [activeTab, setActiveTab] = useState('all');

  const renderActivityItem = (
    icon: string,
    title: string,
    time: string,
    type: 'upvote' | 'comment' | 'follow' | 'mention',
  ) => {
    const getIconColor = () => {
      switch (type) {
        case 'upvote':
          return colors.upvote;
        case 'comment':
          return colors.primary;
        case 'follow':
          return colors.success;
        case 'mention':
          return colors.warning;
        default:
          return colors.primary;
      }
    };

    return (
      <View style={styles.activityItem}>
        <View style={[styles.iconContainer, {backgroundColor: getIconColor()}]}>
          <MaterialIcons name={icon} size={24} color={colors.background} />
        </View>
        <View style={styles.activityContent}>
          <Text style={styles.activityTitle}>{title}</Text>
          <Text style={styles.activityTime}>{time}</Text>
        </View>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="chevron-right" size={24} color={colors.textLight} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity</Text>
        <TouchableOpacity style={styles.filterButton}>
          <MaterialIcons name="filter-list" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'all' && styles.activeTabText,
            ]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'mentions' && styles.activeTab]}
          onPress={() => setActiveTab('mentions')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'mentions' && styles.activeTabText,
            ]}>
            Mentions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'follows' && styles.activeTab]}
          onPress={() => setActiveTab('follows')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'follows' && styles.activeTabText,
            ]}>
            Follows
          </Text>
        </TouchableOpacity>
      </View>

      {/* Activity List */}
      <ScrollView style={styles.activityList} showsVerticalScrollIndicator={false}>
        <View style={styles.dateSection}>
          <Text style={styles.dateHeader}>Today</Text>
          {renderActivityItem(
            'thumb-up',
            'Sarah upvoted your rant about local traffic',
            '2 hours ago',
            'upvote',
          )}
          {renderActivityItem(
            'comment',
            'Mike commented on your post about park maintenance',
            '3 hours ago',
            'comment',
          )}
        </View>

        <View style={styles.dateSection}>
          <Text style={styles.dateHeader}>Yesterday</Text>
          {renderActivityItem(
            'person-add',
            'John started following you',
            '1 day ago',
            'follow',
          )}
          {renderActivityItem(
            'alternate-email',
            'Emma mentioned you in a comment',
            '1 day ago',
            'mention',
          )}
          {renderActivityItem(
            'thumb-up',
            'Your rant about recycling got 15 upvotes',
            '1 day ago',
            'upvote',
          )}
        </View>

        <View style={styles.dateSection}>
          <Text style={styles.dateHeader}>This Week</Text>
          {renderActivityItem(
            'trending-up',
            'Your rant about public transport is trending',
            '3 days ago',
            'upvote',
          )}
          {renderActivityItem(
            'comment',
            'David replied to your comment about street lighting',
            '4 days ago',
            'comment',
          )}
        </View>
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 16,
    backgroundColor: colors.background,
  },
  headerTitle: {
    ...typography.h1,
    fontSize: 24,
  },
  filterButton: {
    padding: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: colors.border,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    ...typography.body,
    color: colors.textLight,
  },
  activeTabText: {
    color: colors.background,
    fontWeight: '600' as const,
  },
  activityList: {
    flex: 1,
  },
  dateSection: {
    padding: 16,
  },
  dateHeader: {
    ...typography.h2,
    marginBottom: 16,
    color: colors.textLight,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    ...typography.body,
    marginBottom: 4,
  },
  activityTime: {
    ...typography.caption,
    color: colors.textLight,
  },
  actionButton: {
    padding: 8,
  },
});

export default ActivityScreen; 