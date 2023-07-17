import {useContext, useRef, useState} from "react";
import clsx from "clsx";
import {CategoryContext, type CategoryInfo} from "~/components/activity/activity-column";
import {
    type ActivitySetting,
    type EventSetting,
    type TaskSetting,
    isEventSetting,
    isTaskSetting,
} from "~/components/activity/activity-settings";

import {
    FlagIcon,
    ClockIcon,
} from "@heroicons/react/24/outline";

const MILLISECONDS_IN_HOUR = 60 * 60 * 1000;
const MILLISECONDS_IN_DAY = 24 * MILLISECONDS_IN_HOUR;

function TimeBubble({remainingTime}: { remainingTime: number }) {
    const remainingDays = remainingTime / MILLISECONDS_IN_DAY;

    if (remainingDays >= 14) {
        return <span className="bg-green-500 text-white font-bold rounded-lg px-2 h-8 flex items-center justify-center">
                {Math.floor(remainingDays)}
            </span>
    } else if (remainingDays >= 10) {
        return <span className="bg-green-400 text-white font-bold rounded-lg px-2 h-8 flex items-center justify-center">
                {Math.floor(remainingDays)}
            </span>
    } else if (remainingDays >= 7) {
        return <span className="bg-green-400 text-white font-bold rounded-lg px-3 h-8 flex items-center justify-center">
                {Math.floor(remainingDays)}
            </span>
    } else if (remainingDays >= 3) {
        return <span
            className="bg-yellow-400 text-white font-bold rounded-lg px-3 h-8 flex items-center justify-center">
                {Math.floor(remainingDays)}
            </span>
    } else if (remainingDays >= 1) {
        return <span className="bg-red-400 text-white font-bold rounded-lg px-3 h-8 flex items-center justify-center">
                {Math.floor(remainingDays)}
            </span>
    } else if (remainingDays >= 0) {
        return <span className="bg-red-500 text-white font-bold rounded-lg px-3 h-8 flex items-center justify-center">
                {`${Math.floor(remainingTime / MILLISECONDS_IN_HOUR).toString().padStart(2, '0')}:
                ${Math.floor(remainingTime % MILLISECONDS_IN_HOUR / 1000 / 60).toString().padStart(2, '0')}`}
            </span>;
    } else if (remainingDays > -1) {
        return <span className="bg-red-500 text-white font-bold rounded-lg px-3 h-8 flex items-center justify-center">
                {`${Math.floor(remainingTime / MILLISECONDS_IN_HOUR).toString().padStart(2, '0')}:
                ${Math.floor(-remainingTime % MILLISECONDS_IN_HOUR / 1000 / 60).toString().padStart(2, '0')}`}
            </span>;
    } else {
        return <span className="bg-red-900 text-white font-bold rounded-lg px-3 h-8 flex items-center justify-center">
                {Math.floor(remainingDays)}
            </span>
    }

}
function ActivityTag({categoryInfo}: { categoryInfo: CategoryInfo }) {
    const ref = useRef<HTMLDivElement>(null);
    const [spanWidth, setSpanWidth] = useState(32);
    const [hover, setHover] = useState(false);

    return (
        <div className={clsx("h-24 ml-0 mr-2 flex transition-all")} style={{minWidth: spanWidth}}
             onMouseEnter={() => {
                 setHover(true);
                 setSpanWidth(Math.min(Math.max(32, ref.current?.clientHeight ?? 0), 128));
             }}
             onMouseLeave={() => {
                 setHover(false)
                 setSpanWidth(32);
             }}
        >
            <div className="absolute max-h-0 overflow-hidden">
            <span ref={ref}
                  className={clsx("invisible px-2 w-24 block font-bold text-center overflow-x-hidden whitespace-break-spaces break-words")}>
                          {categoryInfo.categoryName}
                      </span>
            </div>


            <div className="relative top-24">
                <div className="absolute inset-0">
                    <div
                        className="w-24 origin-top-left -rotate-90 px-2 rounded-tl-lg rounded-tr-lg transition-all overflow-hidden"
                        style={{minHeight: spanWidth, maxHeight: spanWidth, backgroundColor: categoryInfo.backgroundColor}}>
                        <span
                            className={clsx("block font-bold text-center overflow-x-hidden", categoryInfo.textColor, hover ? "whitespace-break-spaces break-words" : "whitespace-nowrap overflow-ellipsis")}>
                          {categoryInfo.categoryName}
                      </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TaskOverview({activity, setting}: { activity: ActivitySetting, setting: TaskSetting }) {
    return <div className="flex flex-col space-y-2 w-full">
        <div className="flex space-x-3">
            <TimeBubble remainingTime={setting.at.getTime() - new Date().getTime()}/>
            <FlagIcon className="h-8 w-6"/>
            <span
                className="text-xl font-bold text-gray-900 overflow-x-hidden whitespace-nowrap overflow-ellipsis max-w-[calc(100%-100px)]">{activity.name}</span>
        </div>
        <div className="flex">
            <div
                className="h-8 bg-gray-300 rounded-lg flex flex-row justify-between items-center px-2 cursor-pointer hover:bg-gray-400 transition-colors"
            >
                <span className="justify-self-center text-zinc-700 font-bold text-[12px]">17:00 - 18:00</span>
            </div>
        </div>
    </div>
}
function EventOverview({activity, setting}: { activity: ActivitySetting, setting: EventSetting }) {
    return <div className="flex flex-col space-y-2 w-full">
        <div className="flex space-x-3">
            <TimeBubble remainingTime={setting.at.getTime() - new Date().getTime()}/>
            <ClockIcon className="h-8 w-6"/>
            <span
                className="text-xl font-bold text-gray-900 overflow-x-hidden whitespace-nowrap overflow-ellipsis max-w-[calc(100%-100px)]">{activity.name}</span>
        </div>
        <div className="flex">
            <div
                className="h-8 bg-gray-300 rounded-lg flex flex-row justify-between items-center px-2 cursor-pointer hover:bg-gray-400 transition-colors"
            >
                <span className="justify-self-center text-zinc-700 font-bold text-[12px]">17:00 - 18:00</span>
            </div>
        </div>
    </div>
}

export function ActivityOverview({activity}: {activity: ActivitySetting}) {
    const categoryInfo = useContext(CategoryContext);

    let setting;
    if (isTaskSetting(activity.setting)) {
        setting = <TaskOverview activity={activity} setting={activity.setting}/>
    }
    else if (isEventSetting(activity.setting)) {
        setting = <EventOverview activity={activity} setting={activity.setting}/>
    }

    if (setting === undefined) {
        return <div className="w-full h-24 bg-gray-200 rounded-lg select-none relative">
            Error
        </div>
    }

    return (
        <div className="w-full h-24 bg-gray-200 rounded-lg select-none relative">
            <div className="flex flex-row items-center">
                <ActivityTag categoryInfo={categoryInfo}/>
                {setting}
            </div>
        </div>
    );
}