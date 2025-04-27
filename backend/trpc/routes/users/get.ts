import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";
import { db } from "@/backend/db";
import { TRPCError } from "@trpc/server";

export default protectedProcedure
  .input(z.object({
    userId: z.string(),
  }))
  .query(async ({ input }) => {
    const { userId } = input;
    
    const user = await db.getUserById(userId);
    
    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Пользователь не найден",
      });
    }
    
    return user;
  });