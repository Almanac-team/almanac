import Head from "next/head";
import {TimelineView} from "~/components/timeline/timeline-view";

export default function Home() {


  return (
    <>
      <Head>
        <title>Calendar</title>
        <meta name="description" content="Sprint" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="max-h-screen">
          <div className="w-full max-h-screen flex">
              <TimelineView activityList={[]} />
          </div>
      </main>
    </>
  );
}