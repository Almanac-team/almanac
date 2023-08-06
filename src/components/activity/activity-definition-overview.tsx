import React, {
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
} from 'react';
import clsx from 'clsx';
import { CategoryContext } from '~/components/activity/activity-column';
import { ActivityUpdateModal } from '~/components/activity/activity-settings';

import {
    AdjustmentsHorizontalIcon,
    ClockIcon,
    FlagIcon,
} from '@heroicons/react/24/outline';
import { TimeContext } from '~/pages/_app';
import { IconButton } from '@material-tailwind/react';
import { api } from '~/utils/api';
import { Menu, MenuBody, MenuHandler } from '~/components/generic/menu';
import { type ActivitySetting } from '~/components/activity/models';
import { useQueryClient } from '@tanstack/react-query';
import {
    type ActivityDefinition,
    type RepeatSetting,
} from '~/components/activity/activity-definition-models';
import { updateActivityDefinitions } from '~/data/activityDefinitions/mutate';
import { generateVirtualActivities } from '~/data/activityDefinitions/virtualActivities';

const MILLISECONDS_IN_HOUR = 60 * 60 * 1000;
const MILLISECONDS_IN_DAY = 24 * MILLISECONDS_IN_HOUR;

function TimeBubble({ deadline }: { deadline: Date }) {
    const currentTime = useContext(TimeContext);

    const remainingTime = deadline.getTime() - currentTime.getTime();
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
                        className="w-24 origin-top-left -rotate-90 overflow-hidden rounded-tl-lg rounded-tr-lg px-2 transition-all"
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
    onSubmit,
}: {
    index: number;
    activitySetting: ActivitySetting;
    repeatSetting: RepeatSetting;
    onSubmit?: (
        activitySetting: ActivitySetting,
        repeatSetting: {
            index: number;
            scope: 'this' | 'all' | 'future';
            repeatSetting: RepeatSetting;
        },
        closeModal: () => unknown
    ) => unknown;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [updating, isUpdating] = useState(false);

    let deadline;
    let icon;
    const activity = activitySetting;
    if (activity.setting.type === 'task') {
        deadline = activity.setting.value.at;
        icon = <FlagIcon className="h-8 w-6" />;
    } else {
        deadline = activity.setting.value.at;
        icon = <ClockIcon className="h-8 w-6" />;
    }

    return (
        <div className="relative flex flex-row items-center rounded-lg bg-gray-200">
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
                    <Pill className="bg-gray-400">17:00 - 18:00</Pill>
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
                                onSubmit?.(activitySetting, repeatSetting, () =>
                                    setIsOpen(false)
                                );
                            }}
                            updating={updating}
                        />
                    </MenuBody>
                </Menu>
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
                        activitySetting: activitySetting,
                    },
                };
                updateActivityDefinitions({
                    queryClient,
                    categoryId: category.id,
                    activityDefinition: newActivityDefinition,
                });
            } else {
                newActivityDefinition = {
                    id: activityDefinition.id,
                    data: {
                        ...activityDefinition.data,
                        type: 'repeating',
                        repeatConfig: repeatSetting.repeatSetting.repeatConfig,
                        endConfig: repeatSetting.repeatSetting.endConfig,
                        activitySetting,
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

    const activitySettings: ActivitySetting[] = useMemo(() => {
        const data = activityDefinition.data;
        if (data.type === 'single') {
            return [data.activitySetting];
        } else {
            const g = generateVirtualActivities(data, 10);
            console.log(g);
            return g;
        }
    }, [activityDefinition]);

    let inner;

    if (activityDefinition.data.type === 'single') {
        inner = (
            <ActivityOverview
                index={0}
                activitySetting={activityDefinition.data.activitySetting}
                repeatSetting={repeatSetting}
                onSubmit={submitChange}
            />
        );
    } else {
        inner = (
            <div className="max-h-96 space-y-1 overflow-y-scroll border-y-4 border-gray-800 bg-gray-400 p-1">
                {activitySettings.map(
                    (activitySetting: ActivitySetting, index: number) => (
                        <ActivityOverview
                            key={index}
                            index={index}
                            activitySetting={activitySetting}
                            repeatSetting={repeatSetting}
                            onSubmit={submitChange}
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
