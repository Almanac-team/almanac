import { type QueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import { api } from '~/utils/api';
import { type ActivityDefinitionUnion } from '~/components/activity/activity-definition-models';

export function appendActivityDefinitions({
    queryClient,
    categoryId,
    activityDefinition,
}: {
    queryClient: QueryClient;
    categoryId: string;
    activityDefinition: ActivityDefinitionUnion;
}) {
    queryClient.setQueryData<ActivityDefinitionUnion[]>(
        getQueryKey(
            api.activityDefinitions.internalGetByCategory,
            { categoryId },
            'query'
        ),
        (oldActivityDefinitions) => {
            if (oldActivityDefinitions === undefined) return undefined;
            return [...oldActivityDefinitions, activityDefinition];
        }
    );

    queryClient.setQueryData<ActivityDefinitionUnion>(
        getQueryKey(
            api.activityDefinitions.internalGet,
            { activityDefinitionId: activityDefinition.id },
            'query'
        ),
        { ...activityDefinition }
    );
}

export function updateActivityDefinitions({
    queryClient,
    categoryId,
    activityDefinition,
}: {
    queryClient: QueryClient;
    categoryId: string;
    activityDefinition: ActivityDefinitionUnion;
}) {
    queryClient.setQueryData<ActivityDefinitionUnion[]>(
        getQueryKey(
            api.activityDefinitions.internalGetByCategory,
            { categoryId },
            'query'
        ),
        (oldActivityDefinitions) => {
            if (oldActivityDefinitions === undefined) return undefined;
            return oldActivityDefinitions.map((oldActivityDefinition) => {
                if (oldActivityDefinition.id === activityDefinition.id) {
                    return activityDefinition;
                }
                return oldActivityDefinition;
            });
        }
    );

    queryClient.setQueryData<ActivityDefinitionUnion>(
        getQueryKey(
            api.activityDefinitions.internalGet,
            { activityDefinitionId: activityDefinition.id },
            'query'
        ),
        { ...activityDefinition }
    );
}
