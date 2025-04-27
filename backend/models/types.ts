import { z } from "zod";

// Схемы для валидации данных

// Аутентификация
export const TelegramDataSchema = z.object({
  id: z.string(),
  username: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  photoUrl: z.string().nullable(),
});

export const LoginSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  telegramData: TelegramDataSchema.optional(),
}).refine(data => 
  (data.email && data.password) || data.telegramData, 
  { message: "Необходимо предоставить email/password или данные Telegram" }
);

export const LogoutSchema = z.object({});

// Пользователи
export const UserPreferencesSchema = z.object({
  minAge: z.number().min(18).max(100).optional(),
  maxAge: z.number().min(18).max(100).optional(),
  gender: z.enum(["male", "female", "non-binary", "other", "all"]).optional(),
  maxDistance: z.number().min(1).max(500).optional(),
  interests: z.array(z.string()).optional(),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  age: z.number().min(18).max(100).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  photos: z.array(z.string().url()).optional(),
  interests: z.array(z.string()).optional(),
  gender: z.enum(["male", "female", "non-binary", "other"]).optional(),
  lookingFor: z.enum(["male", "female", "non-binary", "other", "all"]).optional(),
});

// Discover
export const PotentialMatchesSchema = z.object({
  limit: z.number().min(1).max(100).optional(),
});

export const LikeSchema = z.object({
  likedUserId: z.string(),
});

export const DislikeSchema = z.object({
  dislikedUserId: z.string(),
});

export const SuperLikeSchema = z.object({
  superLikedUserId: z.string(),
});

// Matches
export const GetMatchSchema = z.object({
  matchId: z.string(),
});

// Messages
export const ListMessagesSchema = z.object({
  matchId: z.string(),
  limit: z.number().min(1).max(100).optional(),
  before: z.string().optional(),
});

export const MessageCreateSchema = z.object({
  matchId: z.string(),
  receiverId: z.string(),
  text: z.string().min(1),
  type: z.enum(["text", "image", "voice", "video"]),
  mediaUrl: z.string().url().optional(),
  duration: z.number().optional(),
});

export const SendMessageSchema = MessageCreateSchema;

export const MarkReadSchema = z.object({
  matchId: z.string(),
  messageIds: z.array(z.string()).optional(),
});

// Livestreams
export const ListStreamsSchema = z.object({
  status: z.enum(["scheduled", "live", "ended"]).optional(),
});

export const CreateStreamSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  scheduledFor: z.string().optional(),
  thumbnail: z.string().url().optional(),
});

export const StreamActionSchema = z.object({
  streamId: z.string(),
});

export const CommentStreamSchema = z.object({
  streamId: z.string(),
  text: z.string().min(1).max(500),
});

// Типы данных

export interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  location: string;
  distance?: number;
  photos: string[];
  videos?: string[];
  interests: string[];
  verified: boolean;
  telegramUsername?: string | null;
  gender?: "male" | "female" | "non-binary" | "other";
  lookingFor?: "male" | "female" | "non-binary" | "other" | "all";
  minAge?: number;
  maxAge?: number;
  maxDistance?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  telegramId?: string;
  telegramUsername?: string | null;
  telegramFirstName?: string | null;
  telegramLastName?: string | null;
  telegramPhotoUrl?: string | null;
  email?: string;
  passwordHash?: string;
  isOnboarded: boolean;
  createdAt: string;
  lastLoginAt: string;
}

export interface Match {
  id: string;
  userId: string;
  matchedUserId: string;
  timestamp: string;
  lastMessage?: {
    timestamp: string;
    text: string;
    senderId: string;
    read?: boolean;
  };
}

// Обновленный интерфейс Message для совместимости с frontend
export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  receiverId: string;
  text: string;
  content?: string; // Добавлено для совместимости с frontend
  type: "text" | "image" | "voice" | "video";
  mediaUrl?: string;
  duration?: number;
  timestamp: string;
  read: boolean;
}

export interface LiveStream {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: "scheduled" | "live" | "ended";
  scheduledFor?: string;
  startedAt?: string;
  endedAt?: string;
  thumbnail?: string;
  viewerCount: number;
  likeCount: number;
  commentCount: number;
}

export interface LiveStreamComment {
  id: string;
  streamId: string;
  userId: string;
  text: string;
  timestamp: string;
}

export interface LiveStreamViewer {
  streamId: string;
  userId: string;
  joinedAt: string;
  leftAt?: string;
}