import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
  StatusBar,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {colors, spacing, typography} from '../utils/theme';

const {width: screenWidth} = Dimensions.get('window');

const CATEGORIES = [
  {id: 'traffic', label: 'Traffic', icon: 'traffic'},
  {id: 'infrastructure', label: 'Infrastructure', icon: 'build'},
  {id: 'environment', label: 'Environment', icon: 'eco'},
  {id: 'safety', label: 'Safety', icon: 'security'},
  {id: 'noise', label: 'Noise', icon: 'volume-up'},
  {id: 'other', label: 'Other', icon: 'more-horiz'},
];

const PostRantScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('New York');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = () => {
    // TODO: Implement image picker
    Alert.alert('Image Upload', 'Image upload functionality will be implemented');
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !selectedCategory) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    // TODO: Implement rant submission
    navigation.goBack();
  };

  const isFormValid = title.trim() && description.trim() && selectedCategory;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Standard Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}>
          <MaterialIcons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Rant</Text>
        <TouchableOpacity
          style={[
            styles.submitButton,
            isFormValid && styles.submitButtonActive,
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid}>
          <Text style={[
            styles.submitText,
            isFormValid && styles.submitTextActive,
          ]}>
            Post
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          
          {/* Image Upload Section */}
          <View style={styles.imageSection}>
            <Text style={styles.sectionTitle}>Add Photos (Optional)</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imageScrollView}
              contentContainerStyle={styles.imageScrollContent}>
              {images.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{uri: image}} style={styles.uploadedImage} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => handleRemoveImage(index)}>
                    <MaterialIcons name="close" size={16} color={colors.background} />
                  </TouchableOpacity>
                </View>
              ))}
              {images.length < 5 && (
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handleImageUpload}>
                  <MaterialIcons name="add-photo-alternate" size={32} color={colors.primary} />
                  <Text style={styles.uploadText}>Add Photos</Text>
                  <Text style={styles.uploadSubtext}>({images.length}/5)</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>

          {/* Title Input */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Title *</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.titleInput}
                placeholder="What's the issue?"
                placeholderTextColor={colors.textSecondary}
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />
              <Text style={styles.characterCount}>{title.length}/100</Text>
            </View>
          </View>

          {/* Description Input */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Description *</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.descriptionInput}
                placeholder="Describe the issue in detail..."
                placeholderTextColor={colors.textSecondary}
                value={description}
                onChangeText={setDescription}
                multiline
                textAlignVertical="top"
                maxLength={500}
              />
              <Text style={styles.characterCount}>{description.length}/500</Text>
            </View>
          </View>

          {/* Location Section */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Location</Text>
            <TouchableOpacity style={styles.locationSection}>
              <MaterialIcons name="location-on" size={24} color={colors.primary} />
              <View style={styles.locationContent}>
                <Text style={styles.locationText}>{location}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Category Section */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Category *</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryItem,
                    selectedCategory === category.id && styles.selectedCategory,
                  ]}
                  onPress={() => setSelectedCategory(category.id)}>
                  <MaterialIcons
                    name={category.icon}
                    size={24}
                    color={selectedCategory === category.id ? colors.background : colors.primary}
                  />
                  <Text
                    style={[
                      styles.categoryLabel,
                      selectedCategory === category.id && styles.selectedCategoryText,
                    ]}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
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
  closeButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '600' as '600',
    color: colors.textPrimary,
    letterSpacing: 0.1,
  },
  submitButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.border,
  },
  submitButtonActive: {
    backgroundColor: colors.primary,
  },
  submitText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  submitTextActive: {
    color: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageSection: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    fontWeight: '600' as '600',
  },
  imageScrollView: {
    flexDirection: 'row',
  },
  imageScrollContent: {
    paddingRight: spacing.lg,
  },
  imageContainer: {
    marginRight: spacing.md,
    position: 'relative',
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: spacing.sm,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.error,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  uploadButton: {
    width: 100,
    height: 100,
    borderRadius: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.card,
  },
  uploadText: {
    ...typography.caption,
    color: colors.primary,
    marginTop: spacing.xs,
    fontWeight: '600' as '600',
  },
  uploadSubtext: {
    ...typography.small,
    color: colors.textSecondary,
  },
  inputSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  inputContainer: {
    backgroundColor: colors.card,
    borderRadius: spacing.md,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  titleInput: {
    ...typography.h2,
    color: colors.textPrimary,
    paddingVertical: 0,
    minHeight: 40,
  },
  descriptionInput: {
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: 0,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  characterCount: {
    ...typography.small,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: spacing.md,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  locationContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  locationText: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '500' as '500',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  categoryItem: {
    width: (screenWidth - spacing.lg * 2 - spacing.xs * 4) / 3,
    margin: spacing.xs,
    backgroundColor: colors.card,
    borderRadius: spacing.md,
    padding: spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCategory: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  categoryLabel: {
    ...typography.caption,
    color: colors.textPrimary,
    marginTop: spacing.xs,
    fontWeight: '500' as '500',
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: colors.background,
    fontWeight: '600' as '600',
  },
  bottomSpacing: {
    height: spacing.xl,
  },
});

export default PostRantScreen; 