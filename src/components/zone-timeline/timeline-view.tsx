import clsx from 'clsx';
import {
    type DayViewProps,
    type ScheduledBlock,
    TimelineInteractionContext,
} from '~/components/zone-timeline/models';
import { useContext, useMemo, useRef } from 'react';

function ViewInner({
    blockList,
    startDay,
    index,
}: {
    blockList: ScheduledBlock[];
    startDay: Date;
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
}: {
    className?: string;
    dayViewList: DayViewProps[];
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

    return <TimelineView className={className} dayViewList={dayViewList} />;
}
