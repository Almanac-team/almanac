import Head from 'next/head';
import { WeekView } from '~/components/calendar-timeline/timeline-view';
import React, { type ReactElement, useMemo, useState } from 'react';
import { Button, IconButton } from '@material-tailwind/react';

import { type ScheduledBlock } from '~/components/calendar-timeline/models';
import {
    convertActivitiesToAbsActivities,
    generateEvents,
    scheduledBlocksFromScheduledEvents,
} from '~/server/eventGeneration';
import { useQueryActivityDefinitions } from '~/data/activityDefinitions/query';
import {
    type ActivitySettingWithCompletion,
    getActivitiesFromDefinition,
} from '~/data/activityDefinitions/virtualActivities';
import { type ActivitySetting } from '~/components/activity/models';
import { withAuthServerSideProps } from '~/components/generic/withAuthServerSide';
import { Layout } from '~/components/layout';

export function getWeekStart(date: Date) {
    const today = date;
    today.setHours(0, 0, 0, 0);
    today.setDate(today.getDate() - today.getDay() + 1);
    return today;
}

function SprintNav({
    weekShift,
    setWeekShift,
}: {
    weekShift: number;
    setWeekShift: (weekShift: number) => void;
}) {
    return (
        <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center space-x-2">
                <Button
                    onClick={() => {
                        setWeekShift(0);
                    }}
                >
                    Today
                </Button>
                <IconButton
                    variant="text"
                    className="rounded-md"
                    color="gray"
                    onClick={() => {
                        setWeekShift(weekShift - 1);
                    }}
                >
                    <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                        />
                    </svg>
                </IconButton>
                <IconButton
                    variant="text"
                    className="rounded-md"
                    color="gray"
                    onClick={() => {
                        setWeekShift(weekShift + 1);
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                        stroke="currentColor"
                        className="h-6 w-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                    </svg>
                </IconButton>
            </div>
        </div>
    );
}

export default function Home() {
    const [scheduledBlocks, setScheduledBlocks] = useState<ScheduledBlock[]>(
        []
    );
    const [firstDayMidnightFirstWeek] = useState<Date>(
        getWeekStart(new Date())
    );
    const [weekShift, setWeekShift] = useState<number>(0);

    const { data: activityDefinitions } = useQueryActivityDefinitions();

    const { firstDayMidnight, lastDayMidnightMinPrior } = useMemo(() => {
        const firstDayMidnight = new Date(
            firstDayMidnightFirstWeek.getTime() +
                weekShift * 7 * 24 * 60 * 60 * 1000
        );
        const lastDayMidnightMinPrior = new Date(
            firstDayMidnight.getTime() - 60 * 1000
        );
        return { firstDayMidnight, lastDayMidnightMinPrior };
    }, [weekShift, firstDayMidnightFirstWeek]);

    const {
        activities,
        activitiesMap,
    }: {
        activities: ActivitySetting[];
        activitiesMap: Map<string, ActivitySetting>;
    } = useMemo(() => {
        if (activityDefinitions) {
            const activities: ActivitySetting[] = [];
            const activitiesMap: Map<string, ActivitySetting> = new Map();

            for (const activityDefinition of activityDefinitions) {
                const newActivities: ActivitySettingWithCompletion[] = [
                    ...getActivitiesFromDefinition(
                        activityDefinition,
                        1000,
                        lastDayMidnightMinPrior
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
    }, [activityDefinitions, lastDayMidnightMinPrior]);
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
                    <SprintNav
                        weekShift={weekShift}
                        setWeekShift={setWeekShift}
                    />
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
Home.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};
export const getServerSideProps = withAuthServerSideProps();
