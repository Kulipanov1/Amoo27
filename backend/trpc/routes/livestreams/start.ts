import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";
import { TRPCError } from "@trpc/server";
import { db } from "@/backend/db";
import { sendNotification } from "@/backend/utils/realtime";

export default protectedProcedure
  .input(
    z.object({
      streamId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    try {
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

      // Проверяем, принадлежит ли трансляция пользователю
      if (stream.userId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "У вас нет прав для запуска этой трансляции",
        });
      }

      // Проверяем, что трансляция в статусе "scheduled"
      if (stream.status !== "scheduled") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Трансляция уже запущена или завершена",
        });
      }

      // Обновляем статус трансляции
      const updatedStream = await db.updateLiveStream(streamId, {
        status: "live",
        startedAt: new Date().toISOString(),
      });

      // Отправляем уведомления подписчикам
      const followers = await db.getUserFollowers(userId);
      followers.forEach(followerId => {
        sendNotification(followerId, {
          type: "livestream_started",
          title: "Новая трансляция",
          body: `${stream.title} началась!`,
          data: {
            streamId,
            userId,
          },
        });
      });

      return updatedStream;
    } catch (error) {
      console.error("Error starting livestream:", error);
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Не удалось запустить трансляцию",
      });
    }
  });