import {IActivity} from "~/utils/types";

export function TimeLabels({children}: { children: React.ReactNode }) {
    return (
        <div className='flex flex-row'>
            <div>
                {
                    Array.from({length: 25}, (_, i) => i).map(hour => (
                        <div key={hour} className='w-20 h-10 text-center'> {hour % 24}:00</div>
                    ))
                }
            </div>
            <div className="mt-3">
                {children}
            </div>
        </div>
    );
}

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
        <div className="overflow-y-scroll pr-1 h-full">
            <div className="mt-4">
                <TimeLabels>
                    <div className='flex flex-row'>
                        {
                            dayViewList.map(dayView => (
                                <div key={dayView.dayLabel} className="relative -mr-0.5">
                                    <div className='absolute -top-8 w-full'>
                                        <div className="mx-auto text-center">
                                            {dayView.dayLabel}
                                        </div>
                                    </div>
                                    <ViewInner activityList={dayView.activityList}/>
                                </div>
                            ))
                        }
                    </div>
                </TimeLabels>
            </div>
        </div>
    );
}