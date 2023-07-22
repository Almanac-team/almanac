import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import userSettingsRouter from "./routers/userSettings";
import categoriesRouter from "~/server/api/routers/categories";
import activitiesRouter from "~/server/api/routers/activities";
import generatedEventsRouter from "~/server/api/routers/generateEvents";
import zonesRouter from "~/server/api/routers/zones";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  settings: userSettingsRouter,
  categories: categoriesRouter,
  activities: activitiesRouter,
  generatedEvents: generatedEventsRouter,
  zones: zonesRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
