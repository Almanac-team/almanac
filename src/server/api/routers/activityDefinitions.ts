import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import {
    type ActivityCompletions,
    type ActivityDefinition,
    type EndConfig,
    type RepeatConfig,
} from '~/components/activity/activity-definition-models';
import {
    type ActivitySetting,
    type EventSetting,
    type TaskSetting,
} from '~/components/activity/models';
import { ActivityType as PrismaActivityEnum, Prisma } from '@prisma/client';
import { type ZoneInfo } from '~/components/zone/models';
import {
    convertMinutesToTimeConfig,
    convertTimeConfigToMinutes,
} from '~/components/time_picker/models';

export const RepeatConfigZodSchema = z.object({
    every: z.number(),
    unit: z.union([
        z.object({
            type: z.literal('day'),
        }),
        z.object({
            type: z.literal('week'),
            weekDays: z.number(),
        }),
        z.object({
            type: z.literal('month'),
            monthDay: z.number(),
        }),
        z.object({
            type: z.literal('year'),
            month: z.number(),
            day: z.number(),
        }),
    ]),
});

function encodeRepeatConfig(repeatConfig: RepeatConfig): number {
    switch (repeatConfig.unit.type) {
        case 'day':
            return 0;
        case 'week':
            return repeatConfig.unit.weekDays;
        case 'month':
            return repeatConfig.unit.monthDay;
        case 'year':
            return repeatConfig.unit.month * 100 + repeatConfig.unit.day;
    }
}

const repeatConfig = Prisma.validator<Prisma.RepeatConfigArgs>()({
    select: {
        every: true,
        unit: true,
        info: true,
    },
});

export type PrismaRepeatConfigType = Prisma.RepeatConfigGetPayload<
    typeof repeatConfig
>;

function decodeRepeatConfig(
    repeatConfig: PrismaRepeatConfigType
): RepeatConfig {
    switch (repeatConfig.unit) {
        case 'day':
            return { every: repeatConfig.every, unit: { type: 'day' } };
        case 'week':
            return {
                every: repeatConfig.every,
                unit: { type: 'week', weekDays: repeatConfig.info },
            };
        case 'month':
            return {
                every: repeatConfig.every,
                unit: { type: 'month', monthDay: repeatConfig.info },
            };
        case 'year':
            return {
                every: repeatConfig.every,
                unit: {
                    type: 'year',
                    month: Math.floor(repeatConfig.info / 100),
                    day: repeatConfig.info % 100,
                },
            };
    }
}

const endConfig = Prisma.validator<Prisma.EndConfigArgs>()({
    select: {
        endType: true,
        endDate: true,
        endCount: true,
    },
});

export type PrismaEndConfigType = Prisma.EndConfigGetPayload<typeof endConfig>;

function decodeEndConfig(endConfig: PrismaEndConfigType): EndConfig {
    switch (endConfig.endType) {
        case 'count':
            return { type: 'count', count: endConfig.endCount };
        case 'until':
            return { type: 'until', until: endConfig.endDate };
        case 'never':
            return { type: 'never' };
    }
}

export const EndConfigSchema = z.discriminatedUnion('type', [
    z.object({
        type: z.literal('count'),
        count: z.number(),
    }),
    z.object({
        type: z.literal('until'),
        until: z.date(),
    }),
    z.object({
        type: z.literal('never'),
    }),
]);

export const TimeConfig = z.object({
    unit: z.enum(['year', 'month', 'week', 'day', 'hour', 'minute']),
    value: z.number(),
});
export const TaskSchema = z.object({
    at: z.date(),
    estimatedRequiredTime: z.number(),
    deadlineMod: TimeConfig,
    reminderMod: TimeConfig,
    startMod: TimeConfig,
});
export const EventSchema = z.object({
    at: z.date(),
    estimatedRequiredTime: z.number(),
    reminderMod: TimeConfig,
    startMod: TimeConfig,
});
export const ActivitySchema = z.object({
    name: z.string(),
    setting: z.discriminatedUnion('type', [
        z.object({
            type: z.literal('task'),
            value: TaskSchema,
        }),
        z.object({
            type: z.literal('event'),
            value: EventSchema,
        }),
    ]),
});

const activityWithDetails = Prisma.validator<Prisma.ActivityArgs>()({
    include: {
        task: true,
        event: true,

        activityZonePair: {
            include: {
                zone: true,
            },
        },
    },
});
export type PrismaActivityType = Prisma.ActivityGetPayload<
    typeof activityWithDetails
>;

export function ConvertActivity(
    activity: PrismaActivityType
): ActivitySetting | undefined {
    let setting:
        | { type: 'task'; value: TaskSetting }
        | { type: 'event'; value: EventSetting };

    if (activity.type === PrismaActivityEnum.task) {
        if (!activity.task) return undefined;
        const value = ConvertTask(activity.task);
        if (!value) return undefined;
        setting = { type: 'task', value };
    } else {
        if (!activity.event) return undefined;
        const value = ConvertEvent(activity.event);
        if (!value) return undefined;
        setting = { type: 'event', value };
    }

    if (!setting.value) {
        return undefined;
    }

    const include: ZoneInfo[] = [];
    const exclude: ZoneInfo[] = [];

    for (const pair of activity.activityZonePair) {
        const zone = {
            id: pair.zone.id,
            name: pair.zone.name,
            color: pair.zone.color,
        };
        if (pair.zoneType === 'include') {
            include.push(zone);
        } else if (pair.zoneType === 'exclude') {
            exclude.push(zone);
        }
    }

    return {
        id: activity.id,
        name: activity.name,
        zones: {
            include,
            exclude,
        },
        setting,
    };
}

const taskWithDetails = Prisma.validator<Prisma.TaskArgs>()({
    select: {
        activityId: true,
        dueDate: true,
        estimatedTime: true,
        deadlineMod: true,
        reminderMod: true,
        startMod: true,
    },
});
export type PrismaTaskType = Prisma.TaskGetPayload<typeof taskWithDetails>;

export function ConvertTask(task: PrismaTaskType): TaskSetting | null {
    if (task === null || task === undefined) return null;
    return {
        at: task.dueDate,
        estimatedRequiredTime: task.estimatedTime,
        deadlineMod: convertMinutesToTimeConfig(task.deadlineMod),
        reminderMod: convertMinutesToTimeConfig(task.reminderMod),
        startMod: convertMinutesToTimeConfig(task.startMod),
    };
}

const eventWithDetails = Prisma.validator<Prisma.EventArgs>()({
    select: {
        activityId: true,
        startDate: true,
        estimatedTime: true,
        reminderMod: true,
        startMod: true,
    },
});
export type PrismaEventType = Prisma.EventGetPayload<typeof eventWithDetails>;

export function ConvertEvent(event: PrismaEventType): EventSetting | null {
    if (event === null || event === undefined) return null;
    return {
        at: event.startDate,
        estimatedRequiredTime: event.estimatedTime,
        reminderMod: convertMinutesToTimeConfig(event.reminderMod),
        startMod: convertMinutesToTimeConfig(event.startMod),
    };
}

const getTaskSchema = (setting: z.infer<typeof TaskSchema>) => {
    return {
        dueDate: setting.at,
        estimatedTime: setting.estimatedRequiredTime,
        deadlineMod: convertTimeConfigToMinutes(setting.deadlineMod),
        reminderMod: convertTimeConfigToMinutes(setting.reminderMod),
        startMod: convertTimeConfigToMinutes(setting.startMod),
    };
};

const getEventSchema = (setting: z.infer<typeof EventSchema>) => {
    return {
        startDate: setting.at,
        estimatedTime: setting.estimatedRequiredTime,
        reminderMod: convertTimeConfigToMinutes(setting.reminderMod),
        startMod: convertTimeConfigToMinutes(setting.startMod),
    };
};

const getRepeatConfigSchema = (
    repeatConfig: z.infer<typeof RepeatConfigZodSchema>
) => {
    return {
        every: repeatConfig.every,
        unit: repeatConfig.unit.type,
        info: encodeRepeatConfig(repeatConfig),
    };
};

const getEndConfigSchema = (endConfig: z.infer<typeof EndConfigSchema>) => {
    return {
        endType: endConfig.type,
        endDate: endConfig.type === 'until' ? endConfig.until : new Date(0),
        endCount: endConfig.type === 'count' ? endConfig.count : 0,
    };
};

const activityCompletion = Prisma.validator<Prisma.ActivityCompletionsArgs>()({
    include: {
        exceptions: true,
    },
});
export type PrismaActivityCompletionType = Prisma.ActivityCompletionsGetPayload<
    typeof activityCompletion
>;

export function ConvertActivityCompletion(
    activityCompletion: PrismaActivityCompletionType
): ActivityCompletions | null {
    if (
        activityCompletion === null ||
        activityCompletion.exceptions === undefined
    )
        return null;

    const exceptions = new Set<number>();

    activityCompletion.exceptions.forEach((exception) => {
        exceptions.add(exception.index);
    });

    return {
        latestFinishedIndex: activityCompletion.latestFinishedIndex,
        exceptions,
    };
}

const activityDefinitionsRouter = createTRPCRouter({
    /**
     * This is an internal hook, don't use it. Use useQueryActivity from the data folder instead.
     */
    internalGet: protectedProcedure
        .input(
            z.object({
                activityDefinitionId: z.string(),
            })
        )
        .query(
            async ({
                ctx,
                input,
            }): Promise<
                | (ActivityDefinition & {
                      categoryId: string;
                  })
                | null
                | undefined
            > => {
                const userId = ctx.session.user.id ?? null;
                const activityDefinitionInfo =
                    await ctx.prisma.activityDefinition.findUnique({
                        where: {
                            id: input.activityDefinitionId,
                            category: {
                                userId: userId,
                            },
                        },
                        include: {
                            activities: {
                                include: {
                                    task: true,
                                    event: true,
                                    activityZonePair: {
                                        include: {
                                            zone: true,
                                        },
                                    },
                                },
                            },
                            repeatConfig: true,
                            endConfig: true,
                            activityCompletions: {
                                include: {
                                    exceptions: true,
                                },
                            },
                        },
                    });
                if (!activityDefinitionInfo) return null;

                const rawActivitySettings = activityDefinitionInfo.activities;
                if (rawActivitySettings === undefined) return undefined;

                const rawActivitySetting = rawActivitySettings[0];
                if (rawActivitySetting === undefined) return undefined;

                const activity = ConvertActivity(rawActivitySetting);
                if (!activity) return undefined;

                const activityCompletions =
                    activityDefinitionInfo.activityCompletions
                        ? ConvertActivityCompletion(
                              activityDefinitionInfo.activityCompletions
                          ) ?? undefined
                        : undefined;

                return {
                    id: activityDefinitionInfo.id,
                    data: {
                        type: 'single',
                        activitySetting: activity,
                    },
                    activityCompletions,
                    categoryId: activityDefinitionInfo.categoryId,
                };
            }
        ),

    /**
     * This is an internal hook, don't use it. Use useQueryActivities from the data folder instead.
     */
    internalGetByCategory: protectedProcedure
        .input(
            z.object({
                categoryId: z.string(),
            })
        )
        .query(async ({ ctx, input }): Promise<ActivityDefinition[]> => {
            const userId = ctx.session.user.id ?? null;
            const activityDefinitionInfos =
                await ctx.prisma.activityDefinition.findMany({
                    where: {
                        category: {
                            id: input.categoryId,
                            userId: userId,
                        },
                    },
                    include: {
                        activities: {
                            include: {
                                task: true,
                                event: true,
                                activityZonePair: {
                                    include: {
                                        zone: true,
                                    },
                                },
                            },
                        },
                        repeatConfig: true,
                        endConfig: true,
                        activityCompletions: {
                            include: {
                                exceptions: true,
                            },
                        },
                    },
                });

            return activityDefinitionInfos
                .map(
                    (
                        activityDefinitionInfo
                    ): ActivityDefinition | undefined => {
                        if (!activityDefinitionInfo) return undefined;

                        if (
                            !activityDefinitionInfo.repeatConfig ||
                            !activityDefinitionInfo.endConfig
                        ) {
                            const rawActivitySettings =
                                activityDefinitionInfo.activities;
                            if (rawActivitySettings === undefined)
                                return undefined;

                            const rawActivitySetting = rawActivitySettings[0];
                            if (rawActivitySetting === undefined)
                                return undefined;

                            const activity =
                                ConvertActivity(rawActivitySetting);
                            if (!activity) return undefined;

                            const activityCompletions =
                                activityDefinitionInfo.activityCompletions
                                    ? ConvertActivityCompletion(
                                          activityDefinitionInfo.activityCompletions
                                      ) ?? undefined
                                    : undefined;

                            return {
                                id: activityDefinitionInfo.id,
                                data: {
                                    type: 'single',
                                    activitySetting: activity,
                                },
                                activityCompletions,
                            };
                        } else {
                            const rawActivitySettings =
                                activityDefinitionInfo.activities;
                            if (rawActivitySettings === undefined)
                                return undefined;

                            const rawActivitySetting = rawActivitySettings[0];
                            if (rawActivitySetting === undefined)
                                return undefined;

                            const activity =
                                ConvertActivity(rawActivitySetting);
                            if (!activity) return undefined;

                            const activityCompletions =
                                activityDefinitionInfo.activityCompletions
                                    ? ConvertActivityCompletion(
                                          activityDefinitionInfo.activityCompletions
                                      ) ?? undefined
                                    : undefined;

                            return {
                                id: activityDefinitionInfo.id,
                                data: {
                                    type: 'repeating',
                                    activitySetting: activity,
                                    repeatConfig: decodeRepeatConfig(
                                        activityDefinitionInfo.repeatConfig
                                    ),
                                    endConfig: decodeEndConfig(
                                        activityDefinitionInfo.endConfig
                                    ),
                                    exceptions: new Map(),
                                },
                                activityCompletions,
                            };
                        }
                    }
                )
                .filter((x) => x !== undefined) as ActivityDefinition[];
        }),

    /**
     * This is an internal hook, don't use it. Use useQueryActivities from the data folder instead.
     */
    internalGetAll: protectedProcedure.query(
        async ({ ctx }): Promise<ActivityDefinition[]> => {
            const userId = ctx.session.user.id ?? null;
            const activityDefinitionInfos =
                await ctx.prisma.activityDefinition.findMany({
                    where: {
                        category: {
                            userId: userId,
                        },
                    },
                    include: {
                        activities: {
                            include: {
                                task: true,
                                event: true,
                                activityZonePair: {
                                    include: {
                                        zone: true,
                                    },
                                },
                            },
                        },
                        repeatConfig: true,
                        endConfig: true,
                        activityCompletions: {
                            include: {
                                exceptions: true,
                            },
                        },
                    },
                });

            return activityDefinitionInfos
                .map(
                    (
                        activityDefinitionInfo
                    ): ActivityDefinition | undefined => {
                        if (!activityDefinitionInfo) return undefined;

                        if (
                            !activityDefinitionInfo.repeatConfig ||
                            !activityDefinitionInfo.endConfig
                        ) {
                            const rawActivitySettings =
                                activityDefinitionInfo.activities;
                            if (rawActivitySettings === undefined)
                                return undefined;

                            const rawActivitySetting = rawActivitySettings[0];
                            if (rawActivitySetting === undefined)
                                return undefined;

                            const activity =
                                ConvertActivity(rawActivitySetting);
                            if (!activity) return undefined;

                            const activityCompletions =
                                activityDefinitionInfo.activityCompletions
                                    ? ConvertActivityCompletion(
                                          activityDefinitionInfo.activityCompletions
                                      ) ?? undefined
                                    : undefined;

                            return {
                                id: activityDefinitionInfo.id,
                                data: {
                                    type: 'single',
                                    activitySetting: activity,
                                },
                                activityCompletions,
                            };
                        } else {
                            const rawActivitySettings =
                                activityDefinitionInfo.activities;
                            if (rawActivitySettings === undefined)
                                return undefined;

                            const rawActivitySetting = rawActivitySettings[0];
                            if (rawActivitySetting === undefined)
                                return undefined;

                            const activity =
                                ConvertActivity(rawActivitySetting);
                            if (!activity) return undefined;

                            const activityCompletions =
                                activityDefinitionInfo.activityCompletions
                                    ? ConvertActivityCompletion(
                                          activityDefinitionInfo.activityCompletions
                                      ) ?? undefined
                                    : undefined;

                            return {
                                id: activityDefinitionInfo.id,
                                data: {
                                    type: 'repeating',
                                    activitySetting: activity,
                                    repeatConfig: decodeRepeatConfig(
                                        activityDefinitionInfo.repeatConfig
                                    ),
                                    endConfig: decodeEndConfig(
                                        activityDefinitionInfo.endConfig
                                    ),
                                    exceptions: new Map(),
                                },
                                activityCompletions,
                            };
                        }
                    }
                )
                .filter((x) => x !== undefined) as ActivityDefinition[];
        }
    ),

    createActivityDefinition: protectedProcedure
        .input(
            z.object({
                categoryId: z.string(),
                data: z.discriminatedUnion('type', [
                    z.object({
                        type: z.literal('single'),
                        activitySetting: ActivitySchema,
                    }),
                    z.object({
                        type: z.literal('repeating'),
                        activitySetting: ActivitySchema,
                        repeatConfig: RepeatConfigZodSchema,
                        endConfig: EndConfigSchema,
                    }),
                ]),
            })
        )
        .mutation(async ({ ctx, input }): Promise<string> => {
            const userId = ctx.session.user.id ?? null;

            if (input.data.type === 'single') {
                const activitySetting = input.data.activitySetting;

                return ctx.prisma.activityDefinition
                    .create({
                        data: {
                            category: {
                                connect: {
                                    id: input.categoryId,
                                    userId: userId,
                                },
                            },
                            activities: {
                                create: {
                                    name: activitySetting.name,
                                    type: activitySetting.setting.type,
                                    task:
                                        activitySetting.setting.type === 'task'
                                            ? {
                                                  create: getTaskSchema(
                                                      activitySetting.setting
                                                          .value
                                                  ),
                                              }
                                            : undefined,
                                    event:
                                        activitySetting.setting.type === 'event'
                                            ? {
                                                  create: getEventSchema(
                                                      activitySetting.setting
                                                          .value
                                                  ),
                                              }
                                            : undefined,
                                },
                            },
                        },
                    })
                    .then((activity) => activity.id);
            } else {
                const activitySetting = input.data.activitySetting;

                return ctx.prisma.activityDefinition
                    .create({
                        data: {
                            category: {
                                connect: {
                                    id: input.categoryId,
                                    userId: userId,
                                },
                            },
                            activities: {
                                create: {
                                    name: activitySetting.name,
                                    type: activitySetting.setting.type,
                                    task:
                                        activitySetting.setting.type === 'task'
                                            ? {
                                                  create: getTaskSchema(
                                                      activitySetting.setting
                                                          .value
                                                  ),
                                              }
                                            : undefined,
                                    event:
                                        activitySetting.setting.type === 'event'
                                            ? {
                                                  create: getEventSchema(
                                                      activitySetting.setting
                                                          .value
                                                  ),
                                              }
                                            : undefined,
                                },
                            },
                            repeatConfig: {
                                create: {
                                    every: input.data.repeatConfig.every,
                                    unit: input.data.repeatConfig.unit.type,
                                    info: encodeRepeatConfig(
                                        input.data.repeatConfig
                                    ),
                                },
                            },
                            endConfig: {
                                create: {
                                    endType: input.data.endConfig.type,
                                    endDate:
                                        input.data.endConfig.type === 'until'
                                            ? input.data.endConfig.until
                                            : '0',
                                    endCount:
                                        input.data.endConfig.type === 'count'
                                            ? input.data.endConfig.count
                                            : 0,
                                },
                            },
                        },
                    })
                    .then((activity) => activity.id);
            }
        }),

    updateActivityDefinition: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                data: z.discriminatedUnion('type', [
                    z.object({
                        type: z.literal('single'),
                        activitySetting: ActivitySchema,
                    }),
                    z.object({
                        type: z.literal('repeating'),
                        activitySetting: ActivitySchema,
                        repeatConfig: RepeatConfigZodSchema,
                        endConfig: EndConfigSchema,
                    }),
                ]),
            })
        )
        .mutation(async ({ ctx, input }): Promise<string> => {
            const userId = ctx.session.user.id ?? null;

            if (input.data.type === 'single') {
                const activitySetting = input.data.activitySetting;

                const [, , createResult] = await ctx.prisma.$transaction([
                    ctx.prisma.repeatConfig.deleteMany({
                        where: {
                            activityDefinitionId: input.id,
                            activityDefinition: {
                                category: {
                                    userId: userId,
                                },
                            },
                        },
                    }),
                    ctx.prisma.endConfig.deleteMany({
                        where: {
                            activityDefinitionId: input.id,
                            activityDefinition: {
                                category: {
                                    userId: userId,
                                },
                            },
                        },
                    }),
                    ctx.prisma.activityDefinition.update({
                        where: {
                            id: input.id,
                            category: {
                                userId: userId,
                            },
                        },
                        data: {
                            activities: {
                                deleteMany: {},
                                create: {
                                    name: activitySetting.name,
                                    type: activitySetting.setting.type,
                                    task:
                                        activitySetting.setting.type === 'task'
                                            ? {
                                                  create: getTaskSchema(
                                                      activitySetting.setting
                                                          .value
                                                  ),
                                              }
                                            : undefined,
                                    event:
                                        activitySetting.setting.type === 'event'
                                            ? {
                                                  create: getEventSchema(
                                                      activitySetting.setting
                                                          .value
                                                  ),
                                              }
                                            : undefined,
                                },
                            },
                        },
                    }),
                ]);
                return createResult.id;
            } else {
                const activitySetting = input.data.activitySetting;

                return ctx.prisma.activityDefinition
                    .update({
                        where: {
                            id: input.id,
                            category: {
                                userId: userId,
                            },
                        },
                        data: {
                            activities: {
                                deleteMany: {},
                                create: {
                                    name: activitySetting.name,
                                    type: activitySetting.setting.type,
                                    task:
                                        activitySetting.setting.type === 'task'
                                            ? {
                                                  create: getTaskSchema(
                                                      activitySetting.setting
                                                          .value
                                                  ),
                                              }
                                            : undefined,
                                    event:
                                        activitySetting.setting.type === 'event'
                                            ? {
                                                  create: getEventSchema(
                                                      activitySetting.setting
                                                          .value
                                                  ),
                                              }
                                            : undefined,
                                },
                            },
                            repeatConfig: {
                                upsert: {
                                    create: getRepeatConfigSchema(
                                        input.data.repeatConfig
                                    ),
                                    update: getRepeatConfigSchema(
                                        input.data.repeatConfig
                                    ),
                                },
                            },
                            endConfig: {
                                upsert: {
                                    create: getEndConfigSchema(
                                        input.data.endConfig
                                    ),
                                    update: getEndConfigSchema(
                                        input.data.endConfig
                                    ),
                                },
                            },
                        },
                    })
                    .then((activity) => activity.id);
            }
        }),

    updateActivityCompletions: protectedProcedure
        .input(
            z.object({
                activityDefinitionId: z.string(),
                newIndex: z.number(),
                exceptions: z.array(z.number()),
            })
        )
        .mutation(async ({ ctx, input }): Promise<boolean> => {
            const userId = ctx.session.user.id ?? null;

            const [, upsert] = await ctx.prisma.$transaction([
                ctx.prisma.activityCompletionExceptions.deleteMany({
                    where: {
                        activityDefinitionId: input.activityDefinitionId,
                        activityCompletion: {
                            activityDefinition: {
                                category: {
                                    userId: userId,
                                },
                            },
                        },
                        index: {
                            notIn: input.exceptions,
                        },
                    },
                }),

                ctx.prisma.activityCompletions.upsert({
                    where: {
                        activityDefinitionId: input.activityDefinitionId,
                        activityDefinition: {
                            category: {
                                userId: userId,
                            },
                        },
                    },
                    create: {
                        activityDefinitionId: input.activityDefinitionId,
                        latestFinishedIndex: input.newIndex,
                        exceptions: {
                            create: input.exceptions.map((index) => ({
                                index: index,
                            })),
                        },
                    },
                    update: {
                        latestFinishedIndex: input.newIndex,
                        exceptions: {
                            createMany: {
                                data: input.exceptions.map((index) => ({
                                    index: index,
                                })),
                                skipDuplicates: true,
                            },
                        },
                    },
                }),
            ]);

            return upsert.latestFinishedIndex === input.newIndex;
        }),
});

export default activityDefinitionsRouter
