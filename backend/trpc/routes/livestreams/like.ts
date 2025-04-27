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
    
    // Увеличиваем количество лайков
    const likes = (stream.likes || 0) + 1;
    
    // Обновляем трансляцию
    const updatedStream = await db.updateLiveStream(streamId, {
      likes,
    });
    
    // Отправляем уведомление
    realtimeService.publishToLiveStream(streamId, "new-like", { 
      userId,
      likeCount: likes,
    });
    
    return {
      stream: updatedStream,
      likeCount: likes,
    };
  });