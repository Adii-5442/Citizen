import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '../utils/theme';

const PostRantScreen = () => {
  const navigation = useNavigation();
  const [rantText, setRantText] = useState('');
  const [city, setCity] = useState('New York'); // Default city, in real app would get from location

  const handleSubmit = () => {
    if (rantText.trim()) {
      // In a real app, save the rant to local storage
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <Text style={styles.title}>What's bothering you?</Text>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Type your rant here..."
          value={rantText}
          onChangeText={setRantText}
          textAlignVertical="top"
        />
        <View style={styles.locationContainer}>
          <Text style={styles.locationLabel}>Location:</Text>
          <Text style={styles.locationText}>{city}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: rantText.trim() ? colors.success : colors.border },
          ]}
          onPress={handleSubmit}>
          <Text style={styles.submitText}>Post Rant</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.lg,
  },
  input: {
    ...typography.body,
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.lg,
    minHeight: 200,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  locationLabel: {
    ...typography.body,
    marginRight: spacing.sm,
  },
  locationText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: 'bold',
  },
  submitButton: {
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PostRantScreen; 