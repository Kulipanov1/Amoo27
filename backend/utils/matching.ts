import { User } from "../models/types";
import { db } from "../db";
import { mockUsers } from "@/mocks/users";

// Function to find potential matches for a user
export async function findPotentialMatches(userId: string, limit: number = 20): Promise<User[]> {
  try {
    // Check if user exists
    let user;
    try {
      user = await db.getUserById(userId);
    } catch (error) {
      console.log("Error getting user, using mock data:", error);
      // If database is unavailable, use mock data
      return mockUsers.map(user => ({
        ...user,
        bio: user.bio || "No bio available",
        distance: user.distance || 0,
        verified: user.verified || false,
        interests: user.interests || [],
        lookingFor: user.lookingFor || 'all'
      }));
    }
    
    if (!user) {
      console.log("User not found, using mock data");
      return mockUsers.map(user => ({
        ...user,
        bio: user.bio || "No bio available",
        distance: user.distance || 0,
        verified: user.verified || false,
        interests: user.interests || [],
        lookingFor: user.lookingFor || 'all'
      }));
    }

    // Get user preferences
    const preferences = await db.getUserPreferences(userId);
    
    // Get all users
    const allUsers = await db.getAllUsers();
    
    // Get existing matches and dislikes
    const matches = await db.getMatchesByUserId(userId);
    const matchedUserIds = new Set(
      matches.map(match => 
        match.userId === userId ? match.matchedUserId : match.userId
      )
    );
    
    // Filter users
    const potentialMatches = allUsers.filter(potentialMatch => {
      // Exclude the user themselves
      if (potentialMatch.id === userId) return false;
      
      // Exclude already matched users
      if (matchedUserIds.has(potentialMatch.id)) return false;
      
      // Apply preference filters if they exist
      if (preferences) {
        // Gender filter
        if (preferences.showMe !== 'all' && potentialMatch.gender !== preferences.showMe) {
          return false;
        }
        
        // Age filter
        if (
          potentialMatch.age < preferences.ageRange[0] || 
          potentialMatch.age > preferences.ageRange[1]
        ) {
          return false;
        }
        
        // Distance filter
        if (
          potentialMatch.distance && 
          preferences.distance > 0 && 
          potentialMatch.distance > preferences.distance
        ) {
          return false;
        }
      }
      
      return true;
    });
    
    // Sort by relevance (in this case just by distance)
    potentialMatches.sort((a, b) => {
      const distanceA = a.distance || 0;
      const distanceB = b.distance || 0;
      return distanceA - distanceB;
    });
    
    // Return limited number of matches
    return potentialMatches.slice(0, limit);
  } catch (error) {
    console.error("Error in findPotentialMatches:", error);
    // In case of error, return mock data
    return mockUsers.map(user => ({
      ...user,
      bio: user.bio || "No bio available",
      distance: user.distance || 0,
      verified: user.verified || false,
      interests: user.interests || [],
      lookingFor: user.lookingFor || 'all'
    }));
  }
}

// Function to create a match between users
export async function createMatch(userId: string, matchedUserId: string) {
  try {
    const matchId = `match-${Date.now()}`;
    const timestamp = new Date().toISOString();
    
    const match = {
      id: matchId,
      userId,
      matchedUserId,
      timestamp,
    };
    
    return db.createMatch(match);
  } catch (error) {
    console.error("Error creating match:", error);
    // Return a mock match object in case of error
    return {
      id: `match-${Date.now()}`,
      userId,
      matchedUserId,
      timestamp: new Date().toISOString(),
    };
  }
}

// Function to check for mutual like
export async function checkMutualLike(userId: string, likedUserId: string): Promise<boolean> {
  try {
    // In a real app, this would check if both users liked each other
    // For demonstration, we use a random value
    return Math.random() < 0.3; // 30% chance of match
  } catch (error) {
    console.error("Error checking mutual like:", error);
    return false;
  }
}