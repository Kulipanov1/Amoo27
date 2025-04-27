import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { db } from "@/backend/db";

export default publicProcedure
  .input(z.object({
    status: z.enum(["scheduled", "live", "ended"]).optional(),
  }))
  .query(async ({ input }) => {
    const { status } = input;
    
    // Получаем все трансляции
    const allStreams = await db.getActiveLiveStreams();
    
    // Фильтруем по статусу, если указан
    const filteredStreams = status
      ? allStreams.filter(stream => stream.status === status)
      : allStreams;
    
    // Получаем информацию о пользователях
    const userIds = filteredStreams.map(stream => stream.userId);
    const users = await db.getUsersByIds(userIds);
    
    // Формируем результат
    const result = filteredStreams.map(stream => {
      const user = users.find(user => user.id === stream.userId);
      
      return {
        stream,
        user,
      };
    });
    
    return result;
  });