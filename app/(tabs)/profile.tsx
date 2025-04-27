import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Platform,
  Switch,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Edit2, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Check,
  Camera,
  Settings,
  Bell,
  Shield,
  Eye,
  Sliders,
  HelpCircle,
  LogOut,
  ChevronRight,
  Smartphone,
  Globe,
  Moon,
  User as UserIcon
} from 'lucide-react-native';
import { colors, gradients } from '@/constants/colors';
import { borderRadius, fontSize, fontWeight, shadows, spacing } from '@/constants/theme';
import { Button } from '@/components/Button';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '@/store/auth-store';
import { translations } from '@/constants/translations';
import { User as UserType } from '@/types/user';
import { EditProfileModal } from '@/components/EditProfileModal';

export default function ProfileScreen() {
  const router = useRouter();
  const { actions: authActions } = useAuthStore();
  
  const [currentUser, setCurrentUser] = useState<UserType>({
    id: 'current-user',
    name: 'Алекс Иванов',
    age: 28,
    bio: 'Разработчик ПО днем, музыкант ночью. Люблю походы, фотографию и пробовать новые рестораны.',
    location: 'Москва',
    distance: 0,
    photos: [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    ],
    interests: ['Музыка', 'Походы', 'Фотография', 'Программирование', 'Еда'],
    occupation: 'Разработчик ПО',
    education: 'МГУ',
    verified: true,
    gender: 'male',
    lookingFor: 'all',
  });
  
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  
  // Edit modals state
  const [editBioModal, setEditBioModal] = useState(false);
  const [editOccupationModal, setEditOccupationModal] = useState(false);
  const [editEducationModal, setEditEducationModal] = useState(false);
  const [editInterestsModal, setEditInterestsModal] = useState(false);
  const [editLocationModal, setEditLocationModal] = useState(false);
  const [editPhoneModal, setEditPhoneModal] = useState(false);
  
  const handleAddPhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert(translations.permissionRequired, translations.galleryPermissionMessage);
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    });
    
    if (!result.canceled) {
      setCurrentUser(prev => ({
        ...prev,
        photos: [...prev.photos, result.assets[0].uri],
      }));
    }
  };
  
  const handleEditProfile = () => {
    Alert.alert(translations.editProfile, translations.chooseWhatToEdit, [
      {
        text: translations.editPhotos,
        onPress: handleAddPhoto
      },
      {
        text: translations.editBio,
        onPress: () => setEditBioModal(true)
      },
      {
        text: translations.editBasicInfo,
        onPress: () => {
          Alert.alert(translations.editBasicInfo, translations.chooseWhatToEdit, [
            {
              text: translations.occupation,
              onPress: () => setEditOccupationModal(true)
            },
            {
              text: translations.education,
              onPress: () => setEditEducationModal(true)
            },
            {
              text: translations.cancel,
              style: 'cancel'
            }
          ]);
        }
      },
      {
        text: translations.editInterests,
        onPress: () => setEditInterestsModal(true)
      },
      {
        text: translations.cancel,
        style: 'cancel'
      }
    ]);
  };
  
  const handleLogout = () => {
    Alert.alert(
      translations.logout,
      translations.logoutConfirmation,
      [
        {
          text: translations.cancel,
          style: 'cancel'
        },
        {
          text: translations.logout,
          onPress: () => {
            authActions.logout();
            router.replace('/onboarding');
          },
          style: 'destructive'
        }
      ]
    );
  };
  
  const handleSaveBio = (value: string) => {
    setCurrentUser(prev => ({
      ...prev,
      bio: value
    }));
  };
  
  const handleSaveOccupation = (value: string) => {
    setCurrentUser(prev => ({
      ...prev,
      occupation: value
    }));
  };
  
  const handleSaveEducation = (value: string) => {
    setCurrentUser(prev => ({
      ...prev,
      education: value
    }));
  };
  
  const handleSaveInterests = (value: string) => {
    const interestsArray = value
      .split(',')
      .map(interest => interest.trim())
      .filter(interest => interest.length > 0);
    
    setCurrentUser(prev => ({
      ...prev,
      interests: interestsArray
    }));
  };
  
  const handleSaveLocation = (value: string) => {
    setCurrentUser(prev => ({
      ...prev,
      location: value
    }));
  };
  
  const handleSavePhone = (value: string) => {
    // In a real app, you would validate and save the phone number
    Alert.alert(translations.phoneUpdated, translations.phoneUpdatedMessage);
  };
  
  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    onPress?: () => void,
    rightElement?: React.ReactNode
  ) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingIconContainer}>
        {icon}
      </View>
      <Text style={styles.settingTitle}>{title}</Text>
      <View style={styles.settingRight}>
        {rightElement || <ChevronRight size={20} color={colors.textSecondary} />}
      </View>
    </TouchableOpacity>
  );
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'auto'} />
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{showSettings ? translations.settings : translations.myProfile}</Text>
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => setShowSettings(!showSettings)}
            >
              {showSettings ? (
                <UserIcon size={24} color={colors.text} />
              ) : (
                <Settings size={24} color={colors.text} />
              )}
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
          >
            {!showSettings ? (
              <>
                <View style={styles.photoGallery}>
                  <Image
                    source={{ uri: currentUser.photos[activePhotoIndex] }}
                    style={styles.mainPhoto}
                    contentFit="cover"
                  />
                  
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.photoOverlay}
                  >
                    <View style={styles.userBasicInfo}>
                      <View style={styles.nameAgeContainer}>
                        <Text style={styles.name}>{currentUser.name}, {currentUser.age}</Text>
                        {currentUser.verified && (
                          <View style={styles.verifiedBadge}>
                            <Check size={14} color="white" />
                          </View>
                        )}
                      </View>
                      
                      <View style={styles.locationContainer}>
                        <MapPin size={16} color="white" />
                        <Text style={styles.location}>{currentUser.location}</Text>
                      </View>
                    </View>
                  </LinearGradient>
                  
                  <View style={styles.thumbnailsContainer}>
                    {currentUser.photos.map((photo, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.thumbnail,
                          activePhotoIndex === index && styles.activeThumbnail,
                        ]}
                        onPress={() => setActivePhotoIndex(index)}
                      >
                        <Image
                          source={{ uri: photo }}
                          style={styles.thumbnailImage}
                          contentFit="cover"
                        />
                      </TouchableOpacity>
                    ))}
                    
                    <TouchableOpacity
                      style={styles.addPhotoButton}
                      onPress={handleAddPhoto}
                    >
                      <Camera size={24} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.profileInfo}>
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>{translations.about}</Text>
                      <TouchableOpacity onPress={() => setEditBioModal(true)}>
                        <Edit2 size={16} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.bioText}>{currentUser.bio}</Text>
                  </View>
                  
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>{translations.basicInfo}</Text>
                      <TouchableOpacity onPress={() => {
                        Alert.alert(translations.editBasicInfo, translations.chooseWhatToEdit, [
                          {
                            text: translations.occupation,
                            onPress: () => setEditOccupationModal(true)
                          },
                          {
                            text: translations.education,
                            onPress: () => setEditEducationModal(true)
                          },
                          {
                            text: translations.cancel,
                            style: 'cancel'
                          }
                        ]);
                      }}>
                        <Edit2 size={16} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                    
                    {currentUser.occupation && (
                      <View style={styles.infoItem}>
                        <Briefcase size={18} color={colors.textSecondary} />
                        <Text style={styles.infoText}>{currentUser.occupation}</Text>
                      </View>
                    )}
                    
                    {currentUser.education && (
                      <View style={styles.infoItem}>
                        <GraduationCap size={18} color={colors.textSecondary} />
                        <Text style={styles.infoText}>{currentUser.education}</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>{translations.interests}</Text>
                      <TouchableOpacity onPress={() => setEditInterestsModal(true)}>
                        <Edit2 size={16} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                    
                    <View style={styles.interestsContainer}>
                      {currentUser.interests.map((interest, index) => (
                        <View key={index} style={styles.interestTag}>
                          <Text style={styles.interestText}>{interest}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  
                  <Button
                    title={translations.editProfile}
                    onPress={handleEditProfile}
                    style={styles.editButton}
                    fullWidth
                  />
                </View>
              </>
            ) : (
              <View style={styles.settingsContainer}>
                <View style={styles.settingsSection}>
                  <Text style={styles.settingsSectionTitle}>{translations.account}</Text>
                  
                  {renderSettingItem(
                    <Smartphone size={22} color={colors.primary} />,
                    translations.phoneNumber,
                    () => setEditPhoneModal(true)
                  )}
                  
                  {renderSettingItem(
                    <Globe size={22} color={colors.primary} />,
                    translations.location,
                    () => setEditLocationModal(true),
                    <Text style={styles.settingValue}>{currentUser.location}</Text>
                  )}
                  
                  {renderSettingItem(
                    <Bell size={22} color={colors.primary} />,
                    translations.notifications,
                    () => setNotificationsEnabled(!notificationsEnabled),
                    <Switch
                      value={notificationsEnabled}
                      onValueChange={setNotificationsEnabled}
                      trackColor={{ false: colors.border, true: colors.primary }}
                      thumbColor="white"
                    />
                  )}
                  
                  {renderSettingItem(
                    <Moon size={22} color={colors.primary} />,
                    translations.darkMode,
                    () => {
                      setDarkModeEnabled(!darkModeEnabled);
                      Alert.alert(
                        translations.darkMode,
                        darkModeEnabled 
                          ? translations.lightModeEnabled 
                          : translations.darkModeEnabled
                      );
                    },
                    <Switch
                      value={darkModeEnabled}
                      onValueChange={setDarkModeEnabled}
                      trackColor={{ false: colors.border, true: colors.primary }}
                      thumbColor="white"
                    />
                  )}
                </View>
                
                <View style={styles.settingsSection}>
                  <Text style={styles.settingsSectionTitle}>{translations.discovery}</Text>
                  
                  {renderSettingItem(
                    <Sliders size={22} color={colors.primary} />,
                    translations.discoveryPreferences,
                    () => {
                      Alert.alert(
                        translations.discoveryPreferences,
                        translations.comingSoon
                      );
                    }
                  )}
                  
                  {renderSettingItem(
                    <Eye size={22} color={colors.primary} />,
                    translations.showMe,
                    () => {
                      Alert.alert(
                        translations.showMe,
                        translations.comingSoon
                      );
                    }
                  )}
                </View>
                
                <View style={styles.settingsSection}>
                  <Text style={styles.settingsSectionTitle}>{translations.privacyAndSafety}</Text>
                  
                  {renderSettingItem(
                    <Shield size={22} color={colors.primary} />,
                    translations.privacySettings,
                    () => {
                      Alert.alert(
                        translations.privacySettings,
                        translations.comingSoon
                      );
                    }
                  )}
                  
                  {renderSettingItem(
                    <HelpCircle size={22} color={colors.primary} />,
                    translations.helpAndSupport,
                    () => {
                      Alert.alert(
                        translations.helpAndSupport,
                        translations.contactSupport
                      );
                    }
                  )}
                </View>
                
                <TouchableOpacity 
                  style={styles.logoutButton}
                  onPress={handleLogout}
                >
                  <LogOut size={20} color={colors.error} />
                  <Text style={styles.logoutText}>{translations.logout}</Text>
                </TouchableOpacity>
                
                <Text style={styles.versionText}>{translations.version} 1.0.0</Text>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
        
        {/* Edit Modals */}
        <EditProfileModal
          visible={editBioModal}
          title={translations.editBio}
          onClose={() => setEditBioModal(false)}
          onSave={handleSaveBio}
          initialValue={currentUser.bio}
          placeholder={translations.enterYourBio}
          multiline={true}
          maxLength={300}
        />
        
        <EditProfileModal
          visible={editOccupationModal}
          title={translations.occupation}
          onClose={() => setEditOccupationModal(false)}
          onSave={handleSaveOccupation}
          initialValue={currentUser.occupation || ''}
          placeholder={translations.enterYourOccupation}
        />
        
        <EditProfileModal
          visible={editEducationModal}
          title={translations.education}
          onClose={() => setEditEducationModal(false)}
          onSave={handleSaveEducation}
          initialValue={currentUser.education || ''}
          placeholder={translations.enterYourEducation}
        />
        
        <EditProfileModal
          visible={editInterestsModal}
          title={translations.editInterests}
          onClose={() => setEditInterestsModal(false)}
          onSave={handleSaveInterests}
          initialValue={currentUser.interests.join(', ')}
          placeholder={translations.enterYourInterests}
          label={translations.interestsComma}
        />
        
        <EditProfileModal
          visible={editLocationModal}
          title={translations.editLocation}
          onClose={() => setEditLocationModal(false)}
          onSave={handleSaveLocation}
          initialValue={currentUser.location}
          placeholder={translations.enterYourLocation}
        />
        
        <EditProfileModal
          visible={editPhoneModal}
          title={translations.editPhoneNumber}
          onClose={() => setEditPhoneModal(false)}
          onSave={handleSavePhone}
          initialValue="+7 (999) 123-45-67"
          placeholder={translations.enterYourPhoneNumber}
          keyboardType="phone-pad"
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 120 : 100, // Extra padding for tab bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoGallery: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  mainPhoto: {
    width: '100%',
    height: 450,
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  userBasicInfo: {
    flex: 1,
  },
  nameAgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  name: {
    color: 'white',
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  verifiedBadge: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  location: {
    color: 'white',
    fontSize: fontSize.sm,
  },
  thumbnailsContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  activeThumbnail: {
    borderColor: colors.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  addPhotoButton: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    backgroundColor: colors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  profileInfo: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  bioText: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: fontSize.md * 1.5,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  interestTag: {
    backgroundColor: colors.inputBackground,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  interestText: {
    color: colors.text,
    fontSize: fontSize.sm,
  },
  editButton: {
    marginTop: spacing.md,
  },
  // Settings styles
  settingsContainer: {
    padding: spacing.lg,
  },
  settingsSection: {
    marginBottom: spacing.xl,
  },
  settingsSectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  settingTitle: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.card,
    marginTop: spacing.xl,
  },
  logoutText: {
    color: colors.error,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    marginLeft: spacing.sm,
  },
  versionText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginTop: spacing.xl,
  },
});