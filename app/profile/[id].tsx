import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Platform,
  Alert,
  Dimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Check,
  Flag,
  Heart,
  X,
  Star
} from 'lucide-react-native';
import { mockUsers } from '@/mocks/users';
import { colors } from '@/constants/colors';
import { borderRadius, fontSize, fontWeight, shadows, spacing } from '@/constants/theme';
import { Button } from '@/components/Button';
import { translations } from '@/constants/translations';
import { useLikeUser, useDislikeUser, useSuperLikeUser } from '@/lib/api';

const windowWidth = Dimensions.get('window').width;
const isWeb = Platform.OS === 'web';

function safeBack(router) {
  if (router.canGoBack && router.canGoBack()) {
    router.back();
  } else {
    router.replace('/');
  }
}

export default function ProfileDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  // API хуки
  const { likeUser, isLoading: isLikeLoading } = useLikeUser();
  const { dislikeUser, isLoading: isDislikeLoading } = useDislikeUser();
  const { superLikeUser, isLoading: isSuperLikeLoading } = useSuperLikeUser();
  
  const user = mockUsers.find(user => user.id === id);
  
  if (!user) {
    React.useEffect(() => {
      Alert.alert(
        translations.error,
        'Пользователь не найден',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/'),
          },
        ]
      );
    }, []);
    return null;
  }
  
  const [activePhotoIndex, setActivePhotoIndex] = React.useState(0);
  
  const handleLike = () => {
    // Вызываем API
    likeUser({ likedUserId: user.id }, {
      onSuccess: (data) => {
        if (data.match) {
          Alert.alert(
            translations.itsAMatch,
            translations.youAndXLikedEachOther.replace('{name}', user.name),
            [
              {
                text: translations.sendMessage,
                onPress: () => router.push(`/chat/${data.match.id}`),
              },
              {
                text: translations.keepSwiping,
                onPress: () => safeBack(router),
                style: 'cancel',
              },
            ]
          );
        } else {
          safeBack(router);
        }
      },
      onError: (error) => {
        Alert.alert(
          translations.error,
          'Не удалось поставить лайк. Попробуйте позже.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/'),
            },
          ]
        );
      }
    });
  };
  
  const handleDislike = () => {
    // Вызываем API
    dislikeUser({ dislikedUserId: user.id }, {
      onSuccess: () => {
        safeBack(router);
      },
      onError: (error) => {
        Alert.alert(
          translations.error,
          'Не удалось поставить дизлайк. Попробуйте позже.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/'),
            },
          ]
        );
      }
    });
  };
  
  const handleSuperLike = () => {
    // Вызываем API
    superLikeUser({ superLikedUserId: user.id }, {
      onSuccess: (data) => {
        if (data.match) {
          Alert.alert(
            translations.itsAMatch,
            translations.youAndXLikedEachOther.replace('{name}', user.name),
            [
              {
                text: translations.sendMessage,
                onPress: () => router.push(`/chat/${data.match.id}`),
              },
              {
                text: translations.keepSwiping,
                onPress: () => safeBack(router),
                style: 'cancel',
              },
            ]
          );
        } else {
          Alert.alert(
            translations.superLike,
            translations.superLikeSuccess.replace('{name}', user.name),
            [
              {
                text: 'OK',
                onPress: () => safeBack(router),
              },
            ]
          );
        }
      },
      onError: (error) => {
        Alert.alert(
          translations.error,
          'Не удалось отправить суперлайк. Попробуйте позже.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/'),
            },
          ]
        );
      }
    });
  };
  
  const handleReport = () => {
    // Логика жалобы на пользователя
    Alert.alert(translations.userReported);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'auto'} />
      
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.centeredContent}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.reportButton}
              onPress={handleReport}
            >
              <Flag size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.photoGallery}>
            <Image
              source={{ uri: user.photos[activePhotoIndex] }}
              style={styles.mainPhoto}
              contentFit="cover"
            />
            
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.photoOverlay}
            >
              <View style={styles.userBasicInfo}>
                <View style={styles.nameAgeContainer}>
                  <Text style={styles.name}>{user.name}, {user.age}</Text>
                  {user.verified && (
                    <View style={styles.verifiedBadge}>
                      <Check size={14} color="white" />
                    </View>
                  )}
                </View>
                
                <View style={styles.locationContainer}>
                  <MapPin size={16} color="white" />
                  <Text style={styles.location}>{user.location} • {user.distance} км</Text>
                </View>
              </View>
            </LinearGradient>
            
            <View style={styles.photoNav}>
              {user.photos.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.photoNavDot,
                    activePhotoIndex === index && styles.photoNavDotActive
                  ]}
                  onPress={() => setActivePhotoIndex(index)}
                />
              ))}
            </View>
          </View>
          
          <View style={styles.profileInfo}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{translations.about}</Text>
              <Text style={styles.bioText}>{user.bio}</Text>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{translations.basicInfo}</Text>
              
              {user.occupation && (
                <View style={styles.infoItem}>
                  <Briefcase size={18} color={colors.textSecondary} />
                  <Text style={styles.infoText}>{user.occupation}</Text>
                </View>
              )}
              
              {user.education && (
                <View style={styles.infoItem}>
                  <GraduationCap size={18} color={colors.textSecondary} />
                  <Text style={styles.infoText}>{user.education}</Text>
                </View>
              )}
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{translations.interests}</Text>
              
              <View style={styles.interestsContainer}>
                {user.interests.map((interest, index) => (
                  <View key={index} style={styles.interestTag}>
                    <Text style={styles.interestText}>{interest}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.actionButtonsWrapper}>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.dislikeButton]} 
            onPress={handleDislike}
            disabled={isDislikeLoading || isLikeLoading || isSuperLikeLoading}
          >
            <X size={24} color={colors.error} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.superLikeButton, styles.superLikeHighlight]} 
            onPress={handleSuperLike}
            disabled={isDislikeLoading || isLikeLoading || isSuperLikeLoading}
          >
            <Star size={32} color="white" style={{ textShadowColor: colors.tertiary, textShadowRadius: 8 }} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.likeButton]} 
            onPress={handleLike}
            disabled={isDislikeLoading || isLikeLoading || isSuperLikeLoading}
          >
            <Heart size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: isWeb ? 'center' : undefined,
    paddingHorizontal: isWeb ? 24 : 0,
  },
  scrollContent: {
    paddingBottom: isWeb ? 40 : 120,
    alignItems: isWeb ? 'center' : undefined,
    minHeight: '100%',
    paddingHorizontal: isWeb ? 0 : spacing.md,
  },
  centeredContent: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    backgroundColor: colors.background,
    borderRadius: isWeb ? 24 : 0,
    ...isWeb ? { boxShadow: '0 4px 32px rgba(0,0,0,0.10)', transition: 'box-shadow 0.2s' } : {},
    paddingBottom: 32,
    marginTop: isWeb ? 32 : 0,
    marginBottom: isWeb ? 32 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: spacing.md,
    maxWidth: 440,
    alignSelf: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoGallery: {
    position: 'relative',
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  mainPhoto: {
    width: '100%',
    aspectRatio: 3/4,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: isWeb ? 32 : 0,
    marginBottom: isWeb ? 16 : 0,
    backgroundColor: colors.card,
    maxWidth: 420,
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
    fontSize: fontSize.xxl,
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
    fontSize: fontSize.md,
  },
  photoNav: {
    position: 'absolute',
    top: spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  photoNavDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  photoNavDotActive: {
    backgroundColor: 'white',
    width: 20,
  },
  profileInfo: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
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
  actionButtonsWrapper: {
    width: '100%',
    alignItems: 'center',
    ...(!isWeb ? {
      position: 'absolute',
      bottom: Platform.OS === 'ios' ? 40 : 20,
      left: 0,
      right: 0,
    } : {
      position: 'relative',
      marginTop: 24,
      marginBottom: 24,
    }),
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
    maxWidth: 440,
    width: '100%',
    alignSelf: 'center',
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
    ...isWeb ? {
      transition: 'box-shadow 0.2s, transform 0.2s',
      cursor: 'pointer',
    } : {},
  },
  dislikeButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.error,
  },
  likeButton: {
    backgroundColor: colors.secondary,
  },
  superLikeButton: {
    backgroundColor: colors.tertiary,
  },
  superLikeHighlight: {
    borderWidth: 2,
    borderColor: colors.tertiary,
    shadowColor: colors.tertiary,
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
});