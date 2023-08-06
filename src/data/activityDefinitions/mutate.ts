import { type QueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import { api } from '~/utils/api';
import { type ActivityDefinition } from '~/components/activity/activity-definition-models';

export function appendActivityDefinitions({
    queryClient,
    categoryId,
    activityDefinition,
}: {
    queryClient: QueryClient;
    categoryId: string;
    activityDefinition: ActivityDefinition;
}) {
    queryClient.setQueryData<ActivityDefinition[]>(
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

    queryClient.setQueryData<ActivityDefinition>(
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
    activityDefinition: ActivityDefinition;
}) {
    queryClient.setQueryData<ActivityDefinition[]>(
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

    queryClient.setQueryData<ActivityDefinition>(
        getQueryKey(
            api.activityDefinitions.internalGet,
            { activityDefinitionId: activityDefinition.id },
            'query'
        ),
        { ...activityDefinition }
    );
}
