import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {colors, typography} from '../utils/theme';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const renderTrendingTopic = (
    title: string,
    posts: number,
    trend: 'up' | 'down',
    icon: string,
  ) => (
    <TouchableOpacity style={styles.trendingItem}>
      <View style={styles.trendingIconContainer}>
        <MaterialIcons name={icon} size={24} color={colors.primary} />
      </View>
      <View style={styles.trendingContent}>
        <Text style={styles.trendingTitle}>{title}</Text>
        <View style={styles.trendingStats}>
          <Text style={styles.trendingPosts}>{posts} posts</Text>
          <View style={styles.trendingIndicator}>
            <MaterialIcons
              name={trend === 'up' ? 'trending-up' : 'trending-down'}
              size={16}
              color={trend === 'up' ? colors.success : colors.error}
            />
            <Text
              style={[
                styles.trendingChange,
                {color: trend === 'up' ? colors.success : colors.error},
              ]}>
              {trend === 'up' ? '↑' : '↓'} Trending
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRecentSearch = (query: string, time: string) => (
    <TouchableOpacity style={styles.recentSearchItem}>
      <MaterialIcons name="history" size={24} color={colors.textLight} />
      <View style={styles.recentSearchContent}>
        <Text style={styles.recentSearchText}>{query}</Text>
        <Text style={styles.recentSearchTime}>{time}</Text>
      </View>
      <TouchableOpacity style={styles.removeButton}>
        <MaterialIcons name="close" size={20} color={colors.textLight} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={24} color={colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search rants, topics, or users"
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearching(true)}
            onBlur={() => setIsSearching(false)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}>
              <MaterialIcons name="close" size={20} color={colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!isSearching && searchQuery.length === 0 ? (
          <>
            {/* Trending Topics */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Trending Topics</Text>
              {renderTrendingTopic(
                'Local Traffic Issues',
                156,
                'up',
                'traffic',
              )}
              {renderTrendingTopic(
                'Park Maintenance',
                89,
                'up',
                'park',
              )}
              {renderTrendingTopic(
                'Public Transport',
                45,
                'down',
                'directions-bus',
              )}
            </View>

            {/* Recent Searches */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <TouchableOpacity>
                  <Text style={styles.clearAllText}>Clear All</Text>
                </TouchableOpacity>
              </View>
              {renderRecentSearch('recycling program', '2 hours ago')}
              {renderRecentSearch('street lighting', '1 day ago')}
              {renderRecentSearch('community garden', '3 days ago')}
            </View>
          </>
        ) : (
          // Search Results (placeholder)
          <View style={styles.searchResults}>
            <Text style={styles.noResultsText}>
              {searchQuery.length > 0
                ? 'No results found for "' + searchQuery + '"'
                : 'Start typing to search...'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchHeader: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    ...typography.body,
    color: colors.text,
  },
  clearButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    ...typography.h2,
    marginBottom: 16,
  },
  clearAllText: {
    ...typography.body,
    color: colors.primary,
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  trendingIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  trendingContent: {
    flex: 1,
  },
  trendingTitle: {
    ...typography.body,
    marginBottom: 4,
  },
  trendingStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendingPosts: {
    ...typography.caption,
    color: colors.textLight,
    marginRight: 8,
  },
  trendingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendingChange: {
    ...typography.caption,
    marginLeft: 4,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  recentSearchContent: {
    flex: 1,
    marginLeft: 12,
  },
  recentSearchText: {
    ...typography.body,
    marginBottom: 4,
  },
  recentSearchTime: {
    ...typography.caption,
    color: colors.textLight,
  },
  removeButton: {
    padding: 8,
  },
  searchResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  noResultsText: {
    ...typography.body,
    color: colors.textLight,
    textAlign: 'center',
  },
});

export default SearchScreen; 