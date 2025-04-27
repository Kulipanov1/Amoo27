import { publicProcedure } from "@/backend/trpc/create-context";

export const hiProcedure = publicProcedure.query(() => {
  return {
    greeting: "Привет от tRPC!",
    timestamp: new Date().toISOString(),
  };
});