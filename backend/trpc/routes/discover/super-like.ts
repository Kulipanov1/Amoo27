import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";
import { TRPCError } from "@trpc/server";

export default protectedProcedure
  .input(z.object({
    superLikedUserId: z.string(),
  }))
  .mutation(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { superLikedUserId } = input;
    
    try {
      // For development, return a mock response
      console.log(`User ${userId} super-liked user ${superLikedUserId}`);
      
      // Simulate a match with 60% probability for super likes
      const isMutualLike = Math.random() < 0.6;
      
      if (isMutualLike) {
        return {
          superLiked: true,
          match: {
            id: `match-${Date.now()}`,
            userId,
            matchedUserId: superLikedUserId,
            timestamp: new Date().toISOString(),
          },
        };
      }
      
      return {
        superLiked: true,
        match: null,
      };
    } catch (error) {
      console.error("Error in super-like procedure:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
      });
    }
  });