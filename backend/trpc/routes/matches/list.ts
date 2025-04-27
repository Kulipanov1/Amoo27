import { protectedProcedure } from "@/backend/trpc/create-context";
import { db } from "@/backend/db";

export default protectedProcedure
  .query(async ({ ctx }) => {
    const { userId } = ctx;
    
    // Получаем все совпадения пользователя
    const matches = await db.getMatchesByUserId(userId);
    
    // Получаем информацию о пользователях
    const matchedUserIds = matches.map(match => 
      match.userId === userId ? match.matchedUserId : match.userId
    );
    
    const matchedUsers = await db.getUsersByIds(matchedUserIds);
    
    // Формируем результат
    const result = matches.map(match => {
      const matchedUserId = match.userId === userId ? match.matchedUserId : match.userId;
      const matchedUser = matchedUsers.find(user => user.id === matchedUserId);
      
      return {
        match,
        matchedUser,
      };
    });
    
    return result;
  });