import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { type GeneratedEvent } from '~/pages/sprint';
import { getDetailedActivities } from '~/server/api/routers/activities';
import { isEvent, isTask } from '~/components/activity/activity-settings';
import { generateEvents } from '~/server/eventGeneration';
import {
	type ActivitySetting,
	type EventSetting,
	type TaskSetting,
} from '~/components/activity/models';

const generatedEventsRouter = createTRPCRouter({
	createGeneratedEvents: protectedProcedure
		.input(
			z.object({
				firstDayOfWeek: z.date(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const userId: string = ctx?.session?.user?.id;
			const activities = await getDetailedActivities(ctx.prisma, userId);

			const tasks = activities.filter((activity) =>
				isTask(activity)
			) as ActivitySetting<TaskSetting>[];
			const events = activities.filter((activity) =>
				isEvent(activity)
			) as ActivitySetting<EventSetting>[];

			const generatedEvents = generateEvents(
				tasks,
				events,
				input.firstDayOfWeek
			);

			return (
				await ctx.prisma.generatedEvent.createMany({
					data: generatedEvents.map((generatedEvent) => {
						return {
							activityId: generatedEvent.activityId,
							date: generatedEvent.date,
							hours: generatedEvent.hours,
						};
					}),
				})
			).count;
		}),

	getGeneratedEvents: protectedProcedure.query(
		async ({ ctx }): Promise<GeneratedEvent[]> => {
			const userId: string = ctx?.session?.user?.id;
			return (
				await ctx.prisma.generatedEvent.findMany({
					where: {
						activity: {
							category: {
								userId: userId,
							},
						},
					},
					include: {
						activity: {
							select: {
								name: true,
							},
						},
					},
				})
			).map((generatedEvent) => {
				return {
					id: generatedEvent.id,
					activityId: generatedEvent.activityId,
					name: generatedEvent.activity.name,
					date: generatedEvent.date,
					hours: generatedEvent.hours,
				};
			});
		}
	),
});

export default generatedEventsRouter;
