import { type QueryClient } from '@tanstack/react-query';
import { type ActivitySettingUnion } from '~/components/activity/models';
import { getQueryKey } from '@trpc/react-query';
import { api } from '~/utils/api';

export function appendActivities({
    queryClient,
    categoryId,
    activity,
}: {
    queryClient: QueryClient;
    categoryId: string;
    activity: ActivitySettingUnion;
}) {
    queryClient.setQueryData<ActivitySettingUnion[]>(
        getQueryKey(
            api.activities.internalGetByCategory,
            { categoryId },
            'query'
        ),
        (oldActivities) => {
            if (oldActivities === undefined) return undefined;
            return [...oldActivities, activity];
        }
    );

    queryClient.setQueryData<ActivitySettingUnion>(
        getQueryKey(
            api.activities.internalGet,
            { activityId: activity.id },
            'query'
        ),
        { ...activity }
    );
}

export function updateActivities({
    queryClient,
    categoryId,
    activity,
}: {
    queryClient: QueryClient;
    categoryId: string;
    activity: ActivitySettingUnion;
}) {
    queryClient.setQueryData<ActivitySettingUnion[]>(
        getQueryKey(
            api.activities.internalGetByCategory,
            { categoryId },
            'query'
        ),
        (oldActivities) => {
            if (oldActivities === undefined) return undefined;
            return oldActivities.map((oldActivity) => {
                if (oldActivity.id === activity.id) {
                    return activity;
                }
                return oldActivity;
            });
        }
    );

    queryClient.setQueryData<ActivitySettingUnion>(
        getQueryKey(
            api.activities.internalGet,
            { activityId: activity.id },
            'query'
        ),
        { ...activity }
    );
}
