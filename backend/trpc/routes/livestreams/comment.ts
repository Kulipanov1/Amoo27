import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";
import { db } from "@/backend/db";
import { realtimeService } from "@/backend/utils/realtime";
import { TRPCError } from "@trpc/server";

export default protectedProcedure
  .input(z.object({
    streamId: z.string(),
    text: z.string().min(1).max(200),
  }))
  .mutation(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { streamId, text } = input;
    
    // Получаем трансляцию
    const stream = await db.getLiveStreamById(streamId);
    
    if (!stream) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Трансляция не найдена",
      });
    }
    
    // Проверяем, что трансляция активна
    if (stream.status !== "live") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Трансляция не активна",
      });
    }
    
    // Создаем комментарий
    const comment = {
      userId,
      text,
      timestamp: new Date().toISOString(),
    };
    
    // Добавляем комментарий
    const comments = stream.comments || [];
    comments.push(comment);
    
    // Обновляем трансляцию
    const updatedStream = await db.updateLiveStream(streamId, {
      comments,
    });
    
    // Получаем информацию о пользователе
    const user = await db.getUserById(userId);
    
    // Отправляем уведомление
    realtimeService.publishToLiveStream(streamId, "new-comment", { 
      comment,
      user,
    });
    
    return {
      comment,
      stream: updatedStream,
    };
  });