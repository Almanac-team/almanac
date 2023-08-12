import Head from 'next/head';
import { type ReactElement, useEffect, useState } from 'react';
import { api } from '~/utils/api';
import { ZoneColumn } from '~/components/zone/zone-column';
import { ZoneView } from '~/components/zone/zone-view';
import { withAuthServerSideProps } from '~/components/generic/withAuthServerSide';
import { Layout } from '~/components/layout';

export function getWeekStart(date: Date) {
    const today = date;
    today.setHours(0, 0, 0, 0);
    today.setDate(today.getDate() - today.getDay() + 1);
    return today;
}

export interface GeneratedEvent {
    id: string;
    activityId: string;
    name: string;
    date: Date;
    hours: number;
}

export default function Home() {
    const zones = api.zones.getZones.useQuery().data ?? [];
    const [zoneIndex, setZoneIndex] = useState<number>(0);

    useEffect(() => {
        if (zoneIndex >= zones.length) {
            setZoneIndex(zones.length - 1);
        }
    }, [zoneIndex, zones]);

    const zone = zones[zoneIndex];

    return (
        <>
            <Head>
                <title>Calendar</title>
                <meta name="description" content="Sprint" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex h-screen max-h-screen flex-row">
                <ZoneColumn
                    zones={zones}
                    onSelect={(index: number) => setZoneIndex(index)}
                />
                {zone ? (
                    <ZoneView className="overflow-x-auto" zone={zone} />
                ) : null}
            </main>
        </>
    );
}
Home.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};
export const getServerSideProps = withAuthServerSideProps();
