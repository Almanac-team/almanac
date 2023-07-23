import {z} from 'zod';
import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc"
import {ActivityType as PrismaActivityType, type PrismaClient} from ".prisma/client";
import {type TimeConfig as InternalTimeConfig} from "~/components/time_picker/date";
import {ActivitySetting, ActivityType, EventSetting, TaskSetting} from "~/components/activity/models";

const TimeConfig = z.object({
    unit: z.enum(['year', 'month', 'week', 'day', 'hour', 'minute']),
    value: z.number()
});

function convertIntToTimeConfig(time: number): InternalTimeConfig {
    if (time >= 525600) {
        return {
            unit: 'year',
            value: time / 525600
        }
    } else if (time >= 43200) {
        return {
            unit: 'month',
            value: time / 43200
        }
    } else if (time >= 10080) {
        return {
            unit: 'week',
            value: time / 10080
        }
    } else if (time >= 1440) {
        return {
            unit: 'day',
            value: time / 1440
        }
    } else if (time >= 60) {
        return {
            unit: 'hour',
            value: time / 60
        }
    } else {
        return {
            unit: 'minute',
            value: time
        }
    }
}

function convertTimeConfigToInt(timeConfig: InternalTimeConfig): number {
    switch (timeConfig.unit) {
        case "minute":
            return timeConfig.value;
        case "hour":
            return timeConfig.value * 60;
        case "day":
            return timeConfig.value * 24 * 60;
        case "week":
            return timeConfig.value * 7 * 24 * 60;
        case "month":
            return timeConfig.value * 30 * 24 * 60;
        case "year":
            return timeConfig.value * 365 * 24 * 60;
    }
}

function ConvertTask(task: {
    activityId: string,
    dueDate: Date,
    estimatedTime: number,
    deadlineMod: number,
    reminderMod: number,
    startMod: number
} | null | undefined): TaskSetting | null {
    if (task === null || task === undefined) return null
    return {
        at: task.dueDate,
        estimatedRequiredTime: task.estimatedTime,
        deadlineMod: convertIntToTimeConfig(task.deadlineMod),
        reminderMod: convertIntToTimeConfig(task.reminderMod),
        startMod: convertIntToTimeConfig(task.startMod)
    }
}

function ConvertEvent(event: {
    activityId: string,
    startDate: Date,
    estimatedTime: number,
    reminderMod: number,
    startMod: number
} | null | undefined): EventSetting | null {
    if (event === null || event === undefined) return null
    return {
        at: event.startDate,
        estimatedRequiredTime: event.estimatedTime,
        reminderMod: convertIntToTimeConfig(event.reminderMod),
        startMod: convertIntToTimeConfig(event.startMod)
    }
}

export async function getDetailedActivities(prisma: PrismaClient, userId: string, categoryId?: string | undefined): Promise<ActivitySetting<TaskSetting | EventSetting>[]> {
    return (await prisma.activity.findMany({
        where: {
            category: {
                id: categoryId,
                userId: userId
            }
        },
        include: {
            task: true,
            event: true
        }
    })).map((activity): ActivitySetting<TaskSetting | EventSetting> | undefined => {
        let setting;
        if (activity.type === PrismaActivityType.task) {
            setting = ConvertTask(activity.task);
        } else if (activity.type === PrismaActivityType.event) {
            setting = ConvertEvent(activity.event);
        }

        if (setting === null || setting === undefined) {
            return undefined
        }

        return {
            id: activity.id,
            name: activity.name,
            activityType: activity.type === PrismaActivityType.task ? 'task' : 'event' as ActivityType,
            setting
        }
    }).filter((activity): activity is ActivitySetting<TaskSetting | EventSetting> => {
        return activity !== undefined
    })
}

const activitiesRouter = createTRPCRouter({
    getActivities: protectedProcedure.input(z.object({
        categoryId: z.string()
    })).query(async ({ctx, input}): Promise<ActivitySetting<undefined>[]> => {
        const userId = ctx?.session?.user?.id
        return (await ctx.prisma.activity.findMany({
            where: {
                category: {
                    id: input.categoryId,
                    userId: userId
                }
            }
        })).map((activity): ActivitySetting<undefined> => {
            return {
                id: activity.id,
                name: activity.name,
                activityType: activity.type === PrismaActivityType.task ? 'task' : 'event' as ActivityType,
                setting: undefined
            }
        })
    }),

    getDetailedActivities: protectedProcedure.input(z.object({
        categoryId: z.string()
    })).query(async ({ctx, input}): Promise<ActivitySetting<TaskSetting | EventSetting>[]> => {
        const userId = ctx?.session?.user?.id
        return getDetailedActivities(ctx.prisma, userId, input.categoryId);
    }),

    getActivitySpecifics: protectedProcedure.input(z.object({
        activityIds: z.array(z.string())
    })).query(async ({ctx, input}): Promise<(TaskSetting | EventSetting | null)[] | null> => {
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
                result.push(ConvertTask(tasks[tp]))
                tp++
            } else if (item.id === events[ep]?.activityId) {
                result.push(ConvertEvent(events[ep]))
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
    })).query(async ({ctx, input}) => {
        const userId = ctx?.session?.user?.id
        return ConvertTask(await ctx.prisma.task.findUnique({
            where: {
                activityId: input.id,
                activity: {
                    category: {
                        userId: userId
                    }
                }
            }
        }))
    }),

    getEvent: protectedProcedure.input(z.object({
        id: z.string()
    })).query(async ({ctx, input}) => {
        const userId = ctx?.session?.user?.id
        return ConvertEvent(await ctx.prisma.event.findUnique({
            where: {
                activityId: input.id,
                activity: {
                    category: {
                        userId: userId
                    }
                }
            }
        }))
    }),

    createTask: protectedProcedure.input(z.object({
        categoryId: z.string(),
        name: z.string(),
        setting:
            z.object({
                at: z.date(),
                estimatedRequiredTime: z.number(),
                deadlineMod: TimeConfig,
                reminderMod: TimeConfig,
                startMod: TimeConfig,
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
                        deadlineMod: convertTimeConfigToInt(input.setting.deadlineMod),
                        reminderMod: convertTimeConfigToInt(input.setting.reminderMod),
                        startMod: convertTimeConfigToInt(input.setting.startMod)
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
                reminderMod: TimeConfig,
                startMod: TimeConfig,
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
                        reminderMod: convertTimeConfigToInt(input.setting.reminderMod),
                        startMod: convertTimeConfigToInt(input.setting.startMod)
                    }
                }
            }
        })
    }),

    updateTask: protectedProcedure.input(z.object({
        id: z.string(),
        name: z.string(),
        setting:
            z.object({
                at: z.date(),
                estimatedRequiredTime: z.number(),
                deadlineMod: TimeConfig,
                reminderMod: TimeConfig,
                startMod: TimeConfig,
            })
    })).mutation(async ({ctx, input}) => {
        const userId = ctx?.session?.user?.id
        return ctx.prisma.activity.update({
            where: {
                id: input.id,
                category: {
                    userId: userId
                }
            },
            data: {
                name: input.name,
                task: {
                    update: {
                        dueDate: input.setting.at,
                        estimatedTime: input.setting.estimatedRequiredTime,
                        deadlineMod: convertTimeConfigToInt(input.setting.deadlineMod),
                        reminderMod: convertTimeConfigToInt(input.setting.reminderMod),
                        startMod: convertTimeConfigToInt(input.setting.startMod)

                    }
                }
            }
        })
    }),

    updateEvent: protectedProcedure.input(z.object({
        id: z.string(),
        name: z.string(),
        setting:
            z.object({
                at: z.date(),
                estimatedRequiredTime: z.number(),
                reminderMod: TimeConfig,
                startMod: TimeConfig,
            })
    })).mutation(async ({ctx, input}) => {
        const userId = ctx?.session?.user?.id
        return ctx.prisma.activity.update({
            where: {
                id: input.id,
                category: {
                    userId: userId
                }
            },
            data: {
                name: input.name,
                event: {
                    update: {
                        startDate: input.setting.at,
                        estimatedTime: input.setting.estimatedRequiredTime,
                        reminderMod: convertTimeConfigToInt(input.setting.reminderMod),
                        startMod: convertTimeConfigToInt(input.setting.startMod)
                    }
                }
            }
        })
    })
})

export default activitiesRouter