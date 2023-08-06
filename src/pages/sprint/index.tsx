import Head from 'next/head';
import { WeekView } from '~/components/timeline/timeline-view';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@material-tailwind/react';
import { type ScheduledBlock } from '~/components/timeline/models';
import {
    convertActivitiesToAbsActivities,
    generateEvents,
    scheduledBlocksFromScheduledEvents,
} from '~/server/eventGeneration';
import { useQueryActivityDefinitions } from '~/data/activityDefinitions/query';
import { api } from '~/utils/api';
import {
    type ActivitySettingWithCompletion,
    getActivitiesFromDefinition,
} from '~/data/activityDefinitions/virtualActivities';
import { type ActivitySetting } from '~/components/activity/models';

export function getWeekStart(date: Date) {
    const today = date;
    today.setHours(0, 0, 0, 0);
    today.setDate(today.getDate() - today.getDay() + 1);
    return today;
}

export default function Home() {
    const [scheduledBlocks, setScheduledBlocks] = useState<ScheduledBlock[]>(
        []
    );
    const [firstDayMidnight] = useState<Date>(getWeekStart(new Date()));

    const { data: activityDefinitions } = useQueryActivityDefinitions();

    const {
        activities,
        activitiesMap,
    }: {
        activities: ActivitySetting[];
        activitiesMap: Map<string, ActivitySetting>;
    } = useMemo(() => {
        if (activityDefinitions) {
            const lastDate = new Date(
                firstDayMidnight.getTime() + 7 * 24 * 60 * 60 * 1000
            );

            const activities: ActivitySetting[] = [];
            const activitiesMap: Map<string, ActivitySetting> = new Map();

            for (const activityDefinition of activityDefinitions) {
                const newActivities: ActivitySettingWithCompletion[] = [
                    ...getActivitiesFromDefinition(
                        activityDefinition,
                        1000,
                        lastDate
                    ),
                ];

                newActivities.forEach((activity) => {
                    if (!activity.completed) {
                        activities.push(activity);
                        activitiesMap.set(activity.id, activity);
                    }
                });
            }

            return { activities, activitiesMap };
        }
        return { activities: [], activitiesMap: new Map() };
    }, [activityDefinitions, firstDayMidnight]);
    return (
        <>
            <Head>
                <title>Calendar</title>
                <meta name="description" content="Sprint" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex max-h-screen flex-col">
                <div className="flex flex-col">
                    <Button
                        color="blue"
                        onClick={() => {
                            const blocks = scheduledBlocksFromScheduledEvents(
                                generateEvents(
                                    convertActivitiesToAbsActivities(
                                        activities
                                    ),
                                    firstDayMidnight
                                ),
                                activitiesMap
                            );
                            setScheduledBlocks(blocks);
                        }}
                    >
                        Generate Greedy
                    </Button>
                </div>
                <WeekView
                    className="mt-2 h-full min-h-0 w-full"
                    blockList={scheduledBlocks}
                    firstDayMidnight={firstDayMidnight}
                />
            </main>
        </>
    );
}
