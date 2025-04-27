import { createTRPCRouter } from "./create-context";

// Import all route handlers
import { hiProcedure } from "./routes/example/hi/route";
import loginProcedure from "./routes/auth/login";
import logoutProcedure from "./routes/auth/logout";
import meProcedure from "./routes/auth/me";
import getUserProcedure from "./routes/users/get";
import updateUserProcedure from "./routes/users/update";
import userPreferencesProcedure from "./routes/users/preferences";
import potentialMatchesProcedure from "./routes/discover/potential-matches";
import likeProcedure from "./routes/discover/like";
import dislikeProcedure from "./routes/discover/dislike";
import superLikeProcedure from "./routes/discover/super-like";
import matchesListProcedure from "./routes/matches/list";
import getMatchProcedure from "./routes/matches/get";
import messagesListProcedure from "./routes/messages/list";
import sendMessageProcedure from "./routes/messages/send";
import markReadProcedure from "./routes/messages/mark-read";
import livestreamsListProcedure from "./routes/livestreams/list";
import createLivestreamProcedure from "./routes/livestreams/create";
import startLivestreamProcedure from "./routes/livestreams/start";
import endLivestreamProcedure from "./routes/livestreams/end";
import joinLivestreamProcedure from "./routes/livestreams/join";
import leaveLivestreamProcedure from "./routes/livestreams/leave";
import commentLivestreamProcedure from "./routes/livestreams/comment";
import likeLivestreamProcedure from "./routes/livestreams/like";

// Create the router with all routes
export const appRouter = createTRPCRouter({
  // Example route
  example: createTRPCRouter({
    hi: hiProcedure,
  }),
  
  // Auth routes
  auth: createTRPCRouter({
    login: loginProcedure,
    logout: logoutProcedure,
    me: meProcedure,
  }),
  
  // User routes
  users: createTRPCRouter({
    get: getUserProcedure,
    update: updateUserProcedure,
    preferences: userPreferencesProcedure,
  }),
  
  // Discovery routes
  discover: createTRPCRouter({
    potentialMatches: potentialMatchesProcedure,
    like: likeProcedure,
    dislike: dislikeProcedure,
    superLike: superLikeProcedure,
  }),
  
  // Matches routes
  matches: createTRPCRouter({
    list: matchesListProcedure,
    get: getMatchProcedure,
  }),
  
  // Messages routes
  messages: createTRPCRouter({
    list: messagesListProcedure,
    send: sendMessageProcedure,
    markRead: markReadProcedure,
  }),
  
  // Livestreams routes
  livestreams: createTRPCRouter({
    list: livestreamsListProcedure,
    create: createLivestreamProcedure,
    start: startLivestreamProcedure,
    end: endLivestreamProcedure,
    join: joinLivestreamProcedure,
    leave: leaveLivestreamProcedure,
    comment: commentLivestreamProcedure,
    like: likeLivestreamProcedure,
  }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;