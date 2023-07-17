import clsx from "clsx";
import {ActivityOverview} from "~/components/activity/activity-overview";
import {api} from "~/utils/api";
import React, {createContext, useContext, useState} from "react";
import {Button, Menu, MenuHandler, MenuList} from "@material-tailwind/react";
import {
    type ActivitySetting,
    type ActivityType,
    type EventSetting,
    type TaskSetting,
    EventSettingConfig, isEventSetting, isTaskSetting,
    TaskSettingConfig
} from "~/components/activity/activity-settings";
import {Tab, Tabs} from "~/components/generic/tab";

export interface CategoryInfo {
    id: string;
    categoryName: string;
    backgroundColor: string;
    textColor?: string;
}

function AddActivityModal({onSubmit, updating}: {
    onSubmit?: (activitySetting: ActivitySetting) => void,
    updating?: boolean
}) {
    const [activitySetting, setActivitySetting] = useState<ActivitySetting>({
        id: "-1",
        name: "",
        activityType: 'task',
        setting: undefined
    });

    const [unionSetting, setUnionSetting] = useState<TaskSetting & EventSetting>(
        {
            at: (() => {
                const date = new Date();
                date.setHours(23, 59, 0, 0);
                return date;
            })(),
            estimatedRequiredTime: {value: 1, unit: "hour"},
            deadlineMod: {value: 0, unit: "minute"},
            reminderMod: {value: 0, unit: "minute"},
            startMod: {value: 0, unit: "minute"},
        }
    );

    const [error, setError] = useState(false);

    return (
        <div className={clsx("flex flex-col space-y-2 w-96 h-96 justify-start", updating && "")}>
            <input
                type="text"
                value={activitySetting.name}
                className={clsx("p-2 mr-2 border-b-2 focus:outline-none transition-colors text-gray-700 text-xl", !error ? "border-gray-300 focus:border-blue-500" : "border-red-200 focus:border-red-500 placeholder-red-500")}
                placeholder="Activity Name"
                onChange={(e) => {
                    setError(false);
                    setActivitySetting({...activitySetting, name: e.target.value})
                }}
                disabled={updating}
            />

            <Tabs activeValue={activitySetting.activityType}
                  onChange={(type) => setActivitySetting({...activitySetting, activityType: type as ActivityType})}
                  disabled={updating}
            >
                <Tab value="task">
                    Task
                </Tab>
                <Tab value="event">
                    Event
                </Tab>
            </Tabs>

            {activitySetting.activityType === 'task' ?
                <TaskSettingConfig setting={unionSetting}
                                   onChange={(newSetting: TaskSetting) => setUnionSetting((setting) => {
                                       return {...setting, ...newSetting}
                                   })}
                                   disabled={updating}
                /> :
                <EventSettingConfig setting={unionSetting}
                                    onChange={(newSetting: EventSetting) => setUnionSetting((setting) => {
                                        return {...setting, ...newSetting}
                                    })}
                                    disabled={updating}
                />}
            <Button onClick={
                () => {
                    if (activitySetting.name.trim() === "") {
                        setError(true);
                    } else if (onSubmit) {
                        const setting = activitySetting.activityType === 'task' ? unionSetting as TaskSetting : unionSetting as EventSetting;

                        onSubmit({
                            ...activitySetting,
                            setting
                        });
                    }
                }
            }
                    disabled={updating}
            >Create</Button>
        </div>
    );
}

const hexToGray = (hex: string): number => {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return (r + g + b) / 255 / 3;
}

export const CategoryContext = React.createContext<CategoryInfo>({
    id: "-1",
    categoryName: "Loading...",
    backgroundColor: "#000000",
    textColor: "text-white"
});


export function ActivityColumn({categoryInfo}: {
    categoryInfo: CategoryInfo
}) {
    const {data: activities, refetch} = api.activities.getDetailedActivities.useQuery({categoryId: categoryInfo.id});
    const {mutateAsync: createTask} = api.activities.createTask.useMutation();
    const {mutateAsync: createEvent} = api.activities.createEvent.useMutation();
    const [isOpen, setIsOpen] = useState(false);
    const [updating, setUpdating] = useState(false);

    const textColor = hexToGray(categoryInfo.backgroundColor) > 0.7 ? "text-gray-800" : "text-white";


    return (
        <div className="flex flex-col w-96 min-w-[20em] h-full border-2 rounded-tl-md rounded-tr-md"
             style={{borderColor: categoryInfo.backgroundColor}}>
            <div
                className="flex flex-row items-center p-2 w-full justify-center select-none"
                style={{backgroundColor: categoryInfo.backgroundColor}}>
                <span className={clsx("font-bold", textColor)}>{categoryInfo.categoryName}</span>
            </div>
            <div className="flex flex-col w-full flex-grow overflow-y-scroll space-y-2 p-2">
                <CategoryContext.Provider value={{...categoryInfo, textColor}}>
                    {activities ?
                        activities.map((activity) => (
                            <ActivityOverview key={activity.id} activity={activity}/>
                        )) : null
                    }
                </CategoryContext.Provider>
            </div>

            <Menu open={isOpen} handler={setIsOpen}>
                <MenuHandler>
                    <div
                        className={clsx("flex flex-row p-2 w-full hover:contrast-200 cursor-pointer select-none", textColor)}
                        style={{backgroundColor: categoryInfo.backgroundColor}}>

                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                             className="w-5 h-5 mt-0.5">
                            <path
                                d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"/>
                        </svg>
                        <span className="font-bold">Add Item</span>
                    </div>
                </MenuHandler>
                <MenuList>
                    <AddActivityModal onSubmit={
                        (activitySetting: ActivitySetting) => {
                            let res;
                            setUpdating(true);

                            if (activitySetting.activityType === 'task') {
                                const setting = activitySetting.setting as TaskSetting;
                                res = createTask({
                                    categoryId: categoryInfo.id,
                                    name: activitySetting.name,
                                    setting: {
                                        at: setting.at,
                                        estimatedRequiredTime: setting.estimatedRequiredTime,
                                        deadlineMod: setting.deadlineMod,
                                        reminderMod: setting.reminderMod,
                                        startMod: setting.startMod,
                                    }
                                });
                            } else if (activitySetting.activityType === 'event') {
                                const setting = activitySetting.setting as EventSetting;
                                res = createEvent({
                                    categoryId: categoryInfo.id,
                                    name: activitySetting.name,
                                    setting: {
                                        at: setting.at,
                                        estimatedRequiredTime: setting.estimatedRequiredTime,
                                        reminderMod: setting.reminderMod,
                                        startMod: setting.startMod,
                                    }
                                });
                            }

                            void res?.then(() => {
                                setIsOpen(false);
                                setUpdating(false);
                                void refetch();
                            }).catch(() => {
                                setUpdating(false);
                            });
                        }
                    }
                                      updating={updating}
                    />
                </MenuList>
            </Menu>
        </div>
    )
}