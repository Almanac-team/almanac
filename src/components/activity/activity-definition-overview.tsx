import React, {
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
    useEffect,
} from 'react';
import clsx from 'clsx';
import { CategoryContext } from '~/components/activity/activity-column';
import { ActivityUpdateModal } from '~/components/activity/activity-settings';

import {
    AdjustmentsHorizontalIcon,
    ClockIcon,
    FlagIcon,
} from '@heroicons/react/24/outline';
import { IconButton } from '@material-tailwind/react';
import { api } from '~/utils/api';
import { Menu, MenuBody, MenuHandler } from '~/components/generic/menu';
import { type ActivitySetting } from '~/components/activity/models';
import { useQueryClient } from '@tanstack/react-query';
import {
    type ActivityCompletions,
    type ActivityDefinition,
    computeActivityCompletionsDiff,
    type RepeatSetting,
} from '~/components/activity/activity-definition-models';
import { updateActivityDefinitions } from '~/data/activityDefinitions/mutate';
import {
    type ActivitySettingWithCompletion,
    getActivitiesFromDefinition,
} from '~/data/activityDefinitions/virtualActivities';

const MILLISECONDS_IN_HOUR = 60 * 60 * 1000;
const MILLISECONDS_IN_DAY = 24 * MILLISECONDS_IN_HOUR;

function TimeBubble({ deadline }: { deadline: Date }) {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const remainingTime = deadline.getTime() - time.getTime();
    const remainingDays = remainingTime / MILLISECONDS_IN_DAY;

    if (remainingDays >= 14) {
        return (
            <span className="flex h-8 items-center justify-center rounded-lg bg-green-500 px-2 font-bold text-white">
                {Math.floor(remainingDays)}
            </span>
        );
    } else if (remainingDays >= 10) {
        return (
            <span className="flex h-8 items-center justify-center rounded-lg bg-green-400 px-2 font-bold text-white">
                {Math.floor(remainingDays)}
            </span>
        );
    } else if (remainingDays >= 7) {
        return (
            <span className="flex h-8 items-center justify-center rounded-lg bg-green-400 px-3 font-bold text-white">
                {Math.floor(remainingDays)}
            </span>
        );
    } else if (remainingDays >= 3) {
        return (
            <span className="flex h-8 items-center justify-center rounded-lg bg-yellow-400 px-3 font-bold text-white">
                {Math.floor(remainingDays)}
            </span>
        );
    } else if (remainingDays >= 1) {
        return (
            <span className="flex h-8 items-center justify-center rounded-lg bg-red-400 px-3 font-bold text-white">
                {Math.floor(remainingDays)}
            </span>
        );
    } else if (remainingTime >= 60000) {
        return (
            <span className="flex h-8 items-center justify-center rounded-lg bg-red-500 px-3 font-bold text-white">
                {`${Math.floor(remainingTime / MILLISECONDS_IN_HOUR)
                    .toString()
                    .padStart(2, '0')}:
                ${Math.floor((remainingTime % MILLISECONDS_IN_HOUR) / 1000 / 60)
                    .toString()
                    .padStart(2, '0')}`}
            </span>
        );
    } else if (remainingTime >= 0) {
        return (
            <span className="flex h-8 items-center justify-center rounded-lg bg-red-500 px-3 font-bold text-white">
                {`${Math.floor(remainingTime / 1000).toString()}s`}
            </span>
        );
    } else if (remainingTime > -60000) {
        return (
            <span className="flex h-8 items-center justify-center rounded-lg bg-red-500 px-3 font-bold text-white">
                {`${Math.floor(remainingTime / 1000).toString()}s`}
            </span>
        );
    } else if (remainingDays > -1) {
        return (
            <span className="flex h-8 items-center justify-center rounded-lg bg-red-500 px-3 font-bold text-white">
                {`-${Math.floor(Math.abs(remainingTime) / MILLISECONDS_IN_HOUR)
                    .toString()
                    .padStart(2, '0')}:
                ${Math.floor(
                    (-remainingTime % MILLISECONDS_IN_HOUR) / 1000 / 60
                )
                    .toString()
                    .padStart(2, '0')}`}
            </span>
        );
    } else {
        return (
            <span className="flex h-8 items-center justify-center rounded-lg bg-red-900 px-3 font-bold text-white">
                {Math.floor(remainingDays)}
            </span>
        );
    }
}

function ActivityTag() {
    const categoryInfo = useContext(CategoryContext);
    const ref = useRef<HTMLDivElement>(null);
    const [sW, setSW] = useState(32);
    const [hover, setHover] = useState(false);

    return (
        <div
            className={clsx('ml-0 mr-2 flex h-24 transition-all')}
            style={{ minWidth: sW }}
            onMouseEnter={() => {
                setHover(true);
                setSW(
                    Math.min(Math.max(32, ref.current?.clientHeight ?? 0), 128)
                );
            }}
            onMouseLeave={() => {
                setHover(false);
                setSW(32);
            }}
        >
            <div className="absolute max-h-0 overflow-hidden">
                <span
                    ref={ref}
                    className={clsx(
                        'invisible block w-24 overflow-x-hidden whitespace-break-spaces break-words px-2 text-center font-bold'
                    )}
                >
                    {categoryInfo.categoryName}
                </span>
            </div>

            <div className="relative top-24">
                <div className="absolute inset-0">
                    <div
                        className="w-24 origin-top-left -rotate-90 overflow-hidden rounded-tl-md rounded-tr-md px-2 transition-all"
                        style={{
                            minHeight: sW,
                            maxHeight: sW,
                            backgroundColor: categoryInfo.backgroundColor,
                        }}
                    >
                        <span
                            className={clsx(
                                'block overflow-x-hidden text-center font-bold',
                                categoryInfo.textColor,
                                hover
                                    ? 'whitespace-break-spaces break-words'
                                    : 'overflow-ellipsis whitespace-nowrap'
                            )}
                        >
                            {categoryInfo.categoryName}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Pill({
    children,
    className,
}: {
    children: ReactNode;
    className: string;
}) {
    return (
        <div
            className={clsx(
                'text-zinc-700 flex h-8 flex-row items-center justify-between rounded-lg px-2 text-[12px] font-bold',
                className
            )}
        >
            <span className="justify-self-center">{children}</span>
        </div>
    );
}

function ActivityOverview({
    index,
    activitySetting,
    repeatSetting,
    completed,
    onSubmit,
    onCompletionChange,
}: {
    index: number;
    activitySetting: ActivitySetting;
    repeatSetting: RepeatSetting;
    completed?: boolean;
    onSubmit?: (
        activitySetting: ActivitySetting,
        repeatSetting: {
            index: number;
            scope: 'this' | 'all' | 'future';
            repeatSetting: RepeatSetting;
        },
        closeModal: () => unknown
    ) => unknown;
    onCompletionChange?: (completed: boolean) => unknown;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [updating, isUpdating] = useState(false);

    const activity = activitySetting;
    const deadline = activity.at;

    const icon =
        activity.setting.type === 'task' ? (
            <FlagIcon className="h-8 w-6" />
        ) : (
            <ClockIcon className="h-8 w-6" />
        );

    return (
        <div
            className={clsx(
                'relative flex flex-row items-center rounded-lg bg-gray-200',
                completed && 'contrast-50',
                (deadline.getTime() - Date.now() < 0) && 'border-red-800 border-2 '
            )}
        >
            <ActivityTag />
            <div className="flex w-full flex-col space-y-2">
                <div className="flex space-x-3">
                    <TimeBubble deadline={deadline} />
                    <span className="max-w-[calc(100%-100px)] overflow-x-hidden overflow-ellipsis whitespace-nowrap text-xl font-bold text-gray-900">
                        {activity.name}
                    </span>
                </div>
                <div className="flex space-x-2">
                    <Pill className="bg-gray-400">{icon}</Pill>
                    <Pill className="bg-gray-400">
                        {deadline.getHours().toString()}:
                        {deadline.getMinutes().toString().padStart(2, '0')}
                    </Pill>
                    <Pill className="bg-gray-400">
                        {deadline.toDateString()}
                    </Pill>
                </div>
            </div>

            <div className="absolute right-1 top-1">
                <Menu open={isOpen} handler={setIsOpen}>
                    <MenuHandler>
                        <IconButton className="h-8 w-8 rounded bg-gray-600 hover:bg-gray-500">
                            <AdjustmentsHorizontalIcon className="h-8 w-6" />
                        </IconButton>
                    </MenuHandler>
                    <MenuBody>
                        <ActivityUpdateModal
                            index={index}
                            activitySetting={activitySetting}
                            repeatSetting={repeatSetting}
                            onSubmit={(
                                activitySetting: ActivitySetting,
                                repeatSetting: {
                                    index: number;
                                    scope: 'this' | 'all' | 'future';
                                    repeatSetting: RepeatSetting;
                                }
                            ) => {
                                isUpdating(true);
                                onSubmit?.(
                                    activitySetting,
                                    repeatSetting,
                                    () => {
                                        setIsOpen(false);
                                        isUpdating(false);
                                    }
                                );
                            }}
                            updating={updating}
                        />
                    </MenuBody>
                </Menu>
            </div>

            <div className="absolute bottom-2 right-2">
                <input
                    type="checkbox"
                    className="h-6 w-6 bg-gray-600 hover:bg-gray-500"
                    checked={completed}
                    onChange={() => {
                        onCompletionChange?.(!completed);
                    }}
                />
            </div>
        </div>
    );
}

export const ActivityDefinitionContext = createContext<
    | {
          activityDefinition: ActivityDefinition;
      }
    | undefined
>(undefined);

const extractRepeatSetting = (
    activityDefinition: ActivityDefinition
): RepeatSetting => {
    if (activityDefinition.data.type === 'single') {
        return { type: 'single' };
    } else {
        return {
            type: 'repeating',
            repeatConfig: activityDefinition.data.repeatConfig,
            endConfig: activityDefinition.data.endConfig,
        };
    }
};

export function ActivityDefinitionOverview({
    activityDefinition,
}: {
    activityDefinition: ActivityDefinition;
}) {
    const category = useContext(CategoryContext);
    const queryClient = useQueryClient();

    const { mutateAsync: updateActivityDefinition } =
        api.activityDefinitions.updateActivityDefinition.useMutation();

    const { mutateAsync: updateActivityCompletions } =
        api.activityDefinitions.updateActivityCompletions.useMutation();

    const repeatSetting = useMemo(
        () => extractRepeatSetting(activityDefinition),
        [activityDefinition]
    );

    const submitChange = useCallback(
        (
            activitySetting: ActivitySetting,
            repeatSetting: {
                index: number;
                scope: 'this' | 'all' | 'future';
                repeatSetting: RepeatSetting;
            },
            closeModal: () => unknown
        ) => {
            let newActivityDefinition: ActivityDefinition;

            if (repeatSetting.repeatSetting.type === 'single') {
                newActivityDefinition = {
                    id: activityDefinition.id,
                    data: {
                        ...activityDefinition.data,
                        type: 'single',
                        activityTemplate: activitySetting,
                    },
                };
            } else {
                newActivityDefinition = {
                    id: activityDefinition.id,
                    data: {
                        ...activityDefinition.data,
                        type: 'repeating',
                        repeatConfig: repeatSetting.repeatSetting.repeatConfig,
                        endConfig: repeatSetting.repeatSetting.endConfig,
                        activityTemplate: activitySetting,
                        exceptions: new Map(),
                    },
                };
            }

            updateActivityDefinition(newActivityDefinition)
                .then(() => {
                    updateActivityDefinitions({
                        queryClient,
                        categoryId: category.id,
                        activityDefinition: newActivityDefinition,
                    });
                    closeModal();
                })
                .catch(() => {
                    return;
                });
        },
        [activityDefinition, category.id, queryClient, updateActivityDefinition]
    );

    const setChecked = useCallback(
        (index: number, checked: boolean) => {
            const oldActivityDefinition = activityDefinition;
            const diff = computeActivityCompletionsDiff(
                activityDefinition.activityCompletions ?? null,
                index,
                checked
            );
            let newActivityCompletions: ActivityCompletions | undefined =
                undefined;
            if (diff.newLatestFinishedIndex !== -1) {
                const exceptions = new Set<number>(
                    activityDefinition.activityCompletions?.exceptions ?? []
                );

                diff.added.forEach((index) => exceptions.add(index));
                diff.removed.forEach((index) => exceptions.delete(index));

                newActivityCompletions = {
                    latestFinishedIndex: diff.newLatestFinishedIndex,
                    exceptions,
                };
            }

            updateActivityDefinitions({
                queryClient,
                categoryId: category.id,
                activityDefinition: {
                    ...activityDefinition,
                    activityCompletions: newActivityCompletions,
                },
            });

            updateActivityCompletions({
                activityDefinitionId: activityDefinition.id,
                newIndex: newActivityCompletions?.latestFinishedIndex ?? -1,
                exceptions: [...(newActivityCompletions?.exceptions ?? [])],
            })
                .then(() => {
                    return;
                })
                .catch(() => {
                    updateActivityDefinitions({
                        queryClient,
                        categoryId: category.id,
                        activityDefinition: oldActivityDefinition,
                    });
                });
        },
        [
            activityDefinition,
            category.id,
            queryClient,
            updateActivityCompletions,
        ]
    );

    const activitySettings: ActivitySettingWithCompletion[] = useMemo(() => {
        return getActivitiesFromDefinition(activityDefinition, {
            type: 'total',
            count: 10,
        });
    }, [activityDefinition]);

    let inner;

    if (activityDefinition.data.type === 'single') {
        const activitySetting = activitySettings[0];
        if (!activitySetting) return null;
        inner = (
            <ActivityOverview
                index={0}
                activitySetting={activitySetting}
                repeatSetting={repeatSetting}
                completed={activitySetting.completed}
                onSubmit={submitChange}
                onCompletionChange={(completed: boolean) => {
                    setChecked(0, completed);
                }}
            />
        );
    } else {
        inner = (
            <div className="max-h-96 space-y-1 overflow-y-scroll border-y-4 border-gray-800 bg-gray-400 p-1">
                {activitySettings.map(
                    (
                        activitySetting: ActivitySettingWithCompletion,
                        index: number
                    ) => (
                        <ActivityOverview
                            key={index}
                            index={index}
                            completed={activitySetting.completed}
                            activitySetting={activitySetting}
                            repeatSetting={repeatSetting}
                            onSubmit={submitChange}
                            onCompletionChange={(completed: boolean) => {
                                setChecked(index, completed);
                            }}
                        />
                    )
                )}
            </div>
        );
    }

    return (
        <ActivityDefinitionContext.Provider
            value={{
                activityDefinition: activityDefinition,
            }}
        >
            <div className="min-h-24 w-full select-none">{inner}</div>
        </ActivityDefinitionContext.Provider>
    );
}
