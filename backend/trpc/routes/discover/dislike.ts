import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";
import { db } from "@/backend/db";
import { TRPCError } from "@trpc/server";

export default protectedProcedure
  .input(z.object({
    dislikedUserId: z.string(),
  }))
  .mutation(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { dislikedUserId } = input;
    
    // Проверяем, существует ли пользователь
    const dislikedUser = await db.getUserById(dislikedUserId);
    
    if (!dislikedUser) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Пользователь не найден",
      });
    }
    
    // В реальном приложении здесь была бы логика сохранения дизлайка
    
    return {
      disliked: true,
    };
  });