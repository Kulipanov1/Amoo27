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
    
    // Удаляем пользователя из списка зрителей
    const viewers = stream.viewers || [];
    const updatedViewers = viewers.filter(id => id !== userId);
    
    // Обновляем трансляцию
    const updatedStream = await db.updateLiveStream(streamId, {
      viewers: updatedViewers,
    });
    
    // Отправляем уведомление
    realtimeService.publishToLiveStream(streamId, "viewer-left", { 
      userId,
      viewerCount: updatedViewers.length,
    });
    
    return {
      stream: updatedStream,
      viewerCount: updatedViewers.length,
    };
  });