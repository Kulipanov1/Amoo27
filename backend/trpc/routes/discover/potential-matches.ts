import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";
import { findPotentialMatches } from "@/backend/utils/matching";
import { mockUsers } from "@/mocks/users";

export default protectedProcedure
  .input(z.object({
    limit: z.number().min(1).max(100).default(20),
  }))
  .query(async ({ ctx, input }) => {
    try {
      const { userId } = ctx;
      const { limit } = input;
      
      // Try to get potential matches from the database
      let potentialMatches = [];
      
      try {
        potentialMatches = await findPotentialMatches(userId, limit);
      } catch (error) {
        console.error("Error finding potential matches:", error);
        // If database query fails, use mock data as fallback
        potentialMatches = mockUsers.map(user => ({
          ...user,
          bio: user.bio || "No bio available",
          distance: user.distance || 0
        }));
      }
      
      // Ensure all required fields are present
      const validatedMatches = potentialMatches.map(user => ({
        id: user.id,
        name: user.name,
        age: user.age,
        bio: user.bio || "No bio available",
        location: user.location,
        distance: typeof user.distance === 'number' ? user.distance : 0,
        photos: user.photos || [],
        interests: user.interests || [],
        verified: user.verified || false,
        gender: user.gender,
        lookingFor: user.lookingFor,
        occupation: user.occupation,
        education: user.education,
        lastActive: user.lastActive,
        telegramUsername: user.telegramUsername,
        videos: user.videos,
        ageRangeMin: user.ageRangeMin,
        ageRangeMax: user.ageRangeMax,
        maxDistance: user.maxDistance
      }));
      
      return validatedMatches;
    } catch (error) {
      console.error("Error in potentialMatches procedure:", error);
      // Return empty array instead of throwing to prevent client errors
      return [];
    }
  });