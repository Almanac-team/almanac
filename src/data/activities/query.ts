import { api } from '~/utils/api';
import { getQueryKey } from '@trpc/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { type ActivitySettingUnion } from '~/components/activity/models';
import { useEffect } from 'react';
import {
    type ActivityDefinitionUnion,
    EndConfig,
} from '~/components/activity/activity-definition-models';

const r: { data: ActivityDefinitionUnion[] } = {
    data: [
        {
            id: '2',
            data: {
                type: 'repeating',
                activitySetting: {
                    id: '1',
                    name: 'a',
                    activityType: 'task',
                    zones: {
                        include: [],
                        exclude: [],
                    },
                    setting: {
                        at: new Date(),
                        estimatedRequiredTime: 0,
                        deadlineMod: {
                            value: 0,
                            unit: 'minute',
                        },
                        reminderMod: {
                            value: 0,
                            unit: 'minute',
                        },
                        startMod: {
                            value: 0,
                            unit: 'minute',
                        },
                    },
                },
                repeatConfig: {
                    every: 1,
                    unit: { type: 'day' },
                },
                end: {
                    type: 'count',
                    count: 5,
                },
                exceptions: new Map(),
            },
        },
        {
            id: '1',
            data: {
                type: 'single',
                activitySetting: {
                    id: '1',
                    name: 'test',
                    activityType: 'task',
                    zones: {
                        include: [],
                        exclude: [],
                    },
                    setting: {
                        at: new Date(),
                        estimatedRequiredTime: 0,
                        deadlineMod: {
                            value: 0,
                            unit: 'minute',
                        },
                        reminderMod: {
                            value: 0,
                            unit: 'minute',
                        },
                        startMod: {
                            value: 0,
                            unit: 'minute',
                        },
                    },
                },
            },
        },
    ],
};

export function useQueryActivityDefinitions({
    categoryId,
}: {
    categoryId: string;
}): {
    data: ActivityDefinitionUnion[] | null | undefined;
} {
    return r;
}

export function useQueryActivities({ categoryId }: { categoryId: string }): {
    data: ActivitySettingUnion[] | null | undefined;
} {
    const { data: activities } = api.activities.internalGetByCategory.useQuery({
        categoryId,
    });
    const queryClient = useQueryClient();

    useEffect(() => {
        activities?.map((activity) => {
            const queryKey = getQueryKey(
                api.activities.internalGet,
                { activityId: activity.id },
                'query'
            );
            queryClient.setQueryData<ActivitySettingUnion>(queryKey, activity);
        });
    }, [activities, queryClient]);
    return { data: activities };
}

export function useQueryActivity({ activityId }: { activityId: string }): {
    data: ActivitySettingUnion | null | undefined;
} {
    const nullableActivity = api.activities.internalGet.useQuery({
        activityId,
    }).data;
    let categoryId: string | undefined;
    let activity: ActivitySettingUnion | undefined;
    if (nullableActivity) ({ categoryId, ...activity } = nullableActivity);

    const queryClient = useQueryClient();

    useEffect(() => {
        if (activity) {
            const queryKey = getQueryKey(
                api.activities.internalGetByCategory,
                { categoryId },
                'query'
            );
            queryClient.setQueryData<ActivitySettingUnion[]>(
                queryKey,
                (oldActivities) => {
                    if (oldActivities === undefined) return undefined;
                    oldActivities?.map((oldActivity) => {
                        if (oldActivity.id === activityId) {
                            return activity;
                        }
                        return oldActivity;
                    });
                }
            );
        }
    }, [activity, activityId, categoryId, queryClient]);

    return { data: activity };
}
