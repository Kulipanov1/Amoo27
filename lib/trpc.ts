import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink, httpLink, loggerLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";
import { getAuthToken } from "./api";
import { Platform } from "react-native";

export const trpc = createTRPCReact<AppRouter>();

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
  // Use your computer's IP address if testing on a physical device
  return "http://localhost:3000";
};

// Create a client with proper error handling
export const trpcClient = trpc.createClient({
  links: [
    loggerLink({
      enabled: (opts) => 
        process.env.NODE_ENV === "development" || 
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      headers: async () => {
        const token = await getAuthToken();
        return {
          "Content-Type": "application/json",
          "Accept": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
      },
      transformer: superjson,
    }),
  ],
});