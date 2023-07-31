import { api } from '~/utils/api';
import { getQueryKey } from '@trpc/react-query';
import { useQueryClient } from '@tanstack/react-query';
import {
	type ActivitySetting,
	type EventSetting,
	type TaskSetting,
} from '~/components/activity/models';
import { useEffect } from 'react';

export function useQueryActivities({ categoryId }: { categoryId: string }): {
	data: ActivitySetting<TaskSetting | EventSetting>[] | null | undefined;
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
			queryClient.setQueryData<
				ActivitySetting<TaskSetting | EventSetting>
			>(queryKey, activity);
		});
	}, [activities, queryClient]);
	return { data: activities };
}

export function useQueryActivity({ activityId }: { activityId: string }): {
	data: ActivitySetting<TaskSetting | EventSetting> | null | undefined;
} {
	const nullableActivity = api.activities.internalGet.useQuery({
		activityId,
	}).data;
	let categoryId: string | undefined;
	let activity: ActivitySetting<TaskSetting | EventSetting> | undefined;
	if (nullableActivity) ({ categoryId, ...activity } = nullableActivity);

	const queryClient = useQueryClient();

	useEffect(() => {
		if (activity) {
			const queryKey = getQueryKey(
				api.activities.internalGetByCategory,
				{ categoryId },
				'query'
			);
			queryClient.setQueryData<
				ActivitySetting<TaskSetting | EventSetting>[]
			>(queryKey, (oldActivities) => {
				if (oldActivities === undefined) return undefined;
				oldActivities?.map((oldActivity) => {
					if (oldActivity.id === activityId) {
						return activity;
					}
					return oldActivity;
				});
			});
		}
	}, [activity, activityId, categoryId, queryClient]);

	return { data: activity };
}
