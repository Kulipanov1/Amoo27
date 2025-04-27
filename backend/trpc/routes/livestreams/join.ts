import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";
import { db } from "@/backend/db";
import { realtimeService } from "@/backend/utils/realtime";
import { TRPCError } from "@trpc/server";

export default protectedProcedure
  .input(z.object({
    streamId: z.string(),
  }))
  .mutation(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { streamId } = input;
    
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
    
    // Добавляем пользователя в список зрителей
    const viewers = stream.viewers || [];
    if (!viewers.includes(userId)) {
      viewers.push(userId);
    }
    
    // Обновляем трансляцию
    const updatedStream = await db.updateLiveStream(streamId, {
      viewers,
    });
    
    // Отправляем уведомление
    realtimeService.publishToLiveStream(streamId, "viewer-joined", { 
      userId,
      viewerCount: viewers.length,
    });
    
    return {
      stream: updatedStream,
      viewerCount: viewers.length,
    };
  });