import {IActivity} from "~/utils/types";
import clsx from "clsx";

function ViewInner({activityList}: { activityList: IActivity[] }) {
    return (
        <div className="relative w-52 h-fit border-2 border-blue-gray-400">
            {
                Array.from({length: 24}, (_, i) => i + 1).map(hour => (
                    <div key={hour} className={`w-full h-10 bg-gray-${hour % 2 ? 200 : 100}`}></div>
                ))
            }
            {activityList.map(activity => (
                <div
                    className='absolute bg-blue-400 text-white w-full px-2 flex text-sm rounded-md'
                    style={{height: activity.length * 19 / 60 / 1000, top: activity.at.getHours() * 40 + 1}}
                    key={activity.id}>
                    {activity.name}
                </div>
            ))}
        </div>
    );
}

interface IDayViewProps {
    dayLabel: string,
    activityList: IActivity[]
}

export function TimelineView({dayViewList}: { dayViewList: IDayViewProps[] }) {
    return (
        <div className="overflow-y-scroll pr-1 h-full relative">
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
                                        <div className={clsx('w-full z-10 py-2 bg-gray-300', i == 0 && `rounded-tl-md`, i == dayViewList.length - 1 && `rounded-tr-md`)}>
                                            <div className="mx-auto text-center">
                                                {dayView.dayLabel}
                                            </div>
                                        </div>
                                    </div>
                                    <ViewInner activityList={dayView.activityList}/>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}