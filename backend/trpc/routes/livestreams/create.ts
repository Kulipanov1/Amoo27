import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";
import { TRPCError } from "@trpc/server";
import { db } from "@/backend/db";

export default protectedProcedure
  .input(
    z.object({
      title: z.string().min(1).max(100),
      description: z.string().max(500).optional(),
      scheduledFor: z.string().optional(),
      thumbnail: z.string().url().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const { userId } = ctx;
      const { title, description, scheduledFor, thumbnail } = input;

      // Проверяем, нет ли уже активной трансляции у пользователя
      const existingLiveStream = await db.getLiveStreamByUserId(userId);
      if (existingLiveStream && existingLiveStream.status === "live") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "У вас уже есть активная трансляция",
        });
      }

      // Создаем новую трансляцию
      const streamId = `stream-${Date.now()}`;
      const stream = await db.createLiveStream({
        id: streamId,
        userId,
        title,
        description,
        scheduledFor,
        thumbnail,
        status: scheduledFor ? "scheduled" : "live",
      });

      return stream;
    } catch (error) {
      console.error("Error creating livestream:", error);
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Не удалось создать трансляцию",
      });
    }
  });