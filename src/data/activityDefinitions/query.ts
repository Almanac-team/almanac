import { api } from '~/utils/api';
import { getQueryKey } from '@trpc/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { type ActivityDefinitionUnion } from '~/components/activity/activity-definition-models';

export function useQueryActivityDefinitions({
    categoryId,
}: {
    categoryId: string;
}): {
    data: ActivityDefinitionUnion[] | null | undefined;
} {
    const { data: activityDefinitions } =
        api.activityDefinitions.internalGetByCategory.useQuery({
            categoryId,
        });
    const queryClient = useQueryClient();

    useEffect(() => {
        activityDefinitions?.map((activityDefinition) => {
            const queryKey = getQueryKey(
                api.activityDefinitions.internalGet,
                { activityDefinitionId: activityDefinition.id },
                'query'
            );
            queryClient.setQueryData<ActivityDefinitionUnion>(
                queryKey,
                activityDefinition
            );
        });
    }, [activityDefinitions, queryClient]);
    return { data: activityDefinitions };
}

export function useQueryActivityDefinition({
    activityDefintionId,
}: {
    activityDefintionId: string;
}): {
    data: ActivityDefinitionUnion | null | undefined;
} {
    const nullableActivityDefinition =
        api.activityDefinitions.internalGet.useQuery({
            activityDefinitionId: activityDefintionId,
        }).data;

    const {
        categoryId,
        activityDefinition,
    }: {
        categoryId: string | undefined;
        activityDefinition: ActivityDefinitionUnion | undefined;
    } = useMemo(() => {
        let categoryId: string | undefined;
        let activityDefinition: ActivityDefinitionUnion | undefined;
        if (nullableActivityDefinition)
            ({ categoryId, ...activityDefinition } =
                nullableActivityDefinition);
        return { categoryId, activityDefinition };
    }, [nullableActivityDefinition]);

    const queryClient = useQueryClient();

    useEffect(() => {
        if (activityDefinition) {
            const queryKey = getQueryKey(
                api.activityDefinitions.internalGetByCategory,
                { categoryId },
                'query'
            );
            queryClient.setQueryData<ActivityDefinitionUnion[]>(
                queryKey,
                (oldActivityDefinitions) => {
                    if (oldActivityDefinitions === undefined) return undefined;
                    oldActivityDefinitions?.map((oldActivityDefinition) => {
                        if (oldActivityDefinition.id === activityDefintionId) {
                            return activityDefinition;
                        }
                        return oldActivityDefinition;
                    });
                }
            );
        }
    }, [activityDefinition, activityDefintionId, categoryId, queryClient]);

    return { data: activityDefinition };
}
