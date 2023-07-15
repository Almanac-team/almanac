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

    getDetailedActivities: protectedProcedure.input(z.object({
        categoryId: z.string()
    })).query(({ctx, input}) => {
        const userId = ctx?.session?.user?.id
        return ctx.prisma.activity.findMany({
            where: {
                category: {
                    id: input.categoryId,
                    userId: userId
                }
            },
            include: {
                task: true,
                event: true
            }
        })
    }),

    getActivitySpecifics: protectedProcedure.input(z.object({
        activityIds: z.array(z.string())
    })).query(async ({ctx, input}) => {
        const userId = ctx?.session?.user?.id
        const ids = input.activityIds;
        const reverseMap = ids.map((id, index) => {
            return {id, index}
        }).sort((a, b) => {
            if (a.id < b.id) return -1
            if (a.id > b.id) return 1
            return 0
        })

        const tasks = await ctx.prisma.task.findMany({
            where: {
                activityId: {
                    in: ids
                },
                activity: {
                    category: {
                        userId: userId
                    }
                }
            },
            orderBy: {
                activityId: 'asc'
            }
        })
        const events = await ctx.prisma.event.findMany({
            where: {
                activityId: {
                    in: ids
                },
                activity: {
                    category: {
                        userId: userId
                    }
                }
            },
            orderBy: {
                activityId: 'asc'
            }
        })

        const result = []
        let tp = 0
        let ep = 0

        for (const item of reverseMap) {
            if (item.id === tasks[tp]?.activityId) {
                result.push(tasks[tp])
                tp++
            } else if (item.id === events[ep]?.activityId) {
                result.push(events[ep])
                ep++
            } else {
                result.push(null)
            }
        }

        if (tp !== tasks.length || ep !== events.length) return null

        return result
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