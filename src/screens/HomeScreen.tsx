import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '../utils/theme';
import RantCard from '../components/RantCard';
import { RootStackParamList } from '../navigators/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const DUMMY_RANTS = [
  {
    id: '1',
    text: 'The potholes on Main Street are getting worse every day!',
    url: 'https://assets.dnainfo.com/generated/photo/2014/09/3-1411740404.jpg/extralarge.jpg',
    city: 'New York',
    upvotes: 15,
    timeAgo: '2h ago',
  },
  {
    id: '2',
    text: 'Why is the recycling collection always late in our neighborhood?',
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_Necw8YXxy8MjohW8Ayr3cl3r3yxvbhZAIivUbgcVTR7HVjuoLtk9Dj7aVEbwMQSD63o&usqp=CAU',
    city: 'Los Angeles',
    upvotes: 8,
    timeAgo: '5h ago',
  },
];

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
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
      return 0;
    } else {
      return b.upvotes - a.upvotes;
    }
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Local Rants</Text>

        {/* Sort Tabs */}
        <View style={styles.sortContainer}>
          {['recent', 'trending'].map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.sortButton,
                sortBy === option && styles.activeSortButton,
              ]}
              onPress={() => setSortBy(option as 'recent' | 'trending')}
            >
              <Text style={[
                styles.sortText,
                sortBy === option && styles.activeSortText,
              ]}>
                {option === 'recent' ? 'Recent' : 'Trending'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Rants List */}
      <FlatList
        data={sortedRants}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <RantCard
            text={item.text}
            city={item.city}
            upvotes={item.upvotes}
            timeAgo={item.timeAgo}
            imageUrl={item.url}
            onUpvote={() => handleUpvote(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('PostRant')}
      >
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
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 10,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.sm,
  },
  sortContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: colors.border,
    borderRadius: 24,
    padding: spacing.xs,
  },
  sortButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
    borderRadius: 24,
  },
  activeSortButton: {
    backgroundColor: colors.primary,
  },
  sortText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600' as const,
  },
  activeSortText: {
    color: colors.background,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: 100, // so FAB doesn't block last rant
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    color: colors.background,
    fontSize: 24,
    fontWeight: 'bold' as const,
  },
});

export default HomeScreen;
