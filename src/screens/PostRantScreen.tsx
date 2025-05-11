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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {colors, typography} from '../utils/theme';

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
  const [isAnonymous, setIsAnonymous] = useState(false);

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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}>
            <MaterialIcons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Rant</Text>
          <TouchableOpacity
            style={[
              styles.submitButton,
              {
                backgroundColor:
                  title.trim() && description.trim() && selectedCategory
                    ? colors.primary
                    : colors.border,
              },
            ]}
            onPress={handleSubmit}>
            <Text style={styles.submitText}>Post</Text>
          </TouchableOpacity>
        </View>

        {/* Image Upload Section */}
        <View style={styles.imageSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.imageScrollView}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{uri: image}} style={styles.uploadedImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => handleRemoveImage(index)}>
                  <MaterialIcons name="close" size={20} color={colors.background} />
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
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.titleInput}
            placeholder="Title of your rant"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
          <Text style={styles.characterCount}>{title.length}/100</Text>
        </View>

        {/* Description Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Describe your rant in detail..."
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Location Section */}
        <TouchableOpacity style={styles.locationSection}>
          <MaterialIcons name="location-on" size={24} color={colors.primary} />
          <View style={styles.locationContent}>
            <Text style={styles.locationLabel}>Location</Text>
            <Text style={styles.locationText}>{location}</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={colors.textLight} />
        </TouchableOpacity>

        {/* Category Section */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Category</Text>
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

        {/* Anonymous Toggle */}
        <TouchableOpacity
          style={styles.anonymousSection}
          onPress={() => setIsAnonymous(!isAnonymous)}>
          <View style={styles.anonymousContent}>
            <MaterialIcons
              name={isAnonymous ? 'visibility-off' : 'visibility'}
              size={24}
              color={colors.text}
            />
            <View style={styles.anonymousTextContainer}>
              <Text style={styles.anonymousTitle}>Post Anonymously</Text>
              <Text style={styles.anonymousSubtext}>
                Your identity will be hidden from other users
              </Text>
            </View>
          </View>
          <MaterialIcons
            name={isAnonymous ? 'toggle-on' : 'toggle-off'}
            size={40}
            color={isAnonymous ? colors.primary : colors.border}
          />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    ...typography.h1,
    fontSize: 20,
  },
  submitButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  submitText: {
    ...typography.body,
    color: colors.background,
    fontWeight: '600' as const,
  },
  imageSection: {
    padding: 16,
  },
  imageScrollView: {
    flexDirection: 'row',
  },
  imageContainer: {
    marginRight: 12,
    position: 'relative',
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
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
  },
  uploadButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    ...typography.caption,
    color: colors.primary,
    marginTop: 4,
  },
  uploadSubtext: {
    ...typography.caption,
    color: colors.textLight,
  },
  inputContainer: {
    padding: 16,
  },
  titleInput: {
    ...typography.h2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 8,
  },
  characterCount: {
    ...typography.caption,
    color: colors.textLight,
    textAlign: 'right',
    marginTop: 4,
  },
  descriptionInput: {
    ...typography.body,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  locationContent: {
    flex: 1,
    marginLeft: 12,
  },
  locationLabel: {
    ...typography.caption,
    color: colors.textLight,
  },
  locationText: {
    ...typography.body,
    color: colors.text,
  },
  categorySection: {
    padding: 16,
  },
  sectionTitle: {
    ...typography.h2,
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  categoryItem: {
    width: '33.33%',
    padding: 8,
    alignItems: 'center',
  },
  selectedCategory: {
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  categoryLabel: {
    ...typography.caption,
    color: colors.text,
    marginTop: 4,
  },
  selectedCategoryText: {
    color: colors.background,
  },
  anonymousSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  anonymousContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  anonymousTextContainer: {
    marginLeft: 12,
  },
  anonymousTitle: {
    ...typography.body,
    color: colors.text,
  },
  anonymousSubtext: {
    ...typography.caption,
    color: colors.textLight,
  },
});

export default PostRantScreen; 