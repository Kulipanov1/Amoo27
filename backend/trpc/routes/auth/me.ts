import { protectedProcedure } from "@/backend/trpc/create-context";
import { db } from "@/backend/db";

export default protectedProcedure
  .query(async ({ ctx }) => {
    const { userId } = ctx;
    
    // Получаем данные пользователя
    const user = await db.getUserById(userId);
    
    if (!user) {
      throw new Error("Пользователь не найден");
    }
    
    return {
      id: user.id,
      name: user.name || user.telegramFirstName || "Пользователь",
      username: user.telegramUsername || user.email || "user",
      email: user.email,
      telegramUsername: user.telegramUsername,
      telegramFirstName: user.telegramFirstName,
      telegramLastName: user.telegramLastName,
      telegramPhotoUrl: user.telegramPhotoUrl,
      isOnboarded: user.isOnboarded,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };
  });