import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView,
  Platform,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Search, X } from 'lucide-react-native';
import { useMatchesStore } from '@/store/matches-store';
import { mockUsers } from '@/mocks/users';
import { MatchCard } from '@/components/MatchCard';
import { colors } from '@/constants/colors';
import { borderRadius, fontSize, fontWeight, spacing } from '@/constants/theme';
import { translations } from '@/constants/translations';
import { useMatches } from '@/lib/api';
import { Match, User } from '@/types/user';

export default function MatchesScreen() {
  const router = useRouter();
  const { matches, messages } = useMatchesStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  // API hook
  const matchesQuery = useMatches();
  
  // Use data from API if available, fallback to store matches, or empty array if both are undefined
  const matchesList: Match[] = matchesQuery.data || matches || [];
  
  const getMatchedUser = (matchedUserId: string) => {
    return mockUsers.find(user => user.id === matchedUserId) || null;
  };
  
  const hasUnreadMessages = (matchId: string) => {
    const matchMessages = messages[matchId] || [];
    return matchMessages.some(
      message => message.receiverId === 'current-user' && !message.read
    );
  };
  
  const handleMatchPress = (matchId: string) => {
    // Navigate to chat screen with match ID
    router.push(`/chat/${matchId}`);
  };
  
  const filteredMatches = matchesList ? matchesList.filter(match => {
    const user = getMatchedUser(match.matchedUserId);
    if (!user) return false;
    
    if (!searchQuery) return true;
    
    return user.name.toLowerCase().includes(searchQuery.toLowerCase());
  }) : [];
  
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateTitle}>{translations.noMatches}</Text>
      <Text style={styles.emptyStateText}>
        {translations.noMatchesDesc}
      </Text>
    </View>
  );
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'auto'} />
        
        <View style={styles.header}>
          {showSearch ? (
            <View style={styles.searchContainer}>
              <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder={translations.searchPlaceholder}
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                returnKeyType="search"
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              <TouchableOpacity 
                onPress={() => {
                  setSearchQuery('');
                  setShowSearch(false);
                }}
              >
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.title}>{translations.messages}</Text>
              <TouchableOpacity 
                style={styles.searchButton}
                onPress={() => setShowSearch(true)}
              >
                <Search size={24} color={colors.text} />
              </TouchableOpacity>
            </>
          )}
        </View>
        
        {matchesList && matchesList.length > 0 ? (
          <FlatList
            data={filteredMatches}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => {
              const user = getMatchedUser(item.matchedUserId);
              if (!user) return null;
              
              // Make sure user has all required fields
              const validUser: User = {
                ...user,
                bio: user.bio || 'Нет информации',
                distance: user.distance || 0,
                gender: user.gender || 'other',
                lookingFor: user.lookingFor || 'all'
              };
              
              return (
                <MatchCard
                  match={item}
                  user={validUser}
                  onPress={() => handleMatchPress(item.id)}
                  hasUnreadMessages={hasUnreadMessages(item.id)}
                />
              );
            }}
            ListEmptyComponent={
              searchQuery ? (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>
                    {translations.noResults}
                  </Text>
                </View>
              ) : renderEmptyState()
            }
          />
        ) : (
          renderEmptyState()
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    paddingBottom: Platform.OS === 'ios' ? 90 : 70, // Add extra padding at bottom for tab bar
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
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === 'ios' ? spacing.sm : spacing.xs,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl, // Extra padding at bottom
  },
  emptyStateContainer: {
    flex: 1,
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
  },
  noResultsContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});