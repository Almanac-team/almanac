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

    createTask: protectedProcedure.input(z.object({
        categoryId: z.string(),
        name: z.string(),
        setting:
            z.object({
                at: z.date(),
                estimatedRequiredTime: z.number(),
                deadlineMod: z.number(),
                reminderMod: z.number(),
                startMod: z.number(),
            })
    })).mutation(({ctx, input}) => {
        const userId = ctx?.session?.user?.id
        return ctx.prisma.activity.create({
            data: {
                name: input.name,
                type: 'task',
                category: {
                    connect: {
                        id: input.categoryId,
                        userId: userId
                    }
                },
                task: {
                    create: {
                        dueDate: input.setting.at,
                        estimatedTime: input.setting.estimatedRequiredTime,
                        deadlineMod: input.setting.deadlineMod,
                        reminderMod: input.setting.reminderMod,
                        startMod: input.setting.startMod
                    }
                }
            }
        })
    }),

    createEvent: protectedProcedure.input(z.object({
        categoryId: z.string(),
        name: z.string(),
        setting:
            z.object({
                at: z.date(),
                estimatedRequiredTime: z.number(),
                reminderMod: z.number(),
                startMod: z.number(),
            })
    })).mutation(({ctx, input}) => {
        const userId = ctx?.session?.user?.id

        return ctx.prisma.activity.create({
            data: {
                name: input.name,
                type: 'event',
                category: {
                    connect: {
                        id: input.categoryId,
                        userId: userId
                    }
                },
                event: {
                    create: {
                        startDate: input.setting.at,
                        estimatedTime: input.setting.estimatedRequiredTime,
                        reminderMod: input.setting.reminderMod,
                        startMod: input.setting.startMod
                    }
                }
            }
        })
    })
})

export default activitiesRouter