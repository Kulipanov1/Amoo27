import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Dimensions, 
  TouchableOpacity, 
  Platform,
  Animated,
  PanResponder,
  Modal
} from 'react-native';
import { Image } from 'expo-image';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, X, Star, Info, MapPin, Briefcase, GraduationCap, Check, RotateCcw, ChevronUp, Play } from 'lucide-react-native';
import { User } from '@/types/user';
import { colors } from '@/constants/colors';
import { borderRadius, fontSize, fontWeight, shadows, spacing } from '@/constants/theme';
import { translations } from '@/constants/translations';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height * 0.7;
const SWIPE_THRESHOLD = width * 0.25;
const SWIPE_UP_THRESHOLD = height * 0.15;

interface ProfileCardProps {
  user: User;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSuperLike: () => void;
  onViewProfile: () => void;
  onUndoSwipe?: () => void;
  isFirst?: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  onSwipeLeft,
  onSwipeRight,
  onSuperLike,
  onViewProfile,
  onUndoSwipe,
  isFirst = false,
}) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const videoRef = useRef<Video>(null);
  const [videoStatus, setVideoStatus] = useState<any>(null);
  
  // Calculate total media items (photos + videos)
  const mediaItems = [...(user.photos || []), ...(user.videos || [])];
  
  // Check if current media is a video
  const checkIfVideo = (index: number) => {
    const photosLength = user.photos?.length || 0;
    return index >= photosLength;
  };

  // Update media type when index changes
  React.useEffect(() => {
    setIsVideo(checkIfVideo(currentMediaIndex));
  }, [currentMediaIndex]);

  // Animation values
  const position = useRef(new Animated.ValueXY()).current;
  const rotation = position.x.interpolate({
    inputRange: [-CARD_WIDTH / 2, 0, CARD_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, CARD_WIDTH / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const dislikeOpacity = position.x.interpolate({
    inputRange: [-CARD_WIDTH / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const superLikeOpacity = position.y.interpolate({
    inputRange: [-CARD_HEIGHT / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const nextCardScale = position.x.interpolate({
    inputRange: [-CARD_WIDTH / 2, 0, CARD_WIDTH / 2],
    outputRange: [1, 0.9, 1],
    extrapolate: 'clamp',
  });

  // Pan responder for swipe gestures
  const panResponder = React.useMemo(() => {
    if (!isFirst) return PanResponder.create({});
    
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD) {
          swipeRight();
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
          swipeLeft();
        } else if (gestureState.dy < -SWIPE_UP_THRESHOLD) {
          // Swipe up for super like
          handleSuperLike();
        } else {
          resetPosition();
        }
      },
    });
  }, [isFirst]);

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const swipeLeft = () => {
    Animated.timing(position, {
      toValue: { x: -CARD_WIDTH * 1.5, y: 0 },
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onSwipeLeft();
      position.setValue({ x: 0, y: 0 });
    });
  };

  const swipeRight = () => {
    Animated.timing(position, {
      toValue: { x: CARD_WIDTH * 1.5, y: 0 },
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onSwipeRight();
      position.setValue({ x: 0, y: 0 });
    });
  };

  const handleSuperLike = () => {
    Animated.timing(position, {
      toValue: { x: 0, y: -CARD_HEIGHT },
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onSuperLike();
      position.setValue({ x: 0, y: 0 });
    });
  };

  const showDetailModal = () => {
    setDetailModalVisible(true);
    resetPosition();
  };

  const nextMedia = () => {
    if (currentMediaIndex < mediaItems.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1);
    }
  };

  const prevMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1);
    }
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const getMediaSource = () => {
    if (isVideo) {
      const videoIndex = currentMediaIndex - (user.photos?.length || 0);
      return user.videos?.[videoIndex] || '';
    } else {
      return user.photos?.[currentMediaIndex] || '';
    }
  };

  const cardStyle = {
    transform: [
      { translateX: position.x },
      { translateY: position.y },
      { rotate: rotation },
    ],
    zIndex: isFirst ? 1 : 0,
    opacity: isFirst ? 1 : 0.9,
    scale: isFirst ? 1 : nextCardScale,
  };

  const renderMedia = () => {
    if (isVideo) {
      return (
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            style={styles.video}
            source={{ uri: getMediaSource() }}
            useNativeControls={false}
            resizeMode={ResizeMode.COVER}
            isLooping
            onPlaybackStatusUpdate={status => setVideoStatus(status)}
          />
          <TouchableOpacity 
            style={styles.videoPlayButton}
            onPress={() => {
              if (videoRef.current) {
                if (videoStatus?.isLoaded && videoStatus.isPlaying) {
                  videoRef.current.pauseAsync();
                } else if (videoRef.current) {
                  videoRef.current.playAsync();
                }
              }
            }}
          >
            {(!videoStatus?.isLoaded || !videoStatus.isPlaying) && <Play size={40} color="white" />}
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <Image
          source={{ uri: getMediaSource() }}
          style={styles.photo}
          contentFit="cover"
          transition={200}
        />
      );
    }
  };

  return (
    <>
      <Animated.View 
        style={[styles.card, cardStyle]} 
        {...(isFirst ? panResponder.panHandlers : {})}
      >
        <View style={styles.photoContainer}>
          {renderMedia()}
          
          {/* Media navigation */}
          <View style={styles.photoNav}>
            {mediaItems.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.photoNavDot, 
                  index === currentMediaIndex && styles.photoNavDotActive,
                  checkIfVideo(index) && styles.videoNavDot
                ]} 
              />
            ))}
          </View>

          {/* Swipe indicators */}
          {isFirst && (
            <>
              <Animated.View style={[styles.likeIndicator, { opacity: likeOpacity }]}>
                <Text style={styles.likeIndicatorText}>{translations.like}</Text>
              </Animated.View>
              <Animated.View style={[styles.dislikeIndicator, { opacity: dislikeOpacity }]}>
                <Text style={styles.dislikeIndicatorText}>{translations.nope}</Text>
              </Animated.View>
              <Animated.View style={[styles.superLikeIndicator, { opacity: superLikeOpacity }]}>
                <Text style={styles.superLikeIndicatorText}>{translations.superLike}</Text>
              </Animated.View>
            </>
          )}

          {/* Left/Right touch areas for photo navigation */}
          <TouchableOpacity 
            style={styles.photoNavLeft} 
            onPress={prevMedia}
            activeOpacity={1}
          />
          <TouchableOpacity 
            style={styles.photoNavRight} 
            onPress={nextMedia}
            activeOpacity={1}
          />

          {/* User info overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.infoOverlay}
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

            <TouchableOpacity 
              style={styles.infoButton} 
              onPress={toggleDetails}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Info size={24} color="white" />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Expanded user details */}
        {showDetails && (
          <View style={styles.detailsContainer}>
            {user.occupation && (
              <View style={styles.detailItem}>
                <Briefcase size={16} color={colors.textSecondary} />
                <Text style={styles.detailText}>{user.occupation}</Text>
              </View>
            )}
            
            {user.education && (
              <View style={styles.detailItem}>
                <GraduationCap size={16} color={colors.textSecondary} />
                <Text style={styles.detailText}>{user.education}</Text>
              </View>
            )}
            
            <Text style={styles.bioTitle}>{translations.about}</Text>
            <Text style={styles.bioText}>{user.bio}</Text>
            
            <Text style={styles.interestsTitle}>{translations.interests}</Text>
            <View style={styles.interestsContainer}>
              {user.interests && user.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Action buttons */}
        {isFirst && (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.dislikeButton]} 
              onPress={swipeLeft}
            >
              <X size={24} color={colors.error} />
            </TouchableOpacity>
            
            {onUndoSwipe && (
              <TouchableOpacity 
                style={[styles.actionButton, styles.undoButton]} 
                onPress={onUndoSwipe}
              >
                <RotateCcw size={24} color={colors.primary} />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.superLikeButton]} 
              onPress={handleSuperLike}
            >
              <Star size={28} color={colors.tertiary} style={{ textShadowColor: colors.tertiary, textShadowRadius: 8 }} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.likeButton]} 
              onPress={swipeRight}
            >
              <Heart size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>

      {/* Detail Modal */}
      <Modal
        visible={detailModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalCloseButton}
            onPress={() => setDetailModalVisible(false)}
          >
            <X size={24} color={colors.text} />
          </TouchableOpacity>
          
          <View style={styles.modalImageContainer}>
            {isVideo ? (
              <Video
                style={styles.modalImage}
                source={{ uri: getMediaSource() }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                isLooping
              />
            ) : (
              <Image
                source={{ uri: getMediaSource() }}
                style={styles.modalImage}
                contentFit="cover"
              />
            )}
          </View>
          
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalName}>{user.name}, {user.age}</Text>
              {user.verified && (
                <View style={styles.modalVerifiedBadge}>
                  <Check size={14} color="white" />
                </View>
              )}
            </View>
            
            <View style={styles.modalLocation}>
              <MapPin size={16} color={colors.textSecondary} />
              <Text style={styles.modalLocationText}>{user.location} • {user.distance} км</Text>
            </View>
            
            {user.occupation && (
              <View style={styles.modalInfoItem}>
                <Briefcase size={18} color={colors.textSecondary} />
                <Text style={styles.modalInfoText}>{user.occupation}</Text>
              </View>
            )}
            
            {user.education && (
              <View style={styles.modalInfoItem}>
                <GraduationCap size={18} color={colors.textSecondary} />
                <Text style={styles.modalInfoText}>{user.education}</Text>
              </View>
            )}
            
            <Text style={styles.modalSectionTitle}>{translations.about}</Text>
            <Text style={styles.modalBio}>{user.bio}</Text>
            
            <Text style={styles.modalSectionTitle}>{translations.interests}</Text>
            <View style={styles.modalInterests}>
              {user.interests && user.interests.map((interest, index) => (
                <View key={index} style={styles.modalInterestTag}>
                  <Text style={styles.modalInterestText}>{interest}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalActionButton, styles.modalDislikeButton]} 
                onPress={() => {
                  setDetailModalVisible(false);
                  swipeLeft();
                }}
              >
                <X size={24} color={colors.error} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalActionButton, styles.modalSuperLikeButton]} 
                onPress={() => {
                  setDetailModalVisible(false);
                  handleSuperLike();
                }}
              >
                <Star size={24} color={colors.tertiary} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalActionButton, styles.modalLikeButton]} 
                onPress={() => {
                  setDetailModalVisible(false);
                  swipeRight();
                }}
              >
                <Heart size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.card,
    overflow: 'hidden',
    position: 'absolute',
    ...shadows.medium,
  },
  photoContainer: {
    width: '100%',
    height: '70%',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoPlayButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  photoNav: {
    position: 'absolute',
    top: spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    zIndex: 2,
  },
  photoNavDot: {
    width: CARD_WIDTH / 15,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  photoNavDotActive: {
    backgroundColor: 'white',
  },
  videoNavDot: {
    backgroundColor: 'rgba(0, 194, 255, 0.5)',
  },
  photoNavLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '30%',
    height: '100%',
    zIndex: 1,
  },
  photoNavRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '70%',
    height: '100%',
    zIndex: 1,
  },
  likeIndicator: {
    position: 'absolute',
    top: spacing.xl,
    right: spacing.xl,
    borderWidth: 4,
    borderColor: colors.success,
    borderRadius: borderRadius.md,
    padding: spacing.xs,
    transform: [{ rotate: '15deg' }],
    zIndex: 3,
  },
  likeIndicatorText: {
    color: colors.success,
    fontWeight: fontWeight.bold,
    fontSize: fontSize.lg,
  },
  dislikeIndicator: {
    position: 'absolute',
    top: spacing.xl,
    left: spacing.xl,
    borderWidth: 4,
    borderColor: colors.error,
    borderRadius: borderRadius.md,
    padding: spacing.xs,
    transform: [{ rotate: '-15deg' }],
    zIndex: 3,
  },
  dislikeIndicatorText: {
    color: colors.error,
    fontWeight: fontWeight.bold,
    fontSize: fontSize.lg,
  },
  superLikeIndicator: {
    position: 'absolute',
    top: spacing.xl,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 3,
  },
  superLikeIndicatorText: {
    color: colors.tertiary,
    fontWeight: fontWeight.bold,
    fontSize: fontSize.lg,
    borderWidth: 4,
    borderColor: colors.tertiary,
    borderRadius: borderRadius.md,
    padding: spacing.xs,
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    paddingBottom: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
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
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsContainer: {
    padding: spacing.md,
    flex: 1,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  detailText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  bioTitle: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  bioText: {
    color: colors.text,
    fontSize: fontSize.sm,
    lineHeight: fontSize.md * 1.4,
  },
  interestsTitle: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  interestTag: {
    backgroundColor: colors.inputBackground,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  interestText: {
    color: colors.text,
    fontSize: fontSize.xs,
  },
  actionButtons: {
    position: 'absolute',
    bottom: spacing.xl,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    zIndex: 10,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  dislikeButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.error,
  },
  likeButton: {
    backgroundColor: colors.primary,
  },
  superLikeButton: {
    backgroundColor: colors.tertiary,
  },
  undoButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalCloseButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: spacing.md,
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  modalImageContainer: {
    height: '40%',
    width: '100%',
    backgroundColor: 'black',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalContent: {
    flex: 1,
    padding: spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  modalName: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginRight: spacing.xs,
  },
  modalVerifiedBadge: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalLocationText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  modalInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  modalInfoText: {
    fontSize: fontSize.md,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  modalSectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  modalBio: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: fontSize.md * 1.5,
    marginBottom: spacing.md,
  },
  modalInterests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  modalInterestTag: {
    backgroundColor: colors.inputBackground,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  modalInterestText: {
    color: colors.text,
    fontSize: fontSize.sm,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
    marginTop: 'auto',
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.md,
  },
  modalActionButton: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
  modalDislikeButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.error,
  },
  modalLikeButton: {
    backgroundColor: colors.primary,
  },
  modalSuperLikeButton: {
    backgroundColor: colors.tertiary,
  },
});