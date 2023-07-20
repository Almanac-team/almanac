import {type ScheduledEvent} from "~/utils/types";
import clsx from "clsx";

function ViewInner({activityList, startDay}: { activityList: ScheduledEvent[], startDay: Date }) {
    return (
        <div className="relative w-52 h-fit border-2 border-blue-gray-400">
            {
                Array.from({length: 24}, (_, i) => i + 1).map(hour => (
                    <div key={hour} className={`w-full h-10 bg-gray-${hour % 2 ? 200 : 100}`}></div>
                ))
            }
            {activityList.map(activity => {
                const startTimeRelative = (activity.at.getTime() - startDay.getTime()) / 1000 / 60 / 60
                const endHourRelative = startTimeRelative + activity.length;
                if (endHourRelative < 0) return null;
                if (startTimeRelative >= 24) return null;

                return <div className={clsx('absolute bg-blue-400 text-white w-full px-2 flex text-sm',
                    !(startTimeRelative < 0) && `rounded-t-md`,
                    !(endHourRelative >= 24) && `rounded-b-md`)
                }
                            style={{
                                top: Math.max(startTimeRelative, 0) * 40,
                                height: (Math.min(endHourRelative, 24) - Math.max(startTimeRelative, 0)) * 40
                            }}
                            key={activity.id}>
                    {`${activity.name}${startTimeRelative < 0 ? " (continued)" : ""}`}
                </div>
            })}
        </div>
    );
}

interface IDayViewProps {
    startDay: Date,
    dayLabel: string,
    activityList: ScheduledEvent[]
}

export function TimelineView({className, dayViewList}: { className: string, dayViewList: IDayViewProps[] }) {
    return (
        <div className={clsx("overflow-y-scroll pr-1 relative", className)}>
            <div className='flex flex-row mt-4'>
                <div className="mt-10">
                    {
                        Array.from({length: 25}, (_, i) => i).map(hour => (
                            <div key={hour} className='w-20 h-10 text-center'> {hour % 24}:00</div>
                        ))
                    }
                </div>
                <div className="mt-3">
                    <div className='flex flex-row'>
                        {
                            dayViewList.map((dayView, i) => (
                                <div key={dayView.dayLabel} className="-mr-0.5">
                                    <div className='sticky top-0 w-full z-10 bg-white'>
                                        <div
                                            className={clsx('w-full z-10 py-2 bg-gray-300', i == 0 && `rounded-tl-md`, i == dayViewList.length - 1 && `rounded-tr-md`)}>
                                            <div className="mx-auto text-center">
                                                {dayView.dayLabel}
                                            </div>
                                        </div>
                                    </div>
                                    <ViewInner activityList={dayView.activityList} startDay={dayView.startDay}/>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}