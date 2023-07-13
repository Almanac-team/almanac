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
                    style={{height: activity.length * 19, top: activity.at.getHours() * 40 + 1}}
                    key={activity.id}>
                    {activity.name}
                </div>
            ))}
        </div>
    )

}

export function DayView({activityList}: { activityList: IActivity[] }) {
    return (
        <div className="overflow-y-scroll h-full">
            <TimeLabels>
                <ViewInner activityList={activityList}/>
            </TimeLabels>
        </div>
    )
}

export function WeekView(props: { activityList: IActivity[] }) {
    const {activityList} = props;
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return (
        <div className="overflow-y-scroll h-full">
            <div className="mt-4">
                <TimeLabels>
                    <div className='flex flex-row'>
                        {
                            Array.from({length: 7}, (_, i) => i).map(day => (
                                <div key={day} className="relative -mr-0.5">
                                    <div className='absolute -top-8 w-full'>
                                        <div className="mx-auto text-center">
                                            {days[day]}
                                        </div>
                                    </div>
                                    <ViewInner activityList={activityList.filter((activity) => {
                                        return activity.at.getDay() === day
                                    })}/>
                                </div>
                            ))
                        }
                    </div>
                </TimeLabels>
            </div>
        </div>

    );
}