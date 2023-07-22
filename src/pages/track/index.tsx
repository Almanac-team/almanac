import Head from "next/head";
import {TimelineView} from "~/components/timeline/timeline-view";

export default function Home() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
        <>
            <Head>
                <title>Calendar</title>
                <meta name="description" content="Track"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className="max-h-screen">
                <div className="w-full h-screen flex">
                    <TimelineView dayViewList={[
                        {
                            dayLabel: 'Planned',
                            activityList: [],
                            startDay: today
                        },
                        {
                            dayLabel: 'Reality',
                            activityList: [],
                            startDay: today
                        }
                    ]}/>
                </div>
            </main>
        </>
    );
}