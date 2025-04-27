import { protectedProcedure } from "@/backend/trpc/create-context";
import { UserPreferencesSchema } from "@/backend/models/types";
import { db } from "@/backend/db";
import { TRPCError } from "@trpc/server";

export default protectedProcedure
  .input(UserPreferencesSchema.omit({ userId: true }).partial())
  .mutation(async ({ ctx, input }) => {
    const { userId } = ctx;
    
    // Проверяем, существуют ли предпочтения
    let preferences = await db.getUserPreferences(userId);
    
    if (!preferences) {
      // Создаем предпочтения по умолчанию
      preferences = await db.createUserPreferences({
        userId,
        ageRange: [18, 35],
        distance: 25,
        gender: "all",
        showMe: "all",
        notifications: true,
        darkMode: false,
      });
    }
    
    // Обновляем предпочтения
    const updatedPreferences = await db.updateUserPreferences(userId, input);
    
    if (!updatedPreferences) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Не удалось обновить предпочтения",
      });
    }
    
    return updatedPreferences;
  });