import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Message } from '@/types/user';
import { colors } from '@/constants/colors';
import { borderRadius, fontSize, spacing } from '@/constants/theme';
import { formatTime } from '@/utils/date';
import { Play } from 'lucide-react-native';

interface MessageBubbleProps {
  message: Message;
  isFromCurrentUser: boolean;
  showAvatar?: boolean;
  avatarUrl?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isFromCurrentUser,
  showAvatar = false,
  avatarUrl,
}) => {
  // Обеспечиваем совместимость между разными интерфейсами Message
  const messageContent = message.content || message.text || '';
  
  const renderMessageContent = () => {
    switch (message.type) {
      case 'text':
        return <Text style={[
          styles.messageText,
          isFromCurrentUser ? styles.currentUserText : styles.otherUserText
        ]}>{messageContent}</Text>;
      
      case 'image':
        return (
          <Image
            source={{ uri: message.mediaUrl }}
            style={styles.imageMessage}
            contentFit="cover"
          />
        );
      
      case 'voice':
        return (
          <View style={styles.voiceMessage}>
            <TouchableOpacity style={[
              styles.playButton,
              { backgroundColor: isFromCurrentUser ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)' }
            ]}>
              <Play size={16} color={isFromCurrentUser ? 'white' : colors.primary} />
            </TouchableOpacity>
            <View style={styles.voiceWaveform}>
              {/* Simplified waveform visualization */}
              {Array(10).fill(0).map((_, i) => (
                <View 
                  key={i} 
                  style={[
                    styles.waveformBar,
                    { 
                      height: 4 + Math.random() * 12,
                      backgroundColor: isFromCurrentUser ? 'white' : colors.primary 
                    }
                  ]} 
                />
              ))}
            </View>
            <Text style={[
              styles.voiceDuration,
              { color: isFromCurrentUser ? 'white' : colors.textSecondary }
            ]}>
              {message.duration ? `${message.duration}s` : '0:15'}
            </Text>
          </View>
        );
      
      case 'video':
        return (
          <View style={styles.videoContainer}>
            <Image
              source={{ uri: message.mediaUrl }}
              style={styles.videoThumbnail}
              contentFit="cover"
            />
            <View style={styles.videoPlayButton}>
              <Play size={24} color="white" />
            </View>
          </View>
        );
      
      default:
        return <Text style={[
          styles.messageText,
          isFromCurrentUser ? styles.currentUserText : styles.otherUserText
        ]}>{messageContent}</Text>;
    }
  };

  return (
    <View style={[
      styles.container,
      isFromCurrentUser ? styles.currentUserContainer : styles.otherUserContainer
    ]}>
      {!isFromCurrentUser && showAvatar && (
        <Image
          source={{ uri: avatarUrl }}
          style={styles.avatar}
          contentFit="cover"
        />
      )}
      
      <View style={[
        styles.bubble,
        isFromCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
        message.type === 'image' && styles.imageBubble,
        message.type === 'video' && styles.imageBubble,
      ]}>
        {renderMessageContent()}
        
        <Text style={[
          styles.timestamp,
          isFromCurrentUser ? styles.currentUserTimestamp : styles.otherUserTimestamp
        ]}>
          {formatTime(new Date(message.timestamp))}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
    maxWidth: '80%',
  },
  currentUserContainer: {
    alignSelf: 'flex-end',
  },
  otherUserContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    marginRight: spacing.xs,
  },
  bubble: {
    padding: spacing.sm,
    borderRadius: borderRadius.lg,
    position: 'relative',
  },
  currentUserBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 0,
  },
  otherUserBubble: {
    backgroundColor: colors.inputBackground,
    borderBottomLeftRadius: 0,
  },
  imageBubble: {
    padding: 0,
    overflow: 'hidden',
  },
  messageText: {
    fontSize: fontSize.md,
  },
  currentUserText: {
    color: 'white',
  },
  otherUserText: {
    color: colors.text,
  },
  currentUserTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherUserTimestamp: {
    color: colors.textSecondary,
  },
  timestamp: {
    fontSize: fontSize.xs,
    alignSelf: 'flex-end',
    marginTop: spacing.xs,
  },
  imageMessage: {
    width: 200,
    height: 200,
    borderRadius: borderRadius.lg,
  },
  voiceMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 160,
    gap: spacing.xs,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceWaveform: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  waveformBar: {
    width: 3,
    borderRadius: 1.5,
  },
  voiceDuration: {
    fontSize: fontSize.xs,
    marginLeft: spacing.xs,
  },
  videoContainer: {
    position: 'relative',
  },
  videoThumbnail: {
    width: 200,
    height: 150,
    borderRadius: borderRadius.lg,
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
    borderRadius: borderRadius.lg,
  },
});