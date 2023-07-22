import Head from "next/head";
import {TimelineView, WeekView} from "~/components/timeline/timeline-view";
import {ScheduledEvent} from "~/utils/types";
import {useEffect, useState} from "react";
import {Button} from "@material-tailwind/react";
import {api} from "~/utils/api";
import {ZoneColumn} from "~/components/zone/zone-column";
import {ZoneView} from "~/components/zone/zone-view";

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
    const zones = api.zones.getZones.useQuery().data ?? [];
    const [zoneIndex, setZoneIndex] = useState<number>(0);

    useEffect(() => {
        if (zones.length > zoneIndex) {
            setZoneIndex(zones.length - 1);
        }
    }, [zones]);

    return (
        <>
            <Head>
                <title>Calendar</title>
                <meta name="description" content="Sprint"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className="max-h-screen h-screen flex flex-col">
                <div className="h-screen flex flex-row">
                    <ZoneColumn zones={zones} onSelect={(index: number) => setZoneIndex(index)}/>
                    <ZoneView zone={zones[zoneIndex]}/>
                </div>
            </main>
        </>
    );
}