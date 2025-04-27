import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  Platform,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, MessageCircle, Heart, User, Check } from 'lucide-react-native';
import { colors, gradients } from '@/constants/colors';
import { borderRadius, fontSize, fontWeight, spacing } from '@/constants/theme';
import { Button } from '@/components/Button';
import { useAuthStore } from '@/store/auth-store';
import { translations } from '@/constants/translations';
import { useLogin } from '@/lib/api';

const { width, height } = Dimensions.get('window');

const onboardingSteps = [
  {
    title: translations.findYourPerfectMatch,
    description: translations.findYourPerfectMatchDesc,
    image: "https://images.unsplash.com/photo-1516914589923-f105f1535f88?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    icon: <Heart size={24} color="white" />,
    gradient: gradients.primary,
  },
  {
    title: translations.chatAndConnect,
    description: translations.chatAndConnectDesc,
    image: "https://images.unsplash.com/photo-1516939884455-1445c8652f83?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    icon: <MessageCircle size={24} color="white" />,
    gradient: gradients.secondary,
  },
  {
    title: translations.createYourProfile,
    description: translations.createYourProfileDesc,
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    icon: <User size={24} color="white" />,
    gradient: gradients.ocean,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { login, setOnboarded } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));
  
  // API хук
  const { login: apiLogin, isLoading, error } = useLogin();
  
  const handleNext = () => {
    // Затухание
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      if (currentStep < onboardingSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
      
      // Появление
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };
  
  const handleComplete = async () => {
    try {
      // Имитируем вход через Telegram
      const telegramUser = {
        id: 'telegram123456',
        username: 'alexjohnson',
        firstName: 'Алекс',
        lastName: 'Иванов',
        photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      };
      
      // Пытаемся войти через API
      try {
        console.log("Attempting login with:", telegramUser);
        const result = await apiLogin(telegramUser);
        console.log("Login successful:", result);
        
        // Обновляем локальное состояние
        setOnboarded(true);
        login('current-user', telegramUser);
        
        // Переходим на главный экран
        router.replace('/(tabs)');
      } catch (error) {
        console.error('Ошибка при входе через API:', error);
        
        // Если API недоступно, используем локальную аутентификацию
        console.log("Falling back to local authentication");
        setOnboarded(true);
        login('current-user', telegramUser);
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Ошибка при входе:', error);
      Alert.alert('Ошибка', 'Не удалось войти. Пожалуйста, попробуйте снова.');
    }
  };
  
  const handleSkip = () => {
    // Для пропуска используем локальную аутентификацию
    const telegramUser = {
      id: 'telegram123456',
      username: 'alexjohnson',
      firstName: 'Алекс',
      lastName: 'Иванов',
      photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    };
    
    setOnboarded(true);
    login('current-user', telegramUser);
    router.replace('/(tabs)');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: onboardingSteps[currentStep].image }}
            style={styles.image}
            contentFit="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />
        </View>
        
        <View style={styles.stepsIndicator}>
          {onboardingSteps.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.stepDot,
                currentStep === index && styles.activeStepDot
              ]} 
            />
          ))}
        </View>
        
        <LinearGradient
          colors={onboardingSteps[currentStep].gradient}
          style={styles.iconContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {onboardingSteps[currentStep].icon}
        </LinearGradient>
        
        <Text style={styles.title}>{onboardingSteps[currentStep].title}</Text>
        <Text style={styles.description}>{onboardingSteps[currentStep].description}</Text>
        
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {error.message || "Произошла ошибка при подключении к серверу"}
            </Text>
          </View>
        )}
        
        <View style={styles.buttonsContainer}>
          <Button
            title={currentStep < onboardingSteps.length - 1 ? translations.next : translations.getStarted}
            onPress={handleNext}
            icon={<ArrowRight size={20} color="white" />}
            iconPosition="right"
            fullWidth
            loading={isLoading && currentStep === onboardingSteps.length - 1}
          />
          
          {currentStep < onboardingSteps.length - 1 && (
            <TouchableOpacity 
              style={styles.skipButton}
              onPress={handleSkip}
              disabled={isLoading}
            >
              <Text style={styles.skipText}>{translations.skip}</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.telegramContainer}>
          <LinearGradient
            colors={gradients.telegram}
            style={styles.telegramButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableOpacity 
              style={styles.telegramButtonContent}
              onPress={handleComplete}
              disabled={isLoading}
            >
              <Text style={styles.telegramText}>{translations.continueWithTelegram}</Text>
              <View style={styles.telegramCheck}>
                <Check size={16} color="white" />
              </View>
            </TouchableOpacity>
          </LinearGradient>
          <Text style={styles.privacyText}>
            {translations.termsAndPrivacy}
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.7,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  stepsIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: height * 0.5,
    gap: spacing.sm,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeStepDot: {
    backgroundColor: 'white',
    width: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    alignSelf: 'center',
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: 'white',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xl,
    textAlign: 'center',
  },
  description: {
    fontSize: fontSize.md,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: spacing.xl,
    lineHeight: fontSize.md * 1.5,
    paddingHorizontal: spacing.xl,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    padding: spacing.md,
    marginHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
  buttonsContainer: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  skipButton: {
    alignItems: 'center',
    padding: spacing.md,
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: fontSize.md,
  },
  telegramContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  telegramButton: {
    width: '100%',
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  telegramButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  telegramText: {
    color: 'white',
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  telegramCheck: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  privacyText: {
    fontSize: fontSize.xs,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
});