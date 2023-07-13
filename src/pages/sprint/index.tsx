import Head from "next/head";
import {TimelineView} from "~/components/timeline/timeline-view";

export default function Home() {


    return (
        <>
            <Head>
                <title>Calendar</title>
                <meta name="description" content="Sprint"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className="max-h-screen">
                <div className="w-full h-screen flex">
                    <TimelineView dayViewList={[
                        {
                            dayLabel: "Sunday",
                            activityList: []
                        },
                        {
                            dayLabel: "Monday",
                            activityList: []
                        },
                        {
                            dayLabel: "Tuesday",
                            activityList: []
                        },
                        {
                            dayLabel: "Wednesday",
                            activityList: []
                        },
                        {
                            dayLabel: "Thursday",
                            activityList: []
                        },
                        {
                            dayLabel: "Friday",
                            activityList: []
                        },
                        {
                            dayLabel: "Saturday",
                            activityList: []
                        }]
                    }/>
                </div>
            </main>
        </>
    );
}