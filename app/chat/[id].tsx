import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Dimensions,
  Alert,
  Button
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { ArrowLeft, Phone, Video, Info } from 'lucide-react-native';
import { useMatchesStore } from '@/store/matches-store';
import { mockUsers } from '@/mocks/users';
import { Message, User } from '@/types/user';
import { MessageBubble } from '@/components/MessageBubble';
import { MessageInput } from '@/components/MessageInput';
import { colors } from '@/constants/colors';
import { borderRadius, fontSize, fontWeight, spacing } from '@/constants/theme';
import { formatDate } from '@/utils/date';
import { translations } from '@/constants/translations';
import { useMatch, useMessages, useSendMessage, useMarkMessagesAsRead } from '@/lib/api';
import * as ImagePicker from 'expo-image-picker';

const windowWidth = Dimensions.get('window').width;
const isWeb = Platform.OS === 'web';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { matches, messages, actions } = useMatchesStore();
  const flatListRef = useRef<FlatList>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const matchId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : '';
  
  // API hooks
  const matchQuery = useMatch(matchId);
  const messagesQuery = useMessages(matchId);
  const { sendMessage } = useSendMessage();
  const { markAsRead } = useMarkMessagesAsRead();
  
  // Use data from API if available
  const match = matchQuery.data?.match || matches.find(m => m.id === matchId);
  const matchMessages = messagesQuery.data || messages[matchId] || [];
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (!isLoading && !match) {
      Alert.alert(
        translations.error,
        'Чат не найден',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)/matches'),
          },
        ]
      );
    }
  }, [match, isLoading]);
  
  useEffect(() => {
    // Mark messages as read when opening chat
    if (matchId) {
      // Use API if available
      markAsRead({ matchId });
      
      // Also update local state
      if (actions && actions.markMessagesAsRead) {
        actions.markMessagesAsRead(matchId);
      }
    }
  }, [matchId]);
  
  useEffect(() => {
    // Добавляем тестовые сообщения только если их нет
    if (matchMessages.length === 0 && match) {
      const now = new Date();
      const testMsgs = [
        {
          id: 'test-1',
          matchId,
          senderId: 'current-user',
          receiverId: match.matchedUserId,
          content: 'Привет! Это тестовое текстовое сообщение.',
          timestamp: new Date(now.getTime() - 1000 * 60 * 60).toISOString(),
          read: true,
          type: 'text',
        },
        {
          id: 'test-2',
          matchId,
          senderId: match.matchedUserId,
          receiverId: 'current-user',
          content: 'А вот и фото!',
          mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
          timestamp: new Date(now.getTime() - 1000 * 60 * 50).toISOString(),
          read: true,
          type: 'image',
        },
        {
          id: 'test-3',
          matchId,
          senderId: 'current-user',
          receiverId: match.matchedUserId,
          content: 'Видео с отдыха',
          mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          timestamp: new Date(now.getTime() - 1000 * 60 * 40).toISOString(),
          read: true,
          type: 'video',
        },
        {
          id: 'test-4',
          matchId,
          senderId: match.matchedUserId,
          receiverId: 'current-user',
          content: '',
          mediaUrl: '',
          duration: 15,
          timestamp: new Date(now.getTime() - 1000 * 60 * 30).toISOString(),
          read: true,
          type: 'voice',
        },
      ];
      testMsgs.forEach(msg => actions.addMessage(matchId, msg));
    }
  }, [matchId, match]);
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  
  if (!match) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: colors.textSecondary, fontSize: 18 }}>Чат не найден...</Text>
        <Button title="К списку чатов" onPress={() => router.replace('/(tabs)/matches')} />
      </View>
    );
  }
  
  const matchedUserData = mockUsers.find(user => user.id === match.matchedUserId);
  // Make sure user has all required fields
  const matchedUser: User | undefined = matchedUserData ? {
    ...matchedUserData,
    bio: matchedUserData.bio || 'Нет информации',
    distance: matchedUserData.distance || 0
  } as User : undefined;
  
  // Group messages by date
  const groupedMessages: { [date: string]: Message[] } = {};
  matchMessages.forEach((message: Message) => {
    const date = formatDate(new Date(message.timestamp));
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });
  
  const groupedMessagesArray = Object.entries(groupedMessages).map(([date, messages]) => ({
    date,
    messages,
  }));
  
  const handleSendMessage = (text: string, type: 'text' | 'image' | 'voice' | 'video' = 'text') => {
    if (!match) return;
    
    // Create new message
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      matchId,
      senderId: 'current-user',
      receiverId: match.matchedUserId,
      content: text,
      timestamp: new Date().toISOString(),
      read: true,
      type,
    };
    
    // Send message via API
    sendMessage({
      matchId,
      receiverId: match.matchedUserId,
      text,
      type,
    });
    
    // Also update local state
    actions.addMessage(matchId, newMessage);
    
    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
    
    // Simulate reply after 1-3 seconds
    if (Math.random() > 0.3) {
      const replyDelay = 1000 + Math.random() * 2000;
      setTimeout(() => {
        const replies = [
          "Отлично!",
          "Мне бы хотелось узнать больше об этом.",
          "Интересно! Расскажи подробнее.",
          "Хаха, это забавно!",
          "Я как раз думал(а) о том же.",
          "Чем занимаешься в выходные?",
          "Ты был(а) в том новом ресторане в центре?",
          "Мне очень понравилось наше вчерашнее общение.",
          "Да, я согласен(на)!",
          "Это звучит здорово!",
          "Я бы с удовольствием встретился(лась) с тобой.",
          "Какие у тебя планы на вечер?",
          "Ты любишь путешествовать?",
          "Я недавно прочитал(а) интересную книгу об этом.",
          "Какую музыку ты слушаешь?",
        ];
        
        const replyMessage: Message = {
          id: `msg-${Date.now()}`,
          matchId,
          senderId: match.matchedUserId,
          receiverId: 'current-user',
          content: replies[Math.floor(Math.random() * replies.length)],
          timestamp: new Date().toISOString(),
          read: true,
          type: 'text',
        };
        
        // Update local state
        actions.addMessage(matchId, replyMessage);
        
        // Scroll to bottom again
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }, replyDelay);
    }
  };
  
  const handleSendMedia = async (type: 'image' | 'video') => {
    let result;
    if (type === 'image') {
      result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Videos });
    }
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      handleSendMessage(asset.uri, type);
    }
  };
  
  const handleSendVoice = () => {
    // Имитация голосового кружочка
    handleSendMessage('', 'voice');
  };
  
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color={colors.text} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.userInfo}
        onPress={() => router.push(`/profile/${matchedUser?.id}`)}
      >
        <Image
          source={{ uri: matchedUser?.photos[0] }}
          style={styles.avatar}
          contentFit="cover"
        />
        <Text style={styles.userName}>{matchedUser?.name}</Text>
      </TouchableOpacity>
      
      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.headerButton}>
          <Phone size={20} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton}>
          <Video size={20} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton}>
          <Info size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredContent}>
          <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'auto'} />
          <Stack.Screen options={{ headerShown: false }} />
          {renderHeader()}
          <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          >
            <FlatList
              ref={flatListRef}
              data={groupedMessagesArray}
              keyExtractor={(item) => item.date}
              contentContainerStyle={styles.messagesList}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <View>
                  <Text style={styles.dateHeader}>{item.date}</Text>
                  {item.messages.map((message: Message) => {
                    const isFromCurrentUser = message.senderId === 'current-user';
                    const showAvatar = !isFromCurrentUser && 
                      (index === 0 || 
                       item.messages[index - 1].senderId !== message.senderId);
                    
                    return (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        isFromCurrentUser={isFromCurrentUser}
                        showAvatar={showAvatar}
                        avatarUrl={matchedUser?.photos[0]}
                      />
                    );
                  })}
                </View>
              )}
              onContentSizeChange={() => 
                flatListRef.current?.scrollToEnd({ animated: false })
              }
            />
            
            <MessageInput 
              onSendMessage={handleSendMessage}
              onSendImage={() => handleSendMedia('image')}
              onSendVideo={() => handleSendMedia('video')}
              onSendVoice={handleSendVoice}
            />
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: isWeb ? 'center' : undefined,
    paddingHorizontal: isWeb ? 24 : 0,
  },
  centeredContent: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    backgroundColor: colors.background,
    borderRadius: isWeb ? 24 : 0,
    ...isWeb ? { boxShadow: '0 4px 32px rgba(0,0,0,0.10)' } : {},
    flex: 1,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  backButton: {
    padding: spacing.xs,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
  },
  userName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesList: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  dateHeader: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginVertical: spacing.md,
  },
  input: {
    minHeight: 48,
    maxHeight: 80,
    borderRadius: 24,
    fontSize: 18,
    paddingHorizontal: 20,
    ...isWeb ? { boxShadow: '0 2px 8px rgba(0,0,0,0.04)' } : {},
  },
  messageBubble: {
    borderRadius: 20,
    padding: 16,
    marginVertical: 6,
    ...isWeb ? { transition: 'box-shadow 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' } : {},
  },
});