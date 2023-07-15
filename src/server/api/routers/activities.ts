import {z} from 'zod';
import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc"

const activitiesRouter = createTRPCRouter({
    getActivities: protectedProcedure.input(z.object({
        categoryId: z.string()
    })).query(({ctx, input}) => {
        const userId = ctx?.session?.user?.id
        return ctx.prisma.activity.findMany({
            where: {
                category: {
                    id: input.categoryId,
                    userId: userId
                }
            }
        })
    }),

    getTask: protectedProcedure.input(z.object({
        id: z.string()
    })).query(({ctx, input}) => {
        const userId = ctx?.session?.user?.id
        return ctx.prisma.task.findUnique({
            where: {
                activityId: input.id,
                activity: {
                    category: {
                        userId: userId
                    }
                }
            }
        })
    }),

    getEvent: protectedProcedure.input(z.object({
        id: z.string()
    })).query(({ctx, input}) => {
        const userId = ctx?.session?.user?.id
        return ctx.prisma.event.findUnique({
            where: {
                activityId: input.id,
                activity: {
                    category: {
                        userId: userId
                    }
                }
            }
        })
    }),
})

export default activitiesRouter