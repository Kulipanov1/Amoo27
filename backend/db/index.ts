import { User, Match, Message, LiveStream } from "../models/types";
import { mockUsers } from "@/mocks/users";

// Моковая база данных для демонстрации
class MockDatabase {
  private users: User[] = [];
  private sessions: { token: string; userId: string; expiresAt: string }[] = [];
  private matches: Match[] = [];
  private messages: Message[] = [];
  private livestreams: LiveStream[] = [];
  private preferences: Record<string, any> = {};

  constructor() {
    // Инициализируем базу данных моковыми данными
    this.users = mockUsers.map(user => ({
      ...user,
      bio: user.bio || "No bio available",
      distance: user.distance || 0,
      verified: user.verified || false,
      interests: user.interests || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    // Создаем несколько моковых совпадений
    this.matches = [
      {
        id: "match1",
        userId: "user1",
        matchedUserId: "user2",
        timestamp: new Date().toISOString(),
        lastMessage: {
          timestamp: new Date().toISOString(),
          text: "Привет, как дела?",
          senderId: "user2",
        },
      },
      {
        id: "match2",
        userId: "user1",
        matchedUserId: "user3",
        timestamp: new Date().toISOString(),
      },
    ];

    // Создаем несколько моковых сообщений
    this.messages = [
      {
        id: "message1",
        matchId: "match1",
        senderId: "user2",
        receiverId: "user1",
        text: "Привет, как дела?",
        timestamp: new Date().toISOString(),
        read: true,
        type: "text",
      },
      {
        id: "message2",
        matchId: "match1",
        senderId: "user1",
        receiverId: "user2",
        text: "Привет! Все хорошо, спасибо!",
        timestamp: new Date().toISOString(),
        read: true,
        type: "text",
      },
    ];

    // Создаем несколько моковых трансляций
    this.livestreams = [
      {
        id: "stream1",
        userId: "user2",
        title: "Мое путешествие в горы",
        description: "Расскажу о своем походе в горы",
        status: "live",
        startedAt: new Date().toISOString(),
        viewerCount: 15,
        likeCount: 5,
        commentCount: 3,
      },
      {
        id: "stream2",
        userId: "user3",
        title: "Мастер-класс по йоге",
        description: "Базовые асаны для начинающих",
        status: "scheduled",
        scheduledFor: new Date(Date.now() + 86400000).toISOString(), // Завтра
        viewerCount: 0,
        likeCount: 0,
        commentCount: 0,
      },
    ];

    // Создаем моковые предпочтения
    this.preferences = {
      user1: {
        ageRange: [25, 35],
        distance: 20,
        gender: "female",
        showMe: "all",
      },
    };

    // Создаем моковую сессию для демонстрации
    this.sessions = [
      {
        token: "demo-token",
        userId: "user1",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 дней
      },
    ];
  }

  // Методы для работы с пользователями
  async getUserById(userId: string): Promise<User | null> {
    const user = this.users.find(u => u.id === userId);
    return user || null;
  }

  async getUserByTelegramId(telegramId: string): Promise<User | null> {
    const user = this.users.find(u => u.telegramUsername === telegramId);
    return user || null;
  }

  async createUser(user: Partial<User>): Promise<User> {
    const newUser: User = {
      id: `user${this.users.length + 1}`,
      name: user.name || "Новый пользователь",
      age: user.age || 25,
      bio: user.bio || "Нет информации",
      location: user.location || "Москва",
      distance: user.distance || 0,
      photos: user.photos || [],
      interests: user.interests || [],
      verified: user.verified || false,
      gender: user.gender,
      lookingFor: user.lookingFor,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    return newUser;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return null;

    const updatedUser = {
      ...this.users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return this.users;
  }

  async getUserFollowers(userId: string): Promise<string[]> {
    // В реальном приложении здесь был бы запрос к базе данных
    // Для демонстрации возвращаем моковые данные
    return ["user1", "user3", "user5"];
  }

  // Методы для работы с сессиями
  async createSession(userId: string): Promise<string> {
    const token = `${userId}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 дней

    this.sessions.push({
      token,
      userId,
      expiresAt,
    });

    return token;
  }

  async getSessionByToken(token: string): Promise<{ userId: string; expiresAt: string } | null> {
    const session = this.sessions.find(s => s.token === token);
    return session || null;
  }

  async deleteSession(token: string): Promise<boolean> {
    const sessionIndex = this.sessions.findIndex(s => s.token === token);
    if (sessionIndex === -1) return false;

    this.sessions.splice(sessionIndex, 1);
    return true;
  }

  // Методы для работы с предпочтениями
  async getUserPreferences(userId: string): Promise<any | null> {
    return this.preferences[userId] || null;
  }

  async updateUserPreferences(userId: string, preferences: any): Promise<any> {
    this.preferences[userId] = {
      ...this.preferences[userId],
      ...preferences,
    };

    return this.preferences[userId];
  }

  // Методы для работы с совпадениями
  async getMatchesByUserId(userId: string): Promise<Match[]> {
    return this.matches.filter(m => m.userId === userId || m.matchedUserId === userId);
  }

  async getMatchById(matchId: string): Promise<Match | null> {
    const match = this.matches.find(m => m.id === matchId);
    return match || null;
  }

  async createMatch(match: Omit<Match, "lastMessage">): Promise<Match> {
    const newMatch: Match = {
      ...match,
    };

    this.matches.push(newMatch);
    return newMatch;
  }

  async updateMatchLastMessage(matchId: string, message: { text: string; timestamp: string; senderId: string }): Promise<Match | null> {
    const matchIndex = this.matches.findIndex(m => m.id === matchId);
    if (matchIndex === -1) return null;

    this.matches[matchIndex].lastMessage = message;
    return this.matches[matchIndex];
  }

  // Методы для работы с сообщениями
  async getMessagesByMatchId(matchId: string): Promise<Message[]> {
    return this.messages.filter(m => m.matchId === matchId);
  }

  async createMessage(message: Omit<Message, "id" | "read">): Promise<Message> {
    const newMessage: Message = {
      id: `message${this.messages.length + 1}`,
      ...message,
      read: false,
    };

    this.messages.push(newMessage);

    // Обновляем последнее сообщение в совпадении
    await this.updateMatchLastMessage(message.matchId, {
      text: message.text,
      timestamp: message.timestamp,
      senderId: message.senderId,
    });

    return newMessage;
  }

  async markMessagesAsRead(matchId: string, userId: string): Promise<boolean> {
    const messages = this.messages.filter(m => m.matchId === matchId && m.receiverId === userId && !m.read);
    
    messages.forEach(message => {
      const index = this.messages.findIndex(m => m.id === message.id);
      if (index !== -1) {
        this.messages[index].read = true;
      }
    });

    return true;
  }

  // Методы для работы с трансляциями
  async getLiveStreamById(streamId: string): Promise<LiveStream | null> {
    const stream = this.livestreams.find(s => s.id === streamId);
    return stream || null;
  }

  async getLiveStreamByUserId(userId: string): Promise<LiveStream | null> {
    const stream = this.livestreams.find(s => s.userId === userId && s.status === "live");
    return stream || null;
  }

  async getLiveStreamsByStatus(status?: "scheduled" | "live" | "ended"): Promise<LiveStream[]> {
    if (!status) return this.livestreams;
    return this.livestreams.filter(s => s.status === status);
  }

  async createLiveStream(stream: Partial<LiveStream>): Promise<LiveStream> {
    const newStream: LiveStream = {
      id: stream.id || `stream${this.livestreams.length + 1}`,
      userId: stream.userId || "user1",
      title: stream.title || "Новая трансляция",
      description: stream.description,
      status: stream.status || "scheduled",
      scheduledFor: stream.scheduledFor,
      startedAt: stream.status === "live" ? new Date().toISOString() : undefined,
      viewerCount: 0,
      likeCount: 0,
      commentCount: 0,
    };

    this.livestreams.push(newStream);
    return newStream;
  }

  async updateLiveStream(streamId: string, updates: Partial<LiveStream>): Promise<LiveStream | null> {
    const streamIndex = this.livestreams.findIndex(s => s.id === streamId);
    if (streamIndex === -1) return null;

    this.livestreams[streamIndex] = {
      ...this.livestreams[streamIndex],
      ...updates,
    };

    return this.livestreams[streamIndex];
  }

  async deleteLiveStream(streamId: string): Promise<boolean> {
    const streamIndex = this.livestreams.findIndex(s => s.id === streamId);
    if (streamIndex === -1) return false;

    this.livestreams.splice(streamIndex, 1);
    return true;
  }

  async incrementLiveStreamViewers(streamId: string): Promise<number> {
    const streamIndex = this.livestreams.findIndex(s => s.id === streamId);
    if (streamIndex === -1) return 0;

    this.livestreams[streamIndex].viewerCount += 1;
    return this.livestreams[streamIndex].viewerCount;
  }

  async decrementLiveStreamViewers(streamId: string): Promise<number> {
    const streamIndex = this.livestreams.findIndex(s => s.id === streamId);
    if (streamIndex === -1) return 0;

    if (this.livestreams[streamIndex].viewerCount > 0) {
      this.livestreams[streamIndex].viewerCount -= 1;
    }
    
    return this.livestreams[streamIndex].viewerCount;
  }

  async incrementLiveStreamLikes(streamId: string): Promise<number> {
    const streamIndex = this.livestreams.findIndex(s => s.id === streamId);
    if (streamIndex === -1) return 0;

    this.livestreams[streamIndex].likeCount += 1;
    return this.livestreams[streamIndex].likeCount;
  }

  async incrementLiveStreamComments(streamId: string): Promise<number> {
    const streamIndex = this.livestreams.findIndex(s => s.id === streamId);
    if (streamIndex === -1) return 0;

    this.livestreams[streamIndex].commentCount += 1;
    return this.livestreams[streamIndex].commentCount;
  }
}

// Экспортируем экземпляр базы данных
export const db = new MockDatabase();