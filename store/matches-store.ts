import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Match, Message } from '@/types/user';
import { mockUsers } from '@/mocks/users';

// Mock matches for development
const mockMatches: Match[] = [
  {
    id: 'match-1',
    userId: 'current-user',
    matchedUserId: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    lastMessage: {
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      text: "Привет, как твои дела?",
      senderId: '1',
      read: false,
    },
  },
  {
    id: 'match-2',
    userId: 'current-user',
    matchedUserId: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    lastMessage: {
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
      text: "Давно не виделись! Как дела?",
      senderId: '2',
      read: false,
    },
  },
  {
    id: 'match-3',
    userId: 'current-user',
    matchedUserId: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
    lastMessage: {
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      text: "Мне тоже нравится этот фильм!",
      senderId: '3',
      read: false,
    },
  },
  {
    id: 'match-4',
    userId: 'current-user',
    matchedUserId: '4',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    lastMessage: {
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      text: "Какие у тебя планы на выходные?",
      senderId: 'current-user',
      read: true,
    },
  },
  {
    id: 'match-5',
    userId: 'current-user',
    matchedUserId: '5',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    lastMessage: {
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
      text: "Это здорово! 😊",
      senderId: '5',
      read: false,
    },
  },
  {
    id: 'match-6',
    userId: 'current-user',
    matchedUserId: '6',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
    lastMessage: {
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
      text: "Буду там в 19:00",
      senderId: '6',
      read: true,
    },
  },
];

// Mock messages for development
const mockMessages: Record<string, Message[]> = {
  'match-1': [
    {
      id: 'msg-1-1',
      matchId: 'match-1',
      senderId: '1',
      receiverId: 'current-user',
      content: "Привет! Я заметила, что тебе тоже нравится ходить в походы. Какой твой любимый маршрут?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      read: true,
      type: 'text',
    },
    {
      id: 'msg-1-2',
      matchId: 'match-1',
      senderId: 'current-user',
      receiverId: '1',
      content: "Привет! Обожаю горные тропы недалеко от города. Ты была на Орлиной вершине?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(), // 23 hours ago
      read: true,
      type: 'text',
    },
    {
      id: 'msg-1-3',
      matchId: 'match-1',
      senderId: '1',
      receiverId: 'current-user',
      content: "Еще нет, но слышала, что там потрясающе! Хочешь сходить вместе?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(), // 22 hours ago
      read: true,
      type: 'text',
    },
    {
      id: 'msg-1-4',
      matchId: 'match-1',
      senderId: 'current-user',
      receiverId: '1',
      content: "Конечно! Как насчет следующих выходных? Погода обещает быть отличной.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 21).toISOString(), // 21 hours ago
      read: true,
      type: 'text',
    },
    {
      id: 'msg-1-5',
      matchId: 'match-1',
      senderId: '1',
      receiverId: 'current-user',
      content: "Звучит здорово! Я свободна в субботу. Во сколько хочешь встретиться?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(), // 20 hours ago
      read: true,
      type: 'text',
    },
    {
      id: 'msg-1-6',
      matchId: 'match-1',
      senderId: 'current-user',
      receiverId: '1',
      content: "Давай в 9 утра? Можем встретиться у начала тропы. Я возьму термос с кофе и бутерброды.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 19).toISOString(), // 19 hours ago
      read: true,
      type: 'text',
    },
    {
      id: 'msg-1-7',
      matchId: 'match-1',
      senderId: '1',
      receiverId: 'current-user',
      content: "Идеально! Я принесу фрукты и воду. Не могу дождаться нашего похода! 🏔️",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago
      read: true,
      type: 'text',
    },
    {
      id: 'msg-1-8',
      matchId: 'match-1',
      senderId: 'current-user',
      receiverId: '1',
      content: "Я тоже! Это будет весело. Кстати, у тебя есть треккинговые палки?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 17).toISOString(), // 17 hours ago
      read: true,
      type: 'text',
    },
    {
      id: 'msg-1-9',
      matchId: 'match-1',
      senderId: '1',
      receiverId: 'current-user',
      content: "Да, у меня есть пара. А у тебя хорошие ботинки для походов?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
      read: true,
      type: 'text',
    },
    {
      id: 'msg-1-10',
      matchId: 'match-1',
      senderId: 'current-user',
      receiverId: '1',
      content: "Да, недавно купил новые. Они уже разношены и очень удобные.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5).toISOString(), // 2.5 hours ago
      read: true,
      type: 'text',
    },
    {
      id: 'msg-1-11',
      matchId: 'match-1',
      senderId: '1',
      receiverId: 'current-user',
      content: "Привет, как твои дела?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      read: false,
      type: 'text',
    },
  ],
  'match-2': [
    {
      id: 'msg-2-1',
      matchId: 'match-2',
      senderId: '2',
      receiverId: 'current-user',
      content: "Привет! Я вижу, ты увлекаешься фотографией. Какой камерой ты пользуешься?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
      read: true,
      type: 'text',
    },
    {
      id: 'msg-2-2',
      matchId: 'match-2',
      senderId: 'current-user',
      receiverId: '2',
      content: "Привет! Я использую Sony Alpha для большинства своих снимков. А ты фотографируешь?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 36 hours ago
      read: true,
      type: 'text',
    },
    {
      id: 'msg-2-3',
      matchId: 'match-2',
      senderId: '2',
      receiverId: 'current-user',
      content: "Да, но я больше любитель с iPhone. Твоя галерея выглядит профессионально!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 24 hours ago
      read: true,
      type: 'text',
    },
    {
      id: 'msg-2-4',
      matchId: 'match-2',
      senderId: 'current-user',
      receiverId: '2',
      content: "Может встретимся на выходных? Есть отличное место для фото закатов у озера.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 24 hours ago
      read: true,
      type: 'text',
    },
  ],
  'match-3': [
    {
      id: 'msg-3-1',
      matchId: 'match-3',
      senderId: '3',
      receiverId: 'current-user',
      content: "Привет! Я инструктор по йоге. Ты когда-нибудь пробовал медитацию?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
      read: true,
      type: 'text',
    },
    {
      id: 'msg-3-2',
      matchId: 'match-3',
      senderId: 'current-user',
      receiverId: '3',
      content: "Привет! Да, но нерегулярно. Хотел бы научиться делать это правильно.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 11).toISOString(), // 11 hours ago
      read: true,
      type: 'text',
    },
    {
      id: 'msg-3-3',
      matchId: 'match-3',
      senderId: '3',
      receiverId: 'current-user',
      content: "Я могу помочь! У меня есть онлайн-курс для начинающих. Могу отправить тебе ссылку.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(), // 10 hours ago
      read: true,
      type: 'text',
    },
    {
      id: 'msg-3-4',
      matchId: 'match-3',
      senderId: 'current-user',
      receiverId: '3',
      content: "Это было бы здорово! Кстати, я недавно посмотрел документальный фильм о йоге в Индии.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(), // 9 hours ago
      read: true,
      type: 'text',
    },
    {
      id: 'msg-3-5',
      matchId: 'match-3',
      senderId: '3',
      receiverId: 'current-user',
      content: "О, какой именно? Я обожаю документалки о йоге!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
      read: true,
      type: 'text',
    },
    {
      id: 'msg-3-6',
      matchId: 'match-3',
      senderId: 'current-user',
      receiverId: '3',
      content: "Он называется 'Дыхание'. Очень вдохновляющий фильм о духовных практиках.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(), // 7 hours ago
      read: true,
      type: 'text',
    },
    {
      id: 'msg-3-7',
      matchId: 'match-3',
      senderId: '3',
      receiverId: 'current-user',
      content: "Мне тоже нравится этот фильм!",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      read: false,
      type: 'text',
    },
    {
      id: 'msg-3-8',
      matchId: 'match-3',
      senderId: '3',
      receiverId: 'current-user',
      content: "Послушай мою медитацию для начинающих",
      timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(), // 20 minutes ago
      read: false,
      type: 'voice',
      duration: 45,
      mediaUrl: "https://example.com/meditation.mp3"
    },
  ],
  'match-5': [
    {
      id: 'msg-5-1',
      matchId: 'match-5',
      senderId: '5',
      receiverId: 'current-user',
      content: "Привет! Я куратор художественной галереи. Какое искусство тебе нравится?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      read: true,
      type: 'text',
    },
    {
      id: 'msg-5-2',
      matchId: 'match-5',
      senderId: 'current-user',
      receiverId: '5',
      content: "Привет! Я больше всего люблю импрессионизм и современное искусство. А ты?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
      read: true,
      type: 'text',
    },
    {
      id: 'msg-5-3',
      matchId: 'match-5',
      senderId: '5',
      receiverId: 'current-user',
      content: "Я обожаю абстрактный экспрессионизм! В нашей галерее сейчас проходит выставка работ молодых художников этого направления.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
      read: true,
      type: 'text',
    },
    {
      id: 'msg-5-4',
      matchId: 'match-5',
      senderId: 'current-user',
      receiverId: '5',
      content: "Звучит интересно! Я бы с удовольствием посетил эту выставку. Когда она открыта?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      read: true,
      type: 'text',
    },
    {
      id: 'msg-5-5',
      matchId: 'match-5',
      senderId: '5',
      receiverId: 'current-user',
      content: "Ежедневно с 10 до 20. Если хочешь, я могу провести для тебя персональную экскурсию в четверг вечером после закрытия.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // 1 hour ago
      read: true,
      type: 'text',
    },
    {
      id: 'msg-5-6',
      matchId: 'match-5',
      senderId: 'current-user',
      receiverId: '5',
      content: "Вау, это было бы потрясающе! Я свободен в четверг вечером.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      read: true,
      type: 'text',
    },
    {
      id: 'msg-5-7',
      matchId: 'match-5',
      senderId: '5',
      receiverId: 'current-user',
      content: "Это здорово! 😊",
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
      read: false,
      type: 'text',
    },
    {
      id: 'msg-5-8',
      matchId: 'match-5',
      senderId: '5',
      receiverId: 'current-user',
      content: "Вот одна из работ, которая будет на выставке",
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      read: false,
      type: 'image',
      mediaUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YWJzdHJhY3QlMjBhcnR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
    },
  ],
};

interface MatchesState {
  matches: Match[];
  messages: Record<string, Message[]>;
  newMatchId: string | null;
  unreadCounts: Record<string, number>;
  actions: {
    addMatch: (match: Match) => void;
    removeMatch: (matchId: string) => void;
    updateMatch: (matchId: string, updates: Partial<Match>) => void;
    setNewMatchId: (matchId: string | null) => void;
    addMessage: (matchId: string, message: Message) => void;
    markMessagesAsRead: (matchId: string) => void;
    getUnreadCount: (matchId: string) => number;
    getTotalUnreadCount: () => number;
  };
}

export const useMatchesStore = create<MatchesState>()(
  persist(
    (set, get) => ({
      matches: mockMatches,
      messages: mockMessages,
      newMatchId: null,
      unreadCounts: {
        'match-1': 1,
        'match-3': 2, // Обновлено для голосового сообщения
        'match-5': 2, // Обновлено для изображения
      },
      actions: {
        addMatch: (match: Match) => {
          set((state) => ({
            matches: [match, ...state.matches],
            newMatchId: match.id,
          }));
        },
        removeMatch: (matchId: string) => {
          set((state) => ({
            matches: state.matches.filter((match) => match.id !== matchId),
            messages: Object.fromEntries(
              Object.entries(state.messages).filter(([key]) => key !== matchId)
            ),
          }));
        },
        updateMatch: (matchId: string, updates: Partial<Match>) => {
          set((state) => ({
            matches: state.matches.map((match) =>
              match.id === matchId ? { ...match, ...updates } : match
            ),
          }));
        },
        setNewMatchId: (matchId: string | null) => {
          set({ newMatchId: matchId });
        },
        addMessage: (matchId: string, message: Message) => {
          set((state) => {
            // Update messages
            const existingMessages = state.messages[matchId] || [];
            const updatedMessages = {
              ...state.messages,
              [matchId]: [...existingMessages, message],
            };
            
            // Update unread counts if the message is from the other user
            const unreadCounts = { ...state.unreadCounts };
            if (message.senderId !== 'current-user' && !message.read) {
              unreadCounts[matchId] = (unreadCounts[matchId] || 0) + 1;
            }
            
            // Update match with last message
            const updatedMatches = state.matches.map((match) => {
              if (match.id === matchId) {
                return {
                  ...match,
                  lastMessage: {
                    timestamp: message.timestamp,
                    text: message.content,
                    senderId: message.senderId,
                    read: message.read,
                  },
                };
              }
              return match;
            });
            
            return {
              messages: updatedMessages,
              matches: updatedMatches,
              unreadCounts,
            };
          });
        },
        markMessagesAsRead: (matchId: string) => {
          set((state) => {
            // Mark all messages in the match as read
            const matchMessages = state.messages[matchId] || [];
            const updatedMessages = matchMessages.map((msg) => ({
              ...msg,
              read: true,
            }));
            
            // Reset unread count for this match
            const unreadCounts = { ...state.unreadCounts };
            unreadCounts[matchId] = 0;
            
            // Update last message read status if it exists
            const updatedMatches = state.matches.map((match) => {
              if (match.id === matchId && match.lastMessage) {
                return {
                  ...match,
                  lastMessage: {
                    ...match.lastMessage,
                    read: true,
                  },
                };
              }
              return match;
            });
            
            return {
              messages: {
                ...state.messages,
                [matchId]: updatedMessages,
              },
              matches: updatedMatches,
              unreadCounts,
            };
          });
        },
        getUnreadCount: (matchId: string) => {
          return get().unreadCounts[matchId] || 0;
        },
        getTotalUnreadCount: () => {
          const counts = get().unreadCounts;
          return Object.values(counts).reduce((total, count) => total + count, 0);
        },
      },
    }),
    {
      name: 'matches-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        matches: state.matches,
        messages: state.messages,
        unreadCounts: state.unreadCounts,
      }),
    }
  )
);