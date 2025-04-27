import { protectedProcedure } from "@/backend/trpc/create-context";
import { SendMessageSchema } from "@/backend/models/types";
import { db } from "@/backend/db";
import { realtimeService } from "@/backend/utils/realtime";
import { TRPCError } from "@trpc/server";

export default protectedProcedure
  .input(SendMessageSchema)
  .mutation(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { matchId, receiverId, text, type, mediaUrl, duration } = input;
    
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
    
    // Проверяем, что получатель является участником совпадения
    if (match.userId !== receiverId && match.matchedUserId !== receiverId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Получатель не является участником совпадения",
      });
    }
    
    // Создаем сообщение
    const message = await db.createMessage({
      id: `msg-${Date.now()}`,
      matchId,
      senderId: userId,
      receiverId,
      text,
      content: text, // Добавляем поле content для совместимости с frontend
      timestamp: new Date().toISOString(),
      read: false,
      type,
      mediaUrl,
      duration,
    });
    
    // Отправляем уведомление получателю
    realtimeService.publishToUser(receiverId, "new-message", { message });
    realtimeService.publishToMatch(matchId, "message", { message });
    
    return message;
  });