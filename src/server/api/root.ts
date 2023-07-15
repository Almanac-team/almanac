import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import userSettingsRouter from "./routers/userSettings";
import categoriesRouter from "~/server/api/routers/categories";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  settings: userSettingsRouter,
  definitions: categoriesRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
