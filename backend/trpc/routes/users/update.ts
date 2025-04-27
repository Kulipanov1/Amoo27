import { protectedProcedure } from "@/backend/trpc/create-context";
import { UserUpdateSchema } from "@/backend/models/types";
import { db } from "@/backend/db";
import { TRPCError } from "@trpc/server";

export default protectedProcedure
  .input(UserUpdateSchema)
  .mutation(async ({ ctx, input }) => {
    const { userId } = ctx;
    
    const updatedUser = await db.updateUser(userId, {
      ...input,
      updatedAt: new Date().toISOString(),
    });
    
    if (!updatedUser) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Пользователь не найден",
      });
    }
    
    return updatedUser;
  });