import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import {ActivityColumn} from "~/components/activity/activity-column";
import {DragDropContext} from "@hello-pangea/dnd";
import {ActivitySetting} from "~/components/activity/activity-settings";


const activity: ActivitySetting = {
    id: "1",
    name: "Activity",
    at: new Date(),
    estimatedRequiredTime: {value: 1, unit: "hour"},
    reminderMod: {value: 1, unit: "hour"},
    startMod: {value: 1, unit: "hour"},
    deadlineMod: {value: 1, unit: "hour"}
}

const activities: ActivitySetting[] = new Array<ActivitySetting>(5).fill(activity)
export default function Home() {


    for (const activity of activities) {
        activity.id = Math.random().toString();

    }

  return (
    <>
      <Head>
        <title>Activity Definitions</title>
        <meta name="description" content="Activity Definitions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="max-h-screen">
          <div className="w-full max-h-screen overflow-y-hidden flex">
              <ActivityColumn categoryInfo={{
                  categoryName: "Category 1",
                  backgroundColor: "bg-amber-300",
                  textColor: "text-white"
              }} activities={activities}/>
              {/*<ActivityColumn categoryInfo={{*/}
              {/*    categoryName: "Category 1",*/}
              {/*    backgroundColor: "bg-amber-300",*/}
              {/*    textColor: "text-white"*/}
              {/*}} activities={[]}/>*/}

          </div>
      </main>
    </>
  );
}