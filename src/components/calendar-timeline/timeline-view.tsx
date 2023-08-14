import clsx from 'clsx';
import {
    type DayViewProps,
    type ScheduledBlock,
    TimelineInteractionContext,
} from '~/components/zone-timeline/models';
import { useContext, useMemo, useRef, useState } from 'react';
import { useQueryActivityDefinitions } from '~/data/activityDefinitions/query';
import { useQuery } from '@tanstack/react-query';
import { getActivityDefinitionRange } from '~/components/activity/activity-definition-models';
import { type ActivitySetting } from '~/components/activity/models';
import { getActivitiesFromDefinition } from '~/data/activityDefinitions/virtualActivities';
import { Menu, MenuBody, MenuHandler } from '~/components/generic/menu';

function withinDay(date: Date, startDay: Date) {
    return (
        date.getTime() >= startDay.getTime() &&
        date.getTime() < startDay.getTime() + 1000 * 60 * 60 * 24
    );
}

interface Deadline {
    time: number;
    activities: ActivitySetting[];
}

function DeadlineView({
    deadline,
    startDay,
}: {
    deadline: Deadline;
    startDay: Date;
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="absolute -mt-2 flex h-0.5 w-full cursor-pointer select-none flex-row"
            style={{
                top:
                    Math.max(
                        (deadline.time - startDay.getTime()) / 1000 / 60 / 60,
                        0
                    ) * 40,
            }}
        >
            <Menu open={isOpen} handler={setIsOpen}>
                <MenuHandler className="flex h-4 w-full cursor-pointer select-none flex-row">
                    <div className="mt-2 h-0.5 w-full bg-red-400 hover:contrast-200" />
                </MenuHandler>
                <MenuBody>
                    {deadline.activities.map((activity, i) => (
                        <div key={i}>
                            Deadline: {activity.name} at{' '}
                            {activity.setting.value.at.toString()}
                        </div>
                    ))}
                </MenuBody>
            </Menu>
        </div>
    );
}

function DeadlineViews({
    activitySettings,
    startDay,
}: {
    activitySettings: ActivitySetting[];
    startDay: Date;
}) {
    const deadlines: Deadline[] = useMemo(() => {
        const deadlines = [];

        const filteredSortedActivitySettings = activitySettings
            .filter(
                (activitySetting) => activitySetting.setting.type === 'task'
            )
            .filter((activitySetting) =>
                withinDay(activitySetting.setting.value.at, startDay)
            )
            .sort(
                (a, b) =>
                    a.setting.value.at.getTime() - b.setting.value.at.getTime()
            );

        let last = null;
        for (let i = 0; i < filteredSortedActivitySettings.length; i++) {
            const activitySetting: ActivitySetting =
                filteredSortedActivitySettings[i] as ActivitySetting;
            if (
                last !== null &&
                activitySetting.setting.value.at.getTime() - last.time <
                    1000 * 60 * 10
            ) {
                last.activities.push(activitySetting);
            } else {
                last = {
                    time: activitySetting.setting.value.at.getTime(),
                    activities: [activitySetting],
                };
                deadlines.push(last);
            }
        }

        return deadlines;
    }, [activitySettings, startDay]);

    return (
        <>
            {deadlines.map((deadline, i) => (
                <DeadlineView deadline={deadline} startDay={startDay} key={i} />
            ))}
        </>
    );
}

function TaskDates({
    activitySettings,
    startDay,
}: {
    activitySettings: ActivitySetting[];
    startDay: Date;
}) {
    return (
        <>
            <DeadlineViews
                activitySettings={activitySettings}
                startDay={startDay}
            />
        </>
    );
}

function ViewInner({
    blockList,
    startDay,
    index,
    activitySettings,
}: {
    blockList: ScheduledBlock[];
    startDay: Date;
    activitySettings: ActivitySetting[];
    index?: number;
}) {
    const {
        selectedEventId,

        onBlockClick,
        onBlockMouseDown,

        onBackgroundClick,
        onBackgroundMouseDown,
    } = useContext(TimelineInteractionContext);

    const ref = useRef<HTMLDivElement>(null);

    return (
        <div
            className="relative h-fit w-52 border-2 border-blue-gray-400"
            draggable={false}
            ref={ref}
            onClick={(e) => {
                onBackgroundClick?.(
                    index ?? 0,
                    (e.clientY -
                        (ref?.current?.getBoundingClientRect().y ?? 0)) /
                        e.currentTarget.clientHeight
                );
            }}
            onMouseDown={(e) =>
                onBackgroundMouseDown?.(
                    index ?? 0,
                    {
                        x: e.clientX,
                        y: e.clientY,
                    },
                    e.currentTarget.clientHeight
                )
            }
        >
            {Array.from({ length: 24 }, (_, i) => i + 1).map((hour) => (
                <div
                    key={hour}
                    className={`h-10 w-full bg-gray-${hour % 2 ? 200 : 100}`}
                    draggable={false}
                ></div>
            ))}

            <TaskDates
                activitySettings={activitySettings}
                startDay={startDay}
            />

            {blockList.map((block, i) => {
                const startTimeRelative =
                    (block.date.getTime() - startDay.getTime()) /
                    1000 /
                    60 /
                    60;
                const endHourRelative = startTimeRelative + block.hours;
                if (endHourRelative <= 0.01) return null;
                if (startTimeRelative >= 24) return null;

                return (
                    <div
                        className={clsx(
                            'absolute flex w-full bg-blue-400 px-2 text-sm text-white',
                            !(startTimeRelative < 0) && `rounded-t-md`,
                            !(endHourRelative >= 24) && `rounded-b-md`
                        )}
                        onClick={(e) => {
                            e.stopPropagation();
                            onBlockClick?.(block.id);
                        }}
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            onBlockMouseDown?.(block.id);
                        }}
                        style={{
                            top: Math.max(startTimeRelative, 0) * 40,
                            height:
                                (Math.min(endHourRelative, 24) -
                                    Math.max(startTimeRelative, 0)) *
                                40,
                            backgroundColor: block.color ?? '#41a4f3',
                        }}
                        key={i}
                    >
                        {`${block.name}${
                            startTimeRelative < 0 ? ' (continued)' : ''
                        }`}
                    </div>
                );
            })}
        </div>
    );
}

export function TimelineView({
    className,
    dayViewList,
    activitySettings,
}: {
    className?: string;
    dayViewList: DayViewProps[];
    activitySettings: ActivitySetting[];
}) {
    return (
        <div
            className={clsx('relative overflow-y-scroll pr-1', className ?? '')}
        >
            <div className="flex flex-row pt-4">
                <div className="mt-10">
                    {Array.from({ length: 25 }, (_, i) => i).map((hour) => (
                        <div key={hour} className="h-10 w-20 text-center">
                            {' '}
                            {hour % 24}:00
                        </div>
                    ))}
                </div>
                <div className="mt-3">
                    <div className="flex flex-row">
                        {dayViewList.map((dayView, i) => (
                            <div key={dayView.dayLabel} className="-mr-0.5">
                                <div className="sticky top-0 z-10 w-full bg-white">
                                    <div
                                        className={clsx(
                                            'z-10 w-full bg-gray-300 py-2',
                                            i == 0 && `rounded-tl-md`,
                                            i == dayViewList.length - 1 &&
                                                `rounded-tr-md`
                                        )}
                                        draggable={false}
                                    >
                                        <div className="mx-auto text-center">
                                            {dayView.dayLabel}
                                        </div>
                                    </div>
                                </div>
                                <ViewInner
                                    blockList={dayView.blockList}
                                    startDay={dayView.startDay}
                                    index={i}
                                    activitySettings={activitySettings}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function WeekView({
    className,
    blockList,
    firstDayMidnight,
}: {
    className?: string;
    blockList: ScheduledBlock[];
    firstDayMidnight: Date;
}) {
    const lastDayMidnightMinPrior = useMemo(
        () =>
            new Date(
                firstDayMidnight.getTime() + 7 * 24 * 60 * 60 * 1000 - 60 * 1000
            ),
        [firstDayMidnight]
    );

    const { data: activityDefinitions } = useQueryActivityDefinitions();

    const { data: activitySettings } = useQuery(
        ['paginatedActivitySettings', firstDayMidnight.getTime()],
        () => {
            const activitySettings: ActivitySetting[] = [];

            for (const activityDefinition of activityDefinitions ?? []) {
                const { startDate, endDate } =
                    getActivityDefinitionRange(activityDefinition);
                if (
                    startDate > lastDayMidnightMinPrior ||
                    (endDate !== null && endDate < firstDayMidnight)
                )
                    continue;

                activitySettings.push(
                    ...getActivitiesFromDefinition(
                        activityDefinition,
                        { type: 'until', until: lastDayMidnightMinPrior },
                        { type: 'from', from: firstDayMidnight }
                    )
                );
            }
            return activitySettings;
        },
        { enabled: !!activityDefinitions }
    );

    const dayViewList = useMemo(() => {
        return [
            {
                dayLabel: 'Monday',
                blockList,
                startDay: firstDayMidnight,
            },
            {
                dayLabel: 'Tuesday',
                blockList,
                startDay: new Date(
                    firstDayMidnight.getTime() + 24 * 60 * 60 * 1000
                ),
            },
            {
                dayLabel: 'Wednesday',
                blockList,
                startDay: new Date(
                    firstDayMidnight.getTime() + 24 * 60 * 60 * 1000 * 2
                ),
            },
            {
                dayLabel: 'Thursday',
                blockList,
                startDay: new Date(
                    firstDayMidnight.getTime() + 24 * 60 * 60 * 1000 * 3
                ),
            },
            {
                dayLabel: 'Friday',
                blockList,
                startDay: new Date(
                    firstDayMidnight.getTime() + 24 * 60 * 60 * 1000 * 4
                ),
            },
            {
                dayLabel: 'Saturday',
                blockList,
                startDay: new Date(
                    firstDayMidnight.getTime() + 24 * 60 * 60 * 1000 * 5
                ),
            },
            {
                dayLabel: 'Sunday',
                blockList,
                startDay: new Date(
                    firstDayMidnight.getTime() + 24 * 60 * 60 * 1000 * 6
                ),
            },
        ];
    }, [blockList, firstDayMidnight]);

    return (
        <TimelineView
            className={className}
            dayViewList={dayViewList}
            activitySettings={activitySettings ?? []}
        />
    );
}
