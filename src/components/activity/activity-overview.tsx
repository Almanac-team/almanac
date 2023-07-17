import React, {type ReactNode, useCallback, useContext, useRef, useState} from "react";
import clsx from "clsx";
import {CategoryContext} from "~/components/activity/activity-column";
import {
    type ActivitySetting,
    type EventSetting,
    type TaskSetting,
    isEventSetting,
    isTaskSetting, ActivitySettingModal,
} from "~/components/activity/activity-settings";

import {
    FlagIcon,
    ClockIcon,
    AdjustmentsHorizontalIcon
} from "@heroicons/react/24/outline";
import {TimeContext} from "~/pages/_app";
import {IconButton, Menu, MenuHandler, MenuList} from "@material-tailwind/react";
import {api} from "~/utils/api";

const MILLISECONDS_IN_HOUR = 60 * 60 * 1000;
const MILLISECONDS_IN_DAY = 24 * MILLISECONDS_IN_HOUR;

function TimeBubble({deadline}: { deadline: Date }) {
    const currentTime = useContext(TimeContext);

    const remainingTime = deadline.getTime() - currentTime.getTime();
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
    } else if (remainingTime >= 60000) {
        return <span className="bg-red-500 text-white font-bold rounded-lg px-3 h-8 flex items-center justify-center">
                {`${Math.floor(remainingTime / MILLISECONDS_IN_HOUR).toString().padStart(2, '0')}:
                ${Math.floor(remainingTime % MILLISECONDS_IN_HOUR / 1000 / 60).toString().padStart(2, '0')}`}
            </span>;
    } else if (remainingTime >= 0) {
        return <span className="bg-red-500 text-white font-bold rounded-lg px-3 h-8 flex items-center justify-center">
                {`${Math.floor(remainingTime / 1000).toString()}s`}
            </span>;
    } else if (remainingTime > -60000) {
        return <span className="bg-red-500 text-white font-bold rounded-lg px-3 h-8 flex items-center justify-center">
                {`${Math.floor(remainingTime / 1000).toString()}s`}
            </span>;
    } else if (remainingDays > -1) {
        return <span className="bg-red-500 text-white font-bold rounded-lg px-3 h-8 flex items-center justify-center">
                {`-${Math.floor(Math.abs(remainingTime) / MILLISECONDS_IN_HOUR).toString().padStart(2, '0')}:
                ${Math.floor(-remainingTime % MILLISECONDS_IN_HOUR / 1000 / 60).toString().padStart(2, '0')}`}
            </span>;
    } else {
        return <span className="bg-red-900 text-white font-bold rounded-lg px-3 h-8 flex items-center justify-center">
                {Math.floor(remainingDays)}
            </span>
    }
}

function ActivityTag() {
    const categoryInfo = useContext(CategoryContext);
    const ref = useRef<HTMLDivElement>(null);
    const [sW, setSW] = useState(32);
    const [hover, setHover] = useState(false);

    return (
        <div className={clsx("h-24 ml-0 mr-2 flex transition-all")} style={{minWidth: sW}}
             onMouseEnter={() => {
                 setHover(true);
                 setSW(Math.min(Math.max(32, ref.current?.clientHeight ?? 0), 128));
             }}
             onMouseLeave={() => {
                 setHover(false)
                 setSW(32);
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
                        style={{minHeight: sW, maxHeight: sW, backgroundColor: categoryInfo.backgroundColor}}>
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

function Pill({children, className}: { children: ReactNode, className: string }) {
    return <div
        className={clsx('h-8 rounded-lg flex flex-row justify-between items-center px-2 text-zinc-700 font-bold text-[12px]', className)}>
        <span className="justify-self-center">{children}</span>
    </div>
}

export function ActivityOverview({activity}: { activity: ActivitySetting<TaskSetting | EventSetting> }) {
    const category = useContext(CategoryContext);
    const queryClient = api.useContext();

    const [isOpen, setIsOpen] = useState(false);
    const [updating, isUpdating] = useState(false);
    const {mutate} = api.activities.updateEvent.useMutation();

    const submitFunction = useCallback(<T extends TaskSetting | EventSetting, >(activitySetting: ActivitySetting<T>) => {
        isUpdating(true);
        mutate(activitySetting, {
            onSuccess: () => {
                void queryClient.activities.getDetailedActivities.invalidate({categoryId: category.id}).then(() => {
                        setIsOpen(false);
                        isUpdating(false);
                    }
                );
            }
        });
    }, [category.id, mutate, queryClient.activities]);

    let deadline;
    let icon;
    let settingModal;
    if (isTaskSetting(activity.setting)) {
        deadline = activity.setting.at;
        icon = <FlagIcon className="h-8 w-6"/>


        settingModal = <ActivitySettingModal<TaskSetting>
            originalActivitySetting={activity as ActivitySetting<TaskSetting>} updating={updating}
            onSubmit={submitFunction}/>
    } else if (isEventSetting(activity.setting)) {
        deadline = activity.setting.at;
        icon = <ClockIcon className="h-8 w-6"/>


        settingModal = <ActivitySettingModal<EventSetting>
            originalActivitySetting={activity as ActivitySetting<EventSetting>} updating={updating}
            onSubmit={submitFunction}/>
    } else {
        return <></>;
    }

    return <div className="w-full h-24 bg-gray-200 rounded-lg select-none relative">
        <div className="flex flex-row items-center">
            <ActivityTag/>
            <div className="flex flex-col space-y-2 w-full">
                <div className="flex space-x-3">
                    <TimeBubble deadline={deadline}/>
                    <span
                        className="text-xl font-bold text-gray-900 overflow-x-hidden whitespace-nowrap overflow-ellipsis max-w-[calc(100%-100px)]">{activity.name}</span>
                </div>
                <div className="flex space-x-2">
                    <Pill className="bg-gray-400">{icon}</Pill>
                    <Pill className="bg-gray-400">17:00 - 18:00</Pill>
                </div>
            </div>
            <div className="absolute right-1 top-1">
                <Menu open={isOpen} handler={setIsOpen}>
                    <MenuHandler>
                        <IconButton className="bg-gray-600 rounded hover:bg-gray-500 h-8 w-8">
                            <AdjustmentsHorizontalIcon className="h-8 w-6"/>
                        </IconButton>
                    </MenuHandler>
                    <MenuList>
                        {settingModal}
                    </MenuList>
                </Menu>
            </div>
        </div>
    </div>
}