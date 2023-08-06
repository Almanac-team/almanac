import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import {
    type ActivityDefinitionUnion,
    type EndConfig,
    type RepeatConfig,
} from '~/components/activity/activity-definition-models';
import {
    ConvertActivity,
    convertTimeConfigToInt,
    EventActivitySchema,
    type EventSchema,
    TaskActivitySchema,
    type TaskSchema,
} from '~/server/api/routers/activities';
import { type TimeConfig } from '~/components/time_picker/date';
import { TaskSetting } from '~/components/activity/models';
import { type RepeatUnit } from '@prisma/client';
import { Prisma } from '.prisma/client';

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

const getTaskSchema = (setting: z.infer<typeof TaskSchema>) => {
    return {
        dueDate: setting.at,
        estimatedTime: setting.estimatedRequiredTime,
        deadlineMod: convertTimeConfigToInt(setting.deadlineMod),
        reminderMod: convertTimeConfigToInt(setting.reminderMod),
        startMod: convertTimeConfigToInt(setting.startMod),
    };
};

const getEventSchema = (setting: z.infer<typeof EventSchema>) => {
    return {
        startDate: setting.at,
        estimatedTime: setting.estimatedRequiredTime,
        reminderMod: convertTimeConfigToInt(setting.reminderMod),
        startMod: convertTimeConfigToInt(setting.startMod),
    };
};

// const getEventActivitySchema = (
//     activitySetting: z.infer<typeof EventActivitySchema>
// ) => {
//     return {
//         ...getEventSchema(activitySetting.setting),
//         type: 'event' as ActivityType,
//         name: activitySetting.name,
//     };
// };
//
// const getTaskActivitySchema = (
//     activitySetting: z.infer<typeof TaskActivitySchema>
// ) => {
//     return {
//         ...getTaskSchema(activitySetting.setting),
//         type: 'task' as ActivityType,
//         name: activitySetting.name,
//     };
// };
//
// const getActivitySchema = (
//     activitySetting:
//         | z.infer<typeof TaskActivitySchema>
//         | z.infer<typeof EventActivitySchema>
// ) => {
//     switch (activitySetting.activityType) {
//         case 'task':
//             return getTaskActivitySchema(activitySetting);
//         case 'event':
//             return getEventActivitySchema(activitySetting);
//     }
// };

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
                | (ActivityDefinitionUnion & {
                      categoryId: string;
                  })
                | null
                | undefined
            > => {
                const userId = ctx.session.user.id;
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
                                    ActivityZonePair: {
                                        include: {
                                            zone: true,
                                        },
                                    },
                                },
                            },
                            repeatConfig: true,
                            endConfig: true,
                        },
                    });
                if (!activityDefinitionInfo) return null;

                const rawActivitySettings = activityDefinitionInfo.activities;
                if (rawActivitySettings === undefined) return undefined;

                const rawActivitySetting = rawActivitySettings[0];
                if (rawActivitySetting === undefined) return undefined;

                const activity = ConvertActivity(rawActivitySetting);
                if (!activity) return undefined;

                if (activityDefinitionInfo.repeatConfig === null) {
                    return {
                        id: activityDefinitionInfo.id,
                        data: {
                            type: 'single',
                            activitySetting: activity,
                        },

                        categoryId: activityDefinitionInfo.categoryId,
                    };
                }
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
        .query(async ({ ctx, input }): Promise<ActivityDefinitionUnion[]> => {
            const userId = ctx.session.user.id;
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
                                ActivityZonePair: {
                                    include: {
                                        zone: true,
                                    },
                                },
                            },
                        },
                        repeatConfig: true,
                        endConfig: true,
                    },
                });

            return activityDefinitionInfos
                .map(
                    (
                        activityDefinitionInfo
                    ): ActivityDefinitionUnion | undefined => {
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

                            return {
                                id: activityDefinitionInfo.id,
                                data: {
                                    type: 'single',
                                    activitySetting: activity,
                                },
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
                            };
                        }
                    }
                )
                .filter((x) => x !== undefined) as ActivityDefinitionUnion[];
        }),

    createTaskDefinition: protectedProcedure
        .input(
            z.object({
                categoryId: z.string(),
                data: z.discriminatedUnion('type', [
                    z.object({
                        type: z.literal('single'),
                        activitySetting: TaskActivitySchema,
                    }),
                    z.object({
                        type: z.literal('repeating'),
                        activitySetting: TaskActivitySchema,
                        repeatConfig: RepeatConfigZodSchema,
                        endConfig: EndConfigSchema,
                    }),
                ]),
            })
        )
        .mutation(async ({ ctx, input }): Promise<string> => {
            const userId = ctx?.session?.user?.id;

            if (input.data.type === 'single') {
                const activitySetting = input.data.activitySetting;
                const setting = activitySetting.setting;

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
                                    type: 'task',
                                    task: {
                                        create: {
                                            dueDate: setting.at,
                                            estimatedTime:
                                                setting.estimatedRequiredTime,
                                            deadlineMod: convertTimeConfigToInt(
                                                setting.deadlineMod
                                            ),
                                            reminderMod: convertTimeConfigToInt(
                                                setting.reminderMod
                                            ),
                                            startMod: convertTimeConfigToInt(
                                                setting.startMod
                                            ),
                                        },
                                    },
                                },
                            },
                        },
                    })
                    .then((activity) => activity.id);
            } else {
                const activitySetting = input.data.activitySetting;
                const setting = activitySetting.setting;

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
                                    type: 'task',
                                    task: {
                                        create: {
                                            dueDate: setting.at,
                                            estimatedTime:
                                                setting.estimatedRequiredTime,
                                            deadlineMod: convertTimeConfigToInt(
                                                setting.deadlineMod
                                            ),
                                            reminderMod: convertTimeConfigToInt(
                                                setting.reminderMod
                                            ),
                                            startMod: convertTimeConfigToInt(
                                                setting.startMod
                                            ),
                                        },
                                    },
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

    createEventDefinition: protectedProcedure
        .input(
            z.object({
                categoryId: z.string(),
                data: z.discriminatedUnion('type', [
                    z.object({
                        type: z.literal('single'),
                        activitySetting: EventActivitySchema,
                    }),
                    z.object({
                        type: z.literal('repeating'),
                        activitySetting: EventActivitySchema,
                        repeatConfig: RepeatConfigZodSchema,
                        endConfig: EndConfigSchema,
                    }),
                ]),
            })
        )
        .mutation(async ({ ctx, input }): Promise<string> => {
            const userId = ctx?.session?.user?.id;

            if (input.data.type === 'single') {
                const activitySetting = input.data.activitySetting;
                const setting = activitySetting.setting;

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
                                    type: 'event',
                                    event: {
                                        create: {
                                            startDate: setting.at,
                                            estimatedTime:
                                                setting.estimatedRequiredTime,
                                            reminderMod: convertTimeConfigToInt(
                                                setting.reminderMod
                                            ),
                                            startMod: convertTimeConfigToInt(
                                                setting.startMod
                                            ),
                                        },
                                    },
                                },
                            },
                        },
                    })
                    .then((activity) => activity.id);
            } else {
                const activitySetting = input.data.activitySetting;
                const setting = activitySetting.setting;

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
                                    type: 'event',

                                    event: {
                                        create: {
                                            startDate: setting.at,
                                            estimatedTime:
                                                setting.estimatedRequiredTime,
                                            reminderMod: convertTimeConfigToInt(
                                                setting.reminderMod
                                            ),
                                            startMod: convertTimeConfigToInt(
                                                setting.startMod
                                            ),
                                        },
                                    },
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
                        activitySetting: z.discriminatedUnion('activityType', [
                            TaskActivitySchema,
                            EventActivitySchema,
                        ]),
                    }),
                    z.object({
                        type: z.literal('repeating'),
                        activitySetting: z.discriminatedUnion('activityType', [
                            TaskActivitySchema,
                            EventActivitySchema,
                        ]),
                        repeatConfig: RepeatConfigZodSchema,
                        endConfig: EndConfigSchema,
                    }),
                ]),
            })
        )
        .mutation(async ({ ctx, input }): Promise<string> => {
            const userId = ctx?.session?.user?.id;

            if (input.data.type === 'single') {
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
                                create:
                                    activitySetting.activityType === 'task'
                                        ? {
                                              name: activitySetting.name,
                                              type: activitySetting.activityType,
                                              task: {
                                                  create: getTaskSchema(
                                                      activitySetting.setting
                                                  ),
                                              },
                                          }
                                        : {
                                              name: activitySetting.name,
                                              type: activitySetting.activityType,
                                              event: {
                                                  create: getEventSchema(
                                                      activitySetting.setting
                                                  ),
                                              },
                                          },
                            },
                        },
                    })
                    .then((activity) => activity.id);
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
                                create:
                                    activitySetting.activityType === 'task'
                                        ? {
                                              name: activitySetting.name,
                                              type: activitySetting.activityType,
                                              task: {
                                                  create: getTaskSchema(
                                                      activitySetting.setting
                                                  ),
                                              },
                                          }
                                        : {
                                              name: activitySetting.name,
                                              type: activitySetting.activityType,
                                              event: {
                                                  create: getEventSchema(
                                                      activitySetting.setting
                                                  ),
                                              },
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
});

export default activityDefinitionsRouter;
