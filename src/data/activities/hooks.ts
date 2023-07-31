import {api} from "~/utils/api";
import {getQueryKey} from "@trpc/react-query";
import {useQueryClient} from "@tanstack/react-query";
import {type ActivitySetting, type EventSetting, type TaskSetting} from "~/components/activity/models";
import {useEffect, useState} from "react";

export function useQueryActivities(categoryId: string) {
    const {data: activities} = api.activities.getByCategory.useQuery({categoryId})
    const queryClient = useQueryClient()

    useEffect(() => {
        activities?.map((activity) => {
            const queryKey = getQueryKey(api.activities.get, {activityId: activity.id}, 'query')
            queryClient.setQueryData(queryKey, activity)
        })
    }, [activities, queryClient])
    return activities
}

export function useQueryDetailedActivities(categoryId: string): ActivitySetting<TaskSetting | EventSetting>[] | null | undefined {
    const {data: details} = api.activities.getDetailByCategory.useQuery({categoryId})
    const activities = useQueryActivities(categoryId)

    const [detailsMap, setDetailsMap] = useState(new Map<string, number>())

    const queryClient = useQueryClient()

    useEffect(() => {
        const detailsMap = new Map<string, number>()

        details?.map((detail, i) => {
            detailsMap.set(detail.id, i)

            const detailQueryKey = getQueryKey(api.activities.getDetail, {activityId: detail.id}, 'query')
            queryClient.setQueryData(detailQueryKey, detail)
        })
        setDetailsMap(detailsMap)

    }, [details, queryClient])

    if (details === undefined || activities === undefined) return undefined

    return details != null && activities != null ? activities.map((activity): ActivitySetting<TaskSetting | EventSetting> | null => {
        const detailIndex = detailsMap.get(activity.id)
        if (detailIndex === undefined) return null
        const detail = details[detailIndex]
        if (detail === undefined) return null

        return {
            id: activity.id,
            name: activity.name,
            activityType: activity.activityType,
            zones: detail.zones,
            setting: detail.setting
        }
    }).filter(e => !!e) as ActivitySetting<TaskSetting | EventSetting>[] : null
}

export function useQueryActivity(activityId: string): ActivitySetting<undefined> | null | undefined {
    const nullableActivity = api.activities.get.useQuery(({activityId})).data
    let categoryId: string | undefined;
    let activity: ActivitySetting<undefined> | undefined;
    if (nullableActivity) ({categoryId, ...activity} = nullableActivity)

    const queryClient = useQueryClient()

    useEffect(() => {
        if (activity) {
            const queryKey = getQueryKey(api.activities.getByCategory, {categoryId}, 'query')
            queryClient.setQueryData<ActivitySetting<undefined>[]>(queryKey, (oldActivities) => {
                if (oldActivities === undefined) return undefined
                oldActivities?.map((oldActivity) => {
                    if (oldActivity.id === activityId) {
                        return activity
                    }
                    return oldActivity
                })
            })
        }
    }, [activity, activityId, categoryId, queryClient])

    return activity
}

export function useQueryDetailedActivity(activityId: string): ActivitySetting<TaskSetting | EventSetting> | null | undefined {
    const nullableDetail = api.activities.getDetail.useQuery(({activityId})).data
    const activity = useQueryActivity(activityId);

    let categoryId: string | undefined;
    let detail: Omit<ActivitySetting<TaskSetting | EventSetting>, 'name' | 'activityType'> | undefined;
    if (nullableDetail) ({categoryId, ...detail} = nullableDetail)

    const queryClient = useQueryClient()

    useEffect(() => {
        if (activity && detail) {
            const queryKey = getQueryKey(api.activities.getDetailByCategory, {categoryId}, 'query')
            queryClient.setQueryData<ActivitySetting<TaskSetting | EventSetting>[]>(queryKey, (oldActivities) => {
                if (oldActivities === undefined) return undefined
                oldActivities?.map((oldActivity) => {
                    if (oldActivity.id === activityId) {
                        return {...activity, ...detail}
                    }
                    return oldActivity
                })
            })
        }
    }, [activity, activityId, categoryId, detail, queryClient])

    if (detail === undefined || activity === undefined) return undefined

    return detail && activity ? {...activity, ...detail} : null
}