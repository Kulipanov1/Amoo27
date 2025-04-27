import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";
import { db } from "@/backend/db";
import { TRPCError } from "@trpc/server";

export default protectedProcedure
  .input(z.object({
    matchId: z.string(),
  }))
  .mutation(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { matchId } = input;
    
    // Получаем совпадение
    const match = await db.getMatchById(matchId);
    
    if (!match) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Совпадение не найдено",
      });
    }
    
    // Проверяем, что пользователь является участником совпадения
    if (match.userId !== userId && match.matchedUserId !== userId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "У вас нет доступа к этому совпадению",
      });
    }
    
    // Отмечаем сообщения как прочитанные
    await db.markMessagesAsRead(matchId, userId);
    
    return {
      success: true,
    };
  });