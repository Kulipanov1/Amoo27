import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Platform, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { User, Gender, LookingFor } from '@/types/user';
import { useUserStore } from '@/store/user-store';
import { useMatchesStore } from '@/store/matches-store';
import { mockUsers } from '@/mocks/users';
import { ProfileCard } from '@/components/ProfileCard';
import { MatchModal } from '@/components/MatchModal';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/theme';
import { Button } from '@/components/Button';
import { RefreshCw } from 'lucide-react-native';
import { translations } from '@/constants/translations';
import { usePotentialMatches, useLikeUser, useDislikeUser, useSuperLikeUser } from '@/lib/api';

function AmooLogo() {
  return (
    <Text style={{ fontSize: 28, fontWeight: '700', color: colors.primary, textAlign: 'center' }}>Amoo</Text>
  );
}

export default function DiscoverScreen() {
  const router = useRouter();
  
  // Get store state and actions
  const { 
    potentialMatches, 
    likedUsers, 
    dislikedUsers, 
    superLikedUsers,
    addLikedUser,
    addDislikedUser,
    addSuperLikedUser,
    setPotentialMatches,
    resetSwipes
  } = useUserStore();
  
  const { matches, newMatchId, actions: matchActions } = useMatchesStore();
  
  // API hooks
  const potentialMatchesQuery = usePotentialMatches();
  const { likeUser } = useLikeUser();
  const { dislikeUser } = useDislikeUser();
  const { superLikeUser } = useSuperLikeUser();
  
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const [currentMatchId, setCurrentMatchId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'current-user',
    name: 'Вы',
    age: 28,
    bio: 'Ваш профиль',
    location: 'Москва',
    distance: 0,
    photos: ['https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'],
    interests: ['Amoo', 'Новые люди'],
    verified: true,
    gender: 'male' as Gender, // Fixed type
    lookingFor: 'all' as LookingFor, // Fixed type
  });
  const [previousUsers, setPreviousUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize potential matches if empty
    if (potentialMatches.length === 0) {
      setIsLoading(true);
      setError(null);
      
      // Use mock data while waiting for API
      const validMockUsers = mockUsers.map(user => ({
        ...user,
        bio: user.bio || 'Нет информации',
        distance: typeof user.distance === 'number' ? user.distance : 0,
        verified: user.verified || false,
        interests: user.interests || [],
        gender: (user.gender as Gender) || 'other',
        lookingFor: (user.lookingFor as LookingFor) || 'all'
      })) as User[];
      
      setPotentialMatches(validMockUsers);
      setIsLoading(false);
      
      // Try to fetch from API but don't wait for it
      potentialMatchesQuery.refetch()
        .then(result => {
          if (result.data && result.data.length > 0) {
            try {
              // Make sure all required fields are present
              const validUsers = result.data.map(user => ({
                ...user,
                bio: user.bio || 'Нет информации',
                distance: typeof user.distance === 'number' ? user.distance : 0,
                verified: user.verified || false,
                interests: user.interests || [],
                gender: (user.gender as Gender) || 'other',
                lookingFor: (user.lookingFor as LookingFor) || 'all'
              })) as User[];
              setPotentialMatches(validUsers);
            } catch (err) {
              console.error("Error processing potential matches data:", err);
              // Already using mock data, so no need to set again
            }
          }
        })
        .catch(err => {
          console.error("Error fetching potential matches:", err);
          // Already using mock data, so no need to set again
        });
    }
  }, []);

  const handleSwipeLeft = () => {
    if (potentialMatches.length > 0) {
      const userId = potentialMatches[0].id;
      // Save current user before removing
      setPreviousUsers(prev => [potentialMatches[0], ...prev].slice(0, 10));
      
      // Add to disliked and remove from potential matches
      addDislikedUser(userId);
      setPotentialMatches(potentialMatches.slice(1));
      
      // Call API
      dislikeUser({ dislikedUserId: userId })
        .catch(err => {
          console.error("Error disliking user:", err);
          // Already updated UI, so no need to handle error
        });
    }
  };

  const handleSwipeRight = () => {
    if (potentialMatches.length > 0) {
      const userId = potentialMatches[0].id;
      setPreviousUsers(prev => [potentialMatches[0], ...prev].slice(0, 10));
      addLikedUser(userId);
      setPotentialMatches(potentialMatches.slice(1));
      likeUser({ likedUserId: userId })
        .then(data => {
          if (data?.match) {
            createMatch(userId, data.match.id);
          }
        })
        .catch(err => {
          setError('Ошибка при лайке. Попробуйте позже.');
          Alert.alert('Ошибка', 'Ошибка при лайке. Попробуйте позже.');
        });
    }
  };

  const handleSuperLike = () => {
    if (potentialMatches.length > 0) {
      const userId = potentialMatches[0].id;
      // Save current user before removing
      setPreviousUsers(prev => [potentialMatches[0], ...prev].slice(0, 10));
      
      // Add to super likes and remove from potential matches
      addSuperLikedUser(userId);
      setPotentialMatches(potentialMatches.slice(1));
      
      // First update UI, then make API call
      superLikeUser({ superLikedUserId: userId })
        .then(data => {
          // If there's a match, show modal
          if (data?.match) {
            createMatch(userId, data.match.id);
          }
        })
        .catch(err => {
          console.error("Error super liking user:", err);
          // Simulate match for demo purposes
          if (Math.random() < 0.5) {
            createMatch(userId);
          }
        });
    }
  };

  const handleUndoSwipe = () => {
    if (previousUsers.length > 0) {
      // Get the most recent user from history
      const previousUser = previousUsers[0];
      // Add them back to potential matches
      setPotentialMatches([previousUser, ...potentialMatches]);
      // Remove from history
      setPreviousUsers(prev => prev.slice(1));
    }
  };

  const createMatch = (userId: string, matchId?: string) => {
    const matchedUserData = mockUsers.find(user => user.id === userId) || potentialMatches.find(user => user.id === userId);
    if (matchedUserData) {
      const newMatch = {
        id: matchId || `match-${Date.now()}`,
        userId: 'current-user',
        matchedUserId: userId,
        timestamp: new Date().toISOString(),
      };
      
      matchActions.addMatch(newMatch);
      setMatchedUser({
        ...matchedUserData,
        bio: matchedUserData.bio || 'Нет информации',
        distance: typeof matchedUserData.distance === 'number' ? matchedUserData.distance : 0,
        verified: matchedUserData.verified || false,
        interests: matchedUserData.interests || [],
        gender: (matchedUserData.gender as Gender) || 'other',
        lookingFor: (matchedUserData.lookingFor as LookingFor) || 'all'
      });
      setCurrentMatchId(newMatch.id);
      setShowMatchModal(true);
    }
  };

  const handleViewProfile = () => {
    if (potentialMatches.length > 0) {
      // Navigate to detailed profile view
      router.push(`/profile/${potentialMatches[0].id}`);
    }
  };

  const handleSendMessage = (matchId: string) => {
    setShowMatchModal(false);
    router.push(`/chat/${matchId}`);
  };

  const handleKeepSwiping = () => {
    setShowMatchModal(false);
  };

  const handleRefresh = () => {
    // Reset swipes and refresh potential matches
    setIsLoading(true);
    setError(null);
    resetSwipes();
    
    // First set mock data for immediate feedback
    const validMockUsers = mockUsers.map(user => ({
      ...user,
      bio: user.bio || 'Нет информации',
      distance: typeof user.distance === 'number' ? user.distance : 0,
      verified: user.verified || false,
      interests: user.interests || [],
      gender: (user.gender as Gender) || 'other',
      lookingFor: (user.lookingFor as LookingFor) || 'all'
    })) as User[];
    
    setPotentialMatches(validMockUsers);
    setIsLoading(false);
    
    // Then try to fetch from API
    potentialMatchesQuery.refetch()
      .then(result => {
        if (result.data && result.data.length > 0) {
          try {
            const validUsers = result.data.map(user => ({
              ...user,
              bio: user.bio || 'Нет информации',
              distance: typeof user.distance === 'number' ? user.distance : 0,
              verified: user.verified || false,
              interests: user.interests || [],
              gender: (user.gender as Gender) || 'other',
              lookingFor: (user.lookingFor as LookingFor) || 'all'
            })) as User[];
            setPotentialMatches(validUsers);
          } catch (err) {
            console.error("Error processing potential matches data:", err);
            // Already using mock data, so no need to set again
          }
        }
      })
      .catch(err => {
        console.error("Error refreshing potential matches:", err);
        // Already using mock data, so no need to set again
      });
  };

  if (potentialMatches.length === 0 && !isLoading) {
    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateTitle}>{translations.noMoreProfiles}</Text>
        <Text style={styles.emptyStateText}>{translations.noMoreProfilesDesc}</Text>
        <Button title="Обновить" onPress={handleRefresh} />
      </View>
    );
  }
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>{translations.loading}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'auto'} />
      
      {/* App Logo */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <AmooLogo />
        </View>
      </View>
      
      <View style={styles.cardsContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>{translations.loading}</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Button
              title={translations.tryAgain}
              onPress={handleRefresh}
              style={styles.refreshButton}
            />
          </View>
        ) : potentialMatches.length > 0 ? (
          <>
            {/* Show top 3 cards for better UX */}
            {potentialMatches.slice(0, 3).map((user, index) => (
              <ProfileCard
                key={user.id}
                user={user}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                onSuperLike={handleSuperLike}
                onViewProfile={handleViewProfile}
                onUndoSwipe={previousUsers.length > 0 ? handleUndoSwipe : undefined}
                isFirst={index === 0}
              />
            ))}
          </>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateTitle}>{translations.noMoreProfiles}</Text>
            <Text style={styles.emptyStateText}>
              {translations.noMoreProfilesDesc}
            </Text>
            <Button
              title={translations.refresh}
              onPress={handleRefresh}
              icon={<RefreshCw size={20} color="white" />}
              style={styles.refreshButton}
            />
          </View>
        )}
      </View>
      
      <MatchModal
        visible={showMatchModal}
        currentUser={currentUser}
        matchedUser={matchedUser}
        matchId={currentMatchId}
        onClose={() => setShowMatchModal(false)}
        onSendMessage={handleSendMessage}
        onKeepSwiping={handleKeepSwiping}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100, // Add extra padding at bottom for tab bar
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  refreshButton: {
    marginTop: spacing.md,
  },
});