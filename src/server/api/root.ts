import { createTRPCRouter } from '~/server/api/trpc';
import userSettingsRouter from './routers/userSettings';
import categoriesRouter from '~/server/api/routers/categories';
import generatedEventsRouter from '~/server/api/routers/generateEvents';
import zonesRouter from '~/server/api/routers/zones';
import regionsRouter from '~/server/api/routers/regions';
import activityDefinitionsRouter from '~/server/api/routers/activityDefinitions';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    settings: userSettingsRouter,
    categories: categoriesRouter,
    activityDefinitions: activityDefinitionsRouter,
    generatedEvents: generatedEventsRouter,
    zones: zonesRouter,
    regions: regionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
