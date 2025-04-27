import { protectedProcedure } from "@/backend/trpc/create-context";
import { LogoutSchema } from "@/backend/models/types";

export default protectedProcedure
  .input(LogoutSchema)
  .mutation(async ({ ctx }) => {
    // В реальном приложении здесь можно добавить логику для инвалидации токена
    // Например, добавить токен в черный список или обновить время последнего выхода
    
    return { success: true };
  });