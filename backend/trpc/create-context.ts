import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { isAuthenticated } from "../utils/auth";

// Context creation function
export const createContext = async (opts: FetchCreateContextFnOptions) => {
  try {
    // Log headers for debugging
    console.log("Request headers:", Object.fromEntries(opts.req.headers.entries()));
    
    return {
      req: opts.req,
      // You can add more context items here like database connections, auth, etc.
    };
  } catch (error) {
    console.error("Error creating context:", error);
    return {
      req: opts.req,
    };
  }
};

export type Context = Awaited<ReturnType<typeof createContext>>;

// Initialize tRPC
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    console.error("TRPC Error:", error);
    return {
      ...shape,
      message: error.message,
      data: {
        ...shape.data,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// Protected procedure requiring authentication
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  try {
    // For development, bypass authentication
    if (process.env.NODE_ENV === "development") {
      console.log("Development mode: bypassing authentication");
      return next({
        ctx: {
          ...ctx,
          user: { id: "mock-user-id", name: "Mock User" },
          userId: "mock-user-id",
        },
      });
    }
    
    const { user, userId } = await isAuthenticated(ctx);
    
    return next({
      ctx: {
        ...ctx,
        user,
        userId,
      },
    });
  } catch (error) {
    console.error("Authentication error:", error);
    
    // For development, allow requests without authentication
    if (process.env.NODE_ENV === "development") {
      console.log("Development mode: bypassing authentication");
      return next({
        ctx: {
          ...ctx,
          user: { id: "mock-user-id", name: "Mock User" },
          userId: "mock-user-id",
        },
      });
    }
    
    throw error;
  }
});

// Middleware for rate limiting
export const rateLimitMiddleware = t.middleware(async ({ ctx, next }) => {
  // In a real app, this would implement rate limiting logic
  // For example, using Redis
  
  return next({
    ctx,
  });
});

// Rate limited procedure
export const rateLimitedProcedure = publicProcedure.use(rateLimitMiddleware);