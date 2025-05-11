import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors, typography} from '../utils/theme';

const SearchScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
});

export default SearchScreen; 