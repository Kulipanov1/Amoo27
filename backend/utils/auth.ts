import { TRPCError } from "@trpc/server";
import { Context } from "../trpc/create-context";
import { db } from "../db";

// Функция для проверки аутентификации пользователя
export async function isAuthenticated(ctx: Context) {
  try {
    // Получаем токен из заголовка Authorization
    const authHeader = ctx.req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Требуется аутентификация",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Неверный формат токена",
      });
    }

    // В реальном приложении здесь была бы проверка токена
    // и получение пользователя из базы данных
    // Для демонстрации используем моковые данные

    // Проверяем токен в базе данных
    const session = await db.getSessionByToken(token);
    if (!session) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Недействительный токен",
      });
    }

    // Проверяем, не истек ли токен
    const now = new Date();
    const expiresAt = new Date(session.expiresAt);
    if (now > expiresAt) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Срок действия токена истек",
      });
    }

    // Получаем пользователя
    const user = await db.getUserById(session.userId);
    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Пользователь не найден",
      });
    }

    // Для демонстрации, если база данных недоступна, используем моковые данные
    // В реальном приложении этого кода не было бы
    if (!user) {
      // Используем ID из токена как ID пользователя
      // Это только для демонстрации!
      const userId = token.split("-")[0] || "user1";
      
      return {
        user: {
          id: userId,
          name: "Демо пользователь",
          email: "demo@example.com",
        },
        userId,
      };
    }

    return {
      user,
      userId: user.id,
    };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    console.error("Error in isAuthenticated:", error);
    
    // Для демонстрации, чтобы приложение работало без бэкенда
    // В реальном приложении этого кода не было бы
    const demoUserId = "user1";
    
    return {
      user: {
        id: demoUserId,
        name: "Демо пользователь",
        email: "demo@example.com",
      },
      userId: demoUserId,
    };
  }
}

// Функция для создания токена
export function generateToken(userId: string): string {
  // В реальном приложении здесь был бы код для создания JWT
  // Для демонстрации просто возвращаем строку
  return `${userId}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

// Функция для хеширования пароля
export function hashPassword(password: string): string {
  // В реальном приложении здесь был бы код для хеширования пароля
  // Для демонстрации просто возвращаем строку
  return `hashed-${password}`;
}

// Функция для проверки пароля
export function verifyPassword(password: string, hash: string): boolean {
  // В реальном приложении здесь был бы код для проверки пароля
  // Для демонстрации просто сравниваем строки
  return hash === `hashed-${password}`;
}