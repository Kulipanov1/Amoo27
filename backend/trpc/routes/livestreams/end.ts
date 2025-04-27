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
    
    // Проверяем, что пользователь является владельцем трансляции
    if (stream.userId !== userId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "У вас нет доступа к этой трансляции",
      });
    }
    
    // Проверяем, что трансляция активна
    if (stream.status !== "live") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Трансляция не активна",
      });
    }
    
    // Обновляем статус трансляции
    const updatedStream = await db.updateLiveStream(streamId, {
      status: "ended",
      endTime: new Date().toISOString(),
    });
    
    // Отправляем уведомление
    realtimeService.publishToLiveStream(streamId, "stream-ended", { stream: updatedStream });
    
    return updatedStream;
  });