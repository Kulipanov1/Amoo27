import { publicProcedure } from "@/backend/trpc/create-context";
import { LoginSchema } from "@/backend/models/types";
import { db } from "@/backend/db";
import { generateToken } from "@/backend/utils/auth";

export default publicProcedure
  .input(LoginSchema)
  .mutation(async ({ input }) => {
    const { email, password, telegramData } = input;
    
    let user;
    
    if (telegramData) {
      // Логин через Telegram
      user = await db.getUserByTelegramId(telegramData.id);
      
      if (!user) {
        // Создаем нового пользователя
        user = await db.createUserWithTelegram(telegramData);
      } else {
        // Обновляем данные пользователя
        user = await db.updateUserTelegramData(user.id, telegramData);
      }
    } else if (email && password) {
      // Логин через email/password
      user = await db.getUserByEmail(email);
      
      if (!user) {
        throw new Error("Пользователь не найден");
      }
      
      const isPasswordValid = await db.validatePassword(user.id, password);
      
      if (!isPasswordValid) {
        throw new Error("Неверный пароль");
      }
    } else {
      throw new Error("Необходимо предоставить данные для входа");
    }
    
    // Обновляем время последнего входа
    await db.updateLastLogin(user.id);
    
    // Генерируем токен
    const token = generateToken(user.id);
    
    return {
      token,
      user: {
        id: user.id,
        name: user.name || user.telegramFirstName || "Пользователь",
        username: user.telegramUsername || user.email || "user",
        isOnboarded: user.isOnboarded,
      },
    };
  });