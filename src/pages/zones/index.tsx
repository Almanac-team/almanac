import Head from "next/head";
import {TimelineView, WeekView} from "~/components/timeline/timeline-view";
import {ScheduledEvent} from "~/utils/types";
import {useEffect, useState} from "react";
import {Button} from "@material-tailwind/react";
import {api} from "~/utils/api";
import {ZoneColumn} from "~/components/zone/zone-column";

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
    return (
        <>
            <Head>
                <title>Calendar</title>
                <meta name="description" content="Sprint"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className="max-h-screen h-screen flex flex-col">
                <div className="flex flex-col">
                </div>
                <ZoneColumn/>
            </main>
        </>
    );
}