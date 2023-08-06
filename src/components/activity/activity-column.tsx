import clsx from 'clsx';
import { ActivityDefinitionOverview } from '~/components/activity/activity-definition-overview';
import { api } from '~/utils/api';
import React, { useState } from 'react';
import { Button } from '@material-tailwind/react';
import { useRouter } from 'next/router';
import { Menu, MenuBody, MenuHandler } from '~/components/generic/menu';
import {
    EventSettingConfig,
    TaskSettingConfig,
} from '~/components/activity/activity-settings';
import { Tab, Tabs } from '~/components/generic/tab';
import {
    type CategoryInfo,
    type EventSetting,
    type TaskSetting,
    type ActivitySetting,
} from '~/components/activity/models';
import { useQueryClient } from '@tanstack/react-query';
import { useQueryActivityDefinitions } from '~/data/activityDefinitions/query';
import { appendActivityDefinitions } from '~/data/activityDefinitions/mutate';

function ActivityCreateModal({
    onSubmit,
    updating,
}: {
    onSubmit?: (activitySetting: ActivitySetting) => void;
    updating?: boolean;
}) {
    const [activitySetting, setActivitySetting] = useState<
        Omit<ActivitySetting, 'setting'>
    >({
        id: '-1',
        name: '',
    });

    const [unionSetting, setUnionSetting] = useState<
        TaskSetting & EventSetting & { activityType: 'task' | 'event' }
    >({
        activityType: 'task',
        at: (() => {
            const date = new Date();
            date.setHours(47, 59, 0, 0);
            return date;
        })(),
        estimatedRequiredTime: 60,
        deadlineMod: { value: 1, unit: 'day' },
        reminderMod: { value: 30, unit: 'minute' },
        startMod: { value: 1, unit: 'week' },
    });

    const [error, setError] = useState(false);

    return (
        <div
            className={clsx(
                'flex h-[26rem] w-96 flex-col justify-start space-y-2',
                updating && ''
            )}
        >
            <input
                type="text"
                value={activitySetting.name}
                className={clsx(
                    'mr-2 border-b-2 p-2 text-xl text-gray-700 transition-colors focus:outline-none',
                    !error
                        ? 'border-gray-300 focus:border-blue-500'
                        : 'border-red-200 placeholder-red-500 focus:border-red-500'
                )}
                placeholder="Activity Name"
                onChange={(e) => {
                    setError(false);
                    setActivitySetting({
                        ...activitySetting,
                        name: e.target.value,
                    });
                }}
                disabled={updating}
            />

            <Tabs
                activeValue={unionSetting.activityType}
                onChange={(type: string) => {
                    if (type != 'task' && type != 'event') return;
                    setUnionSetting({
                        ...unionSetting,
                        activityType: type,
                    });
                }}
                disabled={updating}
            >
                <Tab value="task">Task</Tab>
                <Tab value="event">Event</Tab>
            </Tabs>

            {unionSetting.activityType === 'task' ? (
                <TaskSettingConfig
                    setting={unionSetting}
                    onChange={(newSetting: TaskSetting) =>
                        setUnionSetting((setting) => {
                            return { ...setting, ...newSetting };
                        })
                    }
                    disabled={updating}
                />
            ) : (
                <EventSettingConfig
                    setting={unionSetting}
                    onChange={(newSetting: EventSetting) =>
                        setUnionSetting((setting) => {
                            return { ...setting, ...newSetting };
                        })
                    }
                    disabled={updating}
                />
            )}
            <Button
                onClick={() => {
                    if (activitySetting.name.trim() === '') {
                        setError(true);
                    } else if (onSubmit) {
                        onSubmit({
                            ...activitySetting,
                            setting:
                                unionSetting.activityType === 'task'
                                    ? {
                                          type: 'task',
                                          value: unionSetting as TaskSetting,
                                      }
                                    : {
                                          type: 'event',
                                          value: unionSetting as EventSetting,
                                      },
                        });
                    }
                }}
                disabled={updating}
            >
                Create
            </Button>
        </div>
    );
}

const hexToGray = (hex: string): number => {
    const bigint = parseInt(hex.replace('#', ''), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return (r + g + b) / 255 / 3;
};

export const CategoryContext = React.createContext<CategoryInfo>({
    id: '-1',
    categoryName: 'Loading...',
    backgroundColor: '#000000',
    textColor: 'text-white',
});

export function ActivityColumn({
    categoryInfo,
}: {
    categoryInfo: CategoryInfo;
}) {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { data: activityDefinitions } = useQueryActivityDefinitions({
        categoryId: categoryInfo.id,
    });
    const { mutateAsync: createActivityDefinition } =
        api.activityDefinitions.createActivityDefinition.useMutation();
    const [isOpen, setIsOpen] = useState(false);
    const [updating, setUpdating] = useState(false);

    const textColor =
        hexToGray(categoryInfo.backgroundColor) > 0.7
            ? 'text-gray-800'
            : 'text-white';

    return (
        <div
            className="flex h-full w-96 min-w-[20em] flex-col rounded-tl-md rounded-tr-md border-2"
            style={{ borderColor: categoryInfo.backgroundColor }}
        >
            <button
                onClick={() =>
                    void router.push(`/definitions/${categoryInfo.id}`)
                }
            >
                <div
                    className="flex w-full select-none flex-row items-center justify-center p-2"
                    style={{ backgroundColor: categoryInfo.backgroundColor }}
                >
                    <span className={clsx('font-bold', textColor)}>
                        {categoryInfo.categoryName}
                    </span>
                </div>
            </button>
            <div className="flex w-full flex-grow flex-col space-y-2 overflow-y-scroll p-2">
                <CategoryContext.Provider
                    value={{ ...categoryInfo, textColor }}
                >
                    {activityDefinitions
                        ? activityDefinitions.map((activityDefinition) => (
                              <ActivityDefinitionOverview
                                  key={activityDefinition.id}
                                  activityDefinition={activityDefinition}
                              />
                          ))
                        : null}
                </CategoryContext.Provider>
            </div>

            <Menu open={isOpen} handler={setIsOpen}>
                <MenuHandler>
                    <div
                        className={clsx(
                            'flex w-full cursor-pointer select-none flex-row p-2 hover:contrast-200',
                            textColor
                        )}
                        style={{
                            backgroundColor: categoryInfo.backgroundColor,
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="mt-0.5 h-5 w-5"
                        >
                            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                        </svg>
                        <span className="font-bold">Add Item</span>
                    </div>
                </MenuHandler>
                <MenuBody>
                    <ActivityCreateModal
                        onSubmit={(activitySetting: ActivitySetting) => {
                            setUpdating(true);

                            createActivityDefinition({
                                categoryId: categoryInfo.id,
                                data: {
                                    type: 'single',
                                    activitySetting,
                                },
                            })
                                .then((activityDefinitionId: string) => {
                                    appendActivityDefinitions({
                                        queryClient,
                                        categoryId: categoryInfo.id,
                                        activityDefinition: {
                                            id: activityDefinitionId,
                                            data: {
                                                type: 'single',
                                                activitySetting,
                                            },
                                        },
                                    });

                                    setIsOpen(false);
                                    setUpdating(false);
                                })
                                .catch(() => {
                                    setIsOpen(false);
                                    setUpdating(false);
                                });
                        }}
                        updating={updating}
                    />
                </MenuBody>
            </Menu>
        </div>
    );
}
