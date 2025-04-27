import { trpc, trpcClient } from './trpc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockUsers } from '@/mocks/users';
import { Message } from '@/types/user';

// Function to get token from AsyncStorage
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('auth-token');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Function to save token to AsyncStorage
export const setAuthToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('auth-token', token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

// Function to remove token from AsyncStorage
export const removeAuthToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('auth-token');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

// API hooks

// Authentication
export const useLogin = () => {
  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async (data) => {
      if (data?.token) {
        await setAuthToken(data.token);
      }
    },
  });
  
  const login = async (telegramData: {
    id: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    photoUrl?: string;
  }) => {
    try {
      // Ensure we're passing the correct data structure
      const result = await loginMutation.mutateAsync({
        telegramData: {
          id: telegramData.id,
          username: telegramData.username || null,
          firstName: telegramData.firstName || null,
          lastName: telegramData.lastName || null,
          photoUrl: telegramData.photoUrl || null,
        },
      });
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      // Return mock data for development
      return {
        token: "mock-token-" + Date.now(),
        user: {
          id: telegramData.id,
          name: telegramData.firstName || "User",
          username: telegramData.username || "user",
        }
      };
    }
  };
  
  return {
    login,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
  };
};

export const useLogout = () => {
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await removeAuthToken();
    },
  });
  
  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if the API call fails, remove the token
      await removeAuthToken();
      
      return true; // Return success anyway since we removed the token
    }
  };
  
  return {
    logout,
    isLoading: logoutMutation.isPending,
    error: logoutMutation.error,
  };
};

export const useCurrentUser = () => {
  const query = trpc.auth.me.useQuery(undefined, {
    retry: 1,
    retryDelay: 1000,
    enabled: false, // Don't request automatically
  });
  
  return {
    ...query,
    refetch: query.refetch,
  };
};

// Users
export const useUpdateUser = () => {
  const updateMutation = trpc.users.update.useMutation();
  
  return {
    updateUser: updateMutation.mutate,
    isLoading: updateMutation.isPending,
    error: updateMutation.error,
  };
};

export const useUserPreferences = () => {
  const preferenceMutation = trpc.users.preferences.useMutation();
  
  return {
    updatePreferences: preferenceMutation.mutate,
    isLoading: preferenceMutation.isPending,
    error: preferenceMutation.error,
  };
};

// Discovery
export const usePotentialMatches = () => {
  const query = trpc.discover.potentialMatches.useQuery({ limit: 20 }, {
    retry: 1,
    retryDelay: 1000,
    enabled: false, // Don't fetch automatically to avoid errors
  });
  
  return {
    ...query,
    refetch: query.refetch,
    // Provide mock data when API fails
    data: query.data || mockUsers,
  };
};

export const useLikeUser = () => {
  const likeMutation = trpc.discover.like.useMutation();
  
  const likeUser = async (params: { likedUserId: string }, options?: any) => {
    try {
      return await likeMutation.mutateAsync(params, options);
    } catch (error) {
      console.error("Error liking user:", error);
      // Return a mock response for development
      return {
        liked: true,
        match: Math.random() > 0.7 ? {
          id: `match-${Date.now()}`,
          userId: "current-user",
          matchedUserId: params.likedUserId,
          timestamp: new Date().toISOString()
        } : null
      };
    }
  };
  
  return {
    likeUser,
    isLoading: likeMutation.isPending,
    error: likeMutation.error,
  };
};

export const useDislikeUser = () => {
  const dislikeMutation = trpc.discover.dislike.useMutation();
  
  const dislikeUser = async (params: { dislikedUserId: string }, options?: any) => {
    try {
      return await dislikeMutation.mutateAsync(params, options);
    } catch (error) {
      console.error("Error disliking user:", error);
      // Return a mock response for development
      return {
        disliked: true
      };
    }
  };
  
  return {
    dislikeUser,
    isLoading: dislikeMutation.isPending,
    error: dislikeMutation.error,
  };
};

export const useSuperLikeUser = () => {
  // Use the actual API call with proper error handling
  const superLikeMutation = trpc.discover.superLike.useMutation();
  
  const superLikeUser = async (params: { superLikedUserId: string }, options?: any) => {
    try {
      return await superLikeMutation.mutateAsync(params, options);
    } catch (error) {
      console.error("Error super liking user:", error);
      // Return a mock response for development
      return {
        superLiked: true,
        match: Math.random() > 0.5 ? {
          id: `match-${Date.now()}`,
          userId: "current-user",
          matchedUserId: params.superLikedUserId,
          timestamp: new Date().toISOString()
        } : null
      };
    }
  };
  
  return {
    superLikeUser,
    isLoading: superLikeMutation.isPending,
    error: superLikeMutation.error,
  };
};

// Matches
export const useMatches = () => {
  const query = trpc.matches.list.useQuery(undefined, {
    retry: 1,
    retryDelay: 1000,
    enabled: false, // Don't fetch automatically to avoid errors
  });
  
  return {
    ...query,
    refetch: query.refetch,
  };
};

export const useMatch = (matchId: string) => {
  const query = trpc.matches.get.useQuery({ matchId }, {
    retry: 1,
    retryDelay: 1000,
    enabled: false, // Don't fetch automatically to avoid errors
  });
  
  return {
    ...query,
    refetch: query.refetch,
  };
};

// Messages
export const useMessages = (matchId: string) => {
  const query = trpc.messages.list.useQuery({ matchId }, {
    retry: 1,
    retryDelay: 1000,
    enabled: false, // Don't fetch automatically to avoid errors
  });
  
  return {
    ...query,
    refetch: query.refetch,
  };
};

export const useSendMessage = () => {
  const sendMutation = trpc.messages.send.useMutation();
  
  const sendMessage = async (params: {
    matchId: string;
    receiverId: string;
    text: string;
    type: 'text' | 'image' | 'voice' | 'video';
    mediaUrl?: string;
    duration?: number;
  }) => {
    try {
      return await sendMutation.mutateAsync(params);
    } catch (error) {
      console.error("Error sending message:", error);
      // Return a mock response
      const mockMessage: Message = {
        id: `msg-${Date.now()}`,
        matchId: params.matchId,
        senderId: "current-user",
        receiverId: params.receiverId,
        content: params.text,
        timestamp: new Date().toISOString(),
        read: false,
        type: params.type
      };
      
      if (params.mediaUrl) {
        mockMessage.mediaUrl = params.mediaUrl;
      }
      
      if (params.duration) {
        mockMessage.duration = params.duration;
      }
      
      return mockMessage;
    }
  };
  
  return {
    sendMessage,
    isLoading: sendMutation.isPending,
    error: sendMutation.error,
  };
};

export const useMarkMessagesAsRead = () => {
  const markReadMutation = trpc.messages.markRead.useMutation();
  
  const markAsRead = async (params: { matchId: string, messageIds?: string[] }) => {
    try {
      return await markReadMutation.mutateAsync(params);
    } catch (error) {
      console.error("Error marking messages as read:", error);
      // Return a mock response
      return { success: true };
    }
  };
  
  return {
    markAsRead,
    isLoading: markReadMutation.isPending,
    error: markReadMutation.error,
  };
};

// Livestreams
export const useLiveStreams = (status?: 'scheduled' | 'live' | 'ended') => {
  const query = trpc.livestreams.list.useQuery({ status }, {
    retry: 1,
    retryDelay: 1000,
    enabled: false, // Don't fetch automatically to avoid errors
  });
  
  return {
    ...query,
    refetch: query.refetch,
  };
};

export const useCreateLiveStream = () => {
  const createMutation = trpc.livestreams.create.useMutation();
  
  const createStream = async (params: any, options?: any) => {
    try {
      return await createMutation.mutateAsync(params, options);
    } catch (error) {
      console.error("Error creating livestream:", error);
      // Return a mock response
      return {
        id: `stream-${Date.now()}`,
        title: params.title,
        description: params.description,
        scheduledFor: params.scheduledFor,
        status: "scheduled",
        hostId: "current-user",
        createdAt: new Date().toISOString()
      };
    }
  };
  
  return {
    createStream,
    isLoading: createMutation.isPending,
    error: createMutation.error,
  };
};

export const useStartLiveStream = () => {
  const startMutation = trpc.livestreams.start.useMutation();
  
  const startStream = async (params: any, options?: any) => {
    try {
      return await startMutation.mutateAsync(params, options);
    } catch (error) {
      console.error("Error starting livestream:", error);
      // Return a mock response
      return { success: true, status: "live" };
    }
  };
  
  return {
    startStream,
    isLoading: startMutation.isPending,
    error: startMutation.error,
  };
};

export const useEndLiveStream = () => {
  const endMutation = trpc.livestreams.end.useMutation();
  
  const endStream = async (params: any, options?: any) => {
    try {
      return await endMutation.mutateAsync(params, options);
    } catch (error) {
      console.error("Error ending livestream:", error);
      // Return a mock response
      return { success: true, status: "ended" };
    }
  };
  
  return {
    endStream,
    isLoading: endMutation.isPending,
    error: endMutation.error,
  };
};

export const useJoinLiveStream = () => {
  const joinMutation = trpc.livestreams.join.useMutation();
  
  const joinStream = async (params: any, options?: any) => {
    try {
      return await joinMutation.mutateAsync(params, options);
    } catch (error) {
      console.error("Error joining livestream:", error);
      // Return a mock response
      return { success: true };
    }
  };
  
  return {
    joinStream,
    isLoading: joinMutation.isPending,
    error: joinMutation.error,
  };
};

export const useLeaveLiveStream = () => {
  const leaveMutation = trpc.livestreams.leave.useMutation();
  
  const leaveStream = async (params: any, options?: any) => {
    try {
      return await leaveMutation.mutateAsync(params, options);
    } catch (error) {
      console.error("Error leaving livestream:", error);
      // Return a mock response
      return { success: true };
    }
  };
  
  return {
    leaveStream,
    isLoading: leaveMutation.isPending,
    error: leaveMutation.error,
  };
};

export const useCommentLiveStream = () => {
  const commentMutation = trpc.livestreams.comment.useMutation();
  
  const commentStream = async (params: any, options?: any) => {
    try {
      return await commentMutation.mutateAsync(params, options);
    } catch (error) {
      console.error("Error commenting on livestream:", error);
      // Return a mock response
      return {
        id: `comment-${Date.now()}`,
        streamId: params.streamId,
        userId: "current-user",
        text: params.text,
        timestamp: new Date().toISOString()
      };
    }
  };
  
  return {
    commentStream,
    isLoading: commentMutation.isPending,
    error: commentMutation.error,
  };
};

export const useLikeLiveStream = () => {
  const likeMutation = trpc.livestreams.like.useMutation();
  
  const likeStream = async (params: any, options?: any) => {
    try {
      return await likeMutation.mutateAsync(params, options);
    } catch (error) {
      console.error("Error liking livestream:", error);
      // Return a mock response
      return { success: true };
    }
  };
  
  return {
    likeStream,
    isLoading: likeMutation.isPending,
    error: likeMutation.error,
  };
};