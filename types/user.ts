export type Gender = 'male' | 'female' | 'other';
export type LookingFor = 'male' | 'female' | 'other' | 'all';

export interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  location: string;
  distance: number;
  photos: string[];
  videos?: string[];
  interests: string[];
  verified: boolean;
  gender: Gender;
  lookingFor: LookingFor;
  occupation?: string;
  education?: string;
  lastActive?: string;
  online?: boolean;
}

export interface UserPreferences {
  ageRange: [number, number];
  distance: number;
  gender: LookingFor;
  showMe: LookingFor;
}

export interface Match {
  id: string;
  userId: string;
  matchedUserId: string;
  timestamp: string;
  lastMessage?: {
    text: string;
    timestamp: string;
    senderId: string;
    read?: boolean;
  };
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  receiverId: string;
  content: string; // Message content
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'video' | 'voice' | 'location';
  mediaUrl?: string;
  duration?: number;
}

export interface LiveStream {
  id: string;
  title: string;
  description: string;
  hostId: string;
  thumbnailUrl?: string;
  status: 'scheduled' | 'live' | 'ended';
  scheduledFor?: string;
  startedAt?: string;
  endedAt?: string;
  viewerCount?: number;
  likeCount?: number;
  commentCount?: number;
  createdAt: string;
}

export interface LiveStreamComment {
  id: string;
  streamId: string;
  userId: string;
  text: string;
  timestamp: string;
}

export interface LiveStreamViewer {
  id: string;
  streamId: string;
  userId: string;
  joinedAt: string;
  leftAt?: string;
}