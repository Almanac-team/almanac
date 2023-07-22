import Head from "next/head";
import {TimelineView} from "~/components/timeline/timeline-view";
import {ScheduledEvent} from "~/utils/types";
import {useEffect, useState} from "react";
import {Button} from "@material-tailwind/react";
import {api} from "~/utils/api";

export function getWeekStart(date: Date) {
    const today = date;
    today.setHours(0, 0, 0, 0);
    today.setDate(today.getDate() - today.getDay() + 1);
    return today;
}

export interface GeneratedEvent {
    id: string,
    activityId: string,
    name: string,
    date: Date,
    hours: number
}

export default function Home() {
    const [activityList, setActivityList] = useState<ScheduledEvent[]>([]);
    const [firstDayMidnight] = useState<Date>(getWeekStart(new Date()));

    const {data} = api.generatedEvents.getGeneratedEvents.useQuery();

    useEffect(() => {
        if (data) {
            setActivityList(data);
        }
    }, [data]);


    return (
        <>
            <Head>
                <title>Calendar</title>
                <meta name="description" content="Sprint"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className="max-h-screen flex flex-col">
                <div className="flex flex-col">
                    <Button color="blue" onClick={() => {
                        setActivityList([...activityList, {
                            id: Math.random().toString(36).substring(7),
                            name: "Test",
                            date: new Date('7/19/2023'),
                            hours: 60
                        }])
                    }}>Generate Greedy</Button>
                </div>
                <TimelineView className="w-full h-full min-h-0 mt-2" dayViewList={[
                    {
                        dayLabel: "Monday",
                        activityList: activityList,
                        startDay: firstDayMidnight
                    },
                    {
                        dayLabel: "Tuesday",
                        activityList: activityList,
                        startDay: new Date(firstDayMidnight.getTime() + 24 * 60 * 60 * 1000)
                    },
                    {
                        dayLabel: "Wednesday",
                        activityList: activityList,
                        startDay: new Date(firstDayMidnight.getTime() + 24 * 60 * 60 * 1000 * 2)
                    },
                    {
                        dayLabel: "Thursday",
                        activityList: activityList,
                        startDay: new Date(firstDayMidnight.getTime() + 24 * 60 * 60 * 1000 * 3)
                    },
                    {
                        dayLabel: "Friday",
                        activityList: activityList,
                        startDay: new Date(firstDayMidnight.getTime() + 24 * 60 * 60 * 1000 * 4)
                    },
                    {
                        dayLabel: "Saturday",
                        activityList: activityList,
                        startDay: new Date(firstDayMidnight.getTime() + 24 * 60 * 60 * 1000 * 5)
                    },
                    {
                        dayLabel: "Sunday",
                        activityList: activityList,
                        startDay: new Date(firstDayMidnight.getTime() + 24 * 60 * 60 * 1000 * 6)
                    }
                    ]
                }/>
            </main>
        </>
    );
}