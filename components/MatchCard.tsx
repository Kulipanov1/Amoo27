import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { User, Match } from '@/types/user';
import { colors } from '@/constants/colors';
import { borderRadius, fontSize, fontWeight, shadows, spacing } from '@/constants/theme';
import { formatDistanceToNow } from '@/utils/date';
import { translations } from '@/constants/translations';

interface MatchCardProps {
  match: Match;
  user: User;
  onPress: () => void;
  hasUnreadMessages?: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  user,
  onPress,
  hasUnreadMessages = false,
}) => {
  const lastMessage = match.lastMessage;
  const isLastMessageFromMatch = lastMessage?.senderId === user.id;
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: user.photos[0] }}
        style={styles.avatar}
        contentFit="cover"
      />
      
      {hasUnreadMessages && <View style={styles.unreadBadge} />}
      
      <View style={styles.content}>
        <Text style={styles.name}>{user.name}</Text>
        
        {lastMessage ? (
          <View style={styles.messageContainer}>
            {isLastMessageFromMatch ? null : (
              <Text style={styles.youText}>Вы: </Text>
            )}
            <Text 
              style={[
                styles.message, 
                hasUnreadMessages && styles.unreadMessage
              ]}
              numberOfLines={1}
            >
              {lastMessage.text}
            </Text>
          </View>
        ) : (
          <Text style={styles.newMatch}>{translations.newMatch}</Text>
        )}
      </View>
      
      <Text style={styles.time}>
        {lastMessage 
          ? formatDistanceToNow(new Date(lastMessage.timestamp))
          : formatDistanceToNow(new Date(match.timestamp))}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    ...shadows.small,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
  },
  unreadBadge: {
    position: 'absolute',
    top: spacing.md + 5,
    left: spacing.md + 50,
    width: 14,
    height: 14,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.card,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  messageContainer: {
    flexDirection: 'row',
  },
  youText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  message: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  unreadMessage: {
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  newMatch: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  time: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
});