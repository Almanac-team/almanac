import Head from 'next/head';
import { TimelineView } from '~/components/timeline/timeline-view';
import { withAuthServerSideProps } from "~/components/generic/withAuthServerSide";

export default function Home() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
        <>
            <Head>
                <title>Calendar</title>
                <meta name="description" content="Track" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="max-h-screen">
                <div className="flex h-screen w-full">
                    <TimelineView
                        dayViewList={[
                            {
                                dayLabel: 'Planned',
                                blockList: [],
                                startDay: today,
                            },
                            {
                                dayLabel: 'Reality',
                                blockList: [],
                                startDay: today,
                            },
                        ]}
                    />
                </div>
            </main>
        </>
    );
}

export const getServerSideProps = withAuthServerSideProps();
