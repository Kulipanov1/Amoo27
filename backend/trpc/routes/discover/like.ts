import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";
import { TRPCError } from "@trpc/server";

export default protectedProcedure
  .input(z.object({
    likedUserId: z.string(),
  }))
  .mutation(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { likedUserId } = input;
    
    try {
      // For development, return a mock response
      console.log(`User ${userId} liked user ${likedUserId}`);
      
      // Simulate a match with 30% probability
      const isMutualLike = Math.random() < 0.3;
      
      if (isMutualLike) {
        return {
          liked: true,
          match: {
            id: `match-${Date.now()}`,
            userId,
            matchedUserId: likedUserId,
            timestamp: new Date().toISOString(),
          },
        };
      }
      
      return {
        liked: true,
        match: null,
      };
    } catch (error) {
      console.error("Error in like procedure:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
      });
    }
  });