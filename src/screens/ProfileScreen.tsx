import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  ImageStyle,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {colors, typography} from '../utils/theme';
import {useNavigation} from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user,logout } = useAuth();
  const [profileImage, _setProfileImage] = useState(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [userStats] = useState({
    rants: 42,
    followers: 128,
    following: 256,
  });

  const handleImageUpload = () => {
    // TODO: Implement image upload functionality
    console.log('Upload image');
  };

  const handleSettingsPress = () => {
    setShowLogoutPopup(true);
  };

  const handleLogout = async() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            // TODO: Clear cache and logout logic
            console.log('Logging out...');
            // Clear user data, tokens, etc.
            // Navigate to login screen
            await logout();
            navigation.reset({
              index: 0,
              routes: [{name: 'Login'} as any],
            });
          },
        },
      ]
    );
    setShowLogoutPopup(false);
  };

  const handleClosePopup = () => {
    setShowLogoutPopup(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.settingsButton} onPress={handleSettingsPress}>
          <MaterialIcons name="settings" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Logout Popup */}
      {showLogoutPopup && (
        <View style={styles.popupOverlay}>
          <TouchableOpacity style={styles.popupBackdrop} onPress={handleClosePopup} />
          <View style={styles.logoutPopup}>
            <TouchableOpacity style={styles.logoutOption} onPress={handleLogout}>
              <MaterialIcons name="logout" size={20} color={colors.error} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={handleImageUpload}>
          <View style={styles.profileImageContainer}>
            {profileImage ? (
              <Image source={profileImage} style={styles.profileImage as ImageStyle} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <MaterialIcons
                  name="person"
                  size={60}
                  color={colors.textLight}
                />
              </View>
            )}
            <View style={styles.editIconContainer}>
              <MaterialIcons name="camera-alt" size={20} color={colors.background} />
            </View>
          </View>
        </TouchableOpacity>

        <Text style={styles.username}>{user?.username || 'User'}</Text>
        <Text style={styles.bio}>{user?.email || 'No email'}</Text>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.rants}</Text>
            <Text style={styles.statLabel}>Rants</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.followers}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.following}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.editProfileButton}>
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Activity Section */}
      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          <View style={styles.activityItem}>
            <MaterialIcons name="thumb-up" size={24} color={colors.primary} />
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>
                You upvoted a rant about local traffic
              </Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <MaterialIcons name="comment" size={24} color={colors.primary} />
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>
                You commented on a post about park maintenance
              </Text>
              <Text style={styles.activityTime}>5 hours ago</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Achievements Section */}
      <View style={styles.achievementsSection}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievementsList}>
          <View style={styles.achievementItem}>
            <View style={styles.achievementIcon}>
              <MaterialIcons name="star" size={24} color={colors.primary} />
            </View>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>Top Contributor</Text>
              <Text style={styles.achievementDescription}>
                Posted 10+ rants this month
              </Text>
            </View>
          </View>
          <View style={styles.achievementItem}>
            <View style={styles.achievementIcon}>
              <MaterialIcons name="trending-up" size={24} color={colors.primary} />
            </View>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>Trend Setter</Text>
              <Text style={styles.achievementDescription}>
                Created a trending topic
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent:'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 16,
    backgroundColor: colors.background,
  },
  headerTitle: {
    ...typography.h1,
    fontSize: 24,
    fontWeight: '700',
  },
  settingsButton: {
    padding: 8,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.background,
  },
  username: {
    ...typography.h2,
    marginBottom: 8,
    fontWeight: '700',
  },
  bio: {
    ...typography.body,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...typography.h2,
    color: colors.primary,
    fontWeight: '700',
  },
  statLabel: {
    ...typography.caption,
    color: colors.textLight,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  editProfileButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: colors.primary,
  },
  editProfileText: {
    ...typography.body,
    color: colors.background,
    fontWeight: '600',
  },
  activitySection: {
    padding: 16,
  },
  sectionTitle: {
    ...typography.h2,
    marginBottom: 16,
  },
  activityList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activityContent: {
    marginLeft: 12,
    flex: 1,
  },
  activityText: {
    ...typography.body,
    marginBottom: 4,
  },
  activityTime: {
    ...typography.caption,
    color: colors.textLight,
  },
  achievementsSection: {
    padding: 16,
    paddingBottom: 32,
  },
  achievementsList: {
    gap: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    ...typography.h2,
    marginBottom: 4,
    fontWeight: '700',
  },
  achievementDescription: {
    ...typography.caption,
    color: colors.textLight,
  },
  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  logoutPopup: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 80,
    right: 20,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 120,
  },
  logoutOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutText: {
    ...typography.body,
    color: colors.error,
    marginLeft: 12,
    fontWeight: '500',
  },
});

export default ProfileScreen; 