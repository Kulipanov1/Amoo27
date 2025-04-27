import React, { useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Modal, 
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { User } from '@/types/user';
import { colors, gradients } from '@/constants/colors';
import { borderRadius, fontSize, fontWeight, spacing } from '@/constants/theme';
import { Button } from './Button';
import { MessageCircle, X } from 'lucide-react-native';
import { translations } from '@/constants/translations';

const { width, height } = Dimensions.get('window');

interface MatchModalProps {
  visible: boolean;
  currentUser: User | null;
  matchedUser: User | null;
  matchId: string | null;
  onClose: () => void;
  onSendMessage: (matchId: string) => void;
  onKeepSwiping: () => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({
  visible,
  currentUser,
  matchedUser,
  matchId,
  onClose,
  onSendMessage,
  onKeepSwiping,
}) => {
  // Animation values
  const scaleAnim = React.useRef(new Animated.Value(0.5)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;
  const confettiAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0.5);
      opacityAnim.setValue(0);
      confettiAnim.setValue(0);
      
      // Start animations
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(confettiAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!matchedUser || !currentUser || !matchId) return null;

  const handleSendMessageClick = () => {
    onSendMessage(matchId);
  };

  // Generate confetti pieces
  const confettiPieces = Array(30).fill(0).map((_, i) => {
    const size = 8 + Math.random() * 12;
    const initialX = width / 2;
    const initialY = height / 2;
    const finalX = initialX + (Math.random() - 0.5) * width * 1.5;
    const finalY = initialY + (Math.random() * height * 0.7);
    const rotation = Math.random() * 360;
    const color = [
      colors.primary,
      colors.secondary,
      colors.tertiary,
      colors.quaternary,
      '#FF4500', // Orange-red
    ][Math.floor(Math.random() * 5)];
    
    const translateX = confettiAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [initialX, finalX],
    });
    
    const translateY = confettiAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [initialY, finalY],
    });
    
    const rotate = confettiAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', `${rotation}deg`],
    });
    
    return (
      <Animated.View
        key={i}
        style={[
          styles.confettiPiece,
          {
            width: size,
            height: size,
            backgroundColor: color,
            transform: [
              { translateX },
              { translateY },
              { rotate },
              { scale: confettiAnim },
            ],
          },
        ]}
      />
    );
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        {/* Confetti animation */}
        {confettiPieces}
        
        <Animated.View 
          style={[
            styles.modalContent,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={gradients.sunset}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.matchText}>{translations.itsAMatch}</Text>
            <Text style={styles.matchSubtext}>
              {translations.youAndXLikedEachOther.replace('{name}', matchedUser.name)}
            </Text>
          </LinearGradient>
          
          <View style={styles.profilesContainer}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: currentUser.photos[0] }}
                style={styles.profileImage}
                contentFit="cover"
              />
            </View>
            
            <View style={styles.heartContainer}>
              <View style={styles.heart} />
            </View>
            
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: matchedUser.photos[0] }}
                style={styles.profileImage}
                contentFit="cover"
              />
            </View>
          </View>
          
          <View style={styles.actionsContainer}>
            <Button
              title={translations.sendMessage}
              onPress={handleSendMessageClick}
              icon={<MessageCircle size={20} color="white" />}
              fullWidth
            />
            
            <Button
              title={translations.keepSwiping}
              variant="outline"
              onPress={onKeepSwiping}
              style={styles.keepSwipingButton}
              fullWidth
            />
          </View>
          
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  header: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  matchText: {
    color: 'white',
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs,
  },
  matchSubtext: {
    color: 'white',
    fontSize: fontSize.md,
    textAlign: 'center',
  },
  profilesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.card,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  heartContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    marginHorizontal: -10,
  },
  heart: {
    backgroundColor: colors.primary,
    width: 30,
    height: 30,
    transform: [{ rotate: '45deg' }],
    borderRadius: 5,
    position: 'relative',
  },
  actionsContainer: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  keepSwipingButton: {
    marginTop: spacing.xs,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confettiPiece: {
    position: 'absolute',
    borderRadius: 2,
  },
});