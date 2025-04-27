import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import { getAuthToken } from '@/lib/api';
import { Platform } from 'react-native';
import { useAuthStore } from '@/store/auth-store';

// Create a client with more conservative retry settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const getBaseUrl = () => {
  // For Expo, use the local IP address for the dev server
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // For web, use relative path
  if (Platform.OS === "web") {
    return "";
  }

  // For native, use localhost or your computer's IP address
  return "http://localhost:3000";
};

export default function RootLayout() {
  // Get the setIsAuthenticated function from the store
  const { setIsAuthenticated } = useAuthStore();

  useEffect(() => {
    // Check if user is authenticated on app start
    const checkAuth = async () => {
      try {
        const token = await getAuthToken();
        if (token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [setIsAuthenticated]);

  return (
    <trpc.Provider
      client={trpc.createClient({
        links: [
          httpBatchLink({
            url: `${getBaseUrl()}/api/trpc`,
            transformer: superjson,
            headers: async () => {
              const token = await getAuthToken();
              return {
                "Content-Type": "application/json",
                "Accept": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              };
            },
          }),
        ],
      })}
      queryClient={queryClient}
    >
      <QueryClientProvider client={queryClient}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: '#fff',
            },
          }}
        />
      </QueryClientProvider>
    </trpc.Provider>
  );
}