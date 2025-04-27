import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '../utils/theme';
import RantCard from '../components/RantCard';

// Dummy data for testing
const DUMMY_RANTS = [
  {
    id: '1',
    text: 'The potholes on Main Street are getting worse every day!',
    city: 'New York',
    upvotes: 15,
    timeAgo: '2h ago',
  },
  {
    id: '2',
    text: 'Why is the recycling collection always late in our neighborhood?',
    city: 'Los Angeles',
    upvotes: 8,
    timeAgo: '5h ago',
  },
  // Add more dummy data as needed
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const [sortBy, setSortBy] = useState<'recent' | 'trending'>('recent');
  const [rants, setRants] = useState(DUMMY_RANTS);

  const handleUpvote = (rantId: string) => {
    setRants(prevRants =>
      prevRants.map(rant =>
        rant.id === rantId ? { ...rant, upvotes: rant.upvotes + 1 } : rant
      )
    );
  };

  const sortedRants = [...rants].sort((a, b) => {
    if (sortBy === 'recent') {
      return 0; // In a real app, sort by timestamp
    } else {
      return b.upvotes - a.upvotes;
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Local Rants</Text>
        <View style={styles.sortContainer}>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'recent' && styles.activeSort]}
            onPress={() => setSortBy('recent')}>
            <Text style={styles.sortText}>Recent</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'trending' && styles.activeSort]}
            onPress={() => setSortBy('trending')}>
            <Text style={styles.sortText}>Trending</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={sortedRants}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <RantCard
            text={item.text}
            city={item.city}
            upvotes={item.upvotes}
            timeAgo={item.timeAgo}
            onUpvote={() => handleUpvote(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('PostRant')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.md,
  },
  sortContainer: {
    flexDirection: 'row',
  },
  sortButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginRight: spacing.sm,
    borderRadius: 16,
    backgroundColor: colors.border,
  },
  activeSort: {
    backgroundColor: colors.primary,
  },
  sortText: {
    color: colors.text,
    fontWeight: 'bold',
  },
  listContent: {
    paddingVertical: spacing.md,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    fontSize: 24,
    color: colors.background,
    fontWeight: 'bold',
  },
});

export default HomeScreen; 