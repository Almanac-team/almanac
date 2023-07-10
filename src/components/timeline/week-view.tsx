import type { IActivity } from "~/utils/types";
import cn from 'classnames'
import { DayView } from "./day-view";

export function WeekView(props : {activityList: IActivity[]} ) {
    const { activityList } = props;
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return (
        <div className='flex flex-row'>
            <div className='pt-16'>
                {
                    Array.from({length: 24}, (_, i) => i).map(hour => (
                    <div key={hour} className='w-[80px] h-[40px] text-center'> {hour}:00</div>
                    ))
                }
            </div>
            <div className='flex flex-row space-x-2'>
                {
                    Array.from({length: 7}, (_, i) => i).map(day => (
                    <div key={day}> 
                        <div className='mx-auto text-center'>
                            {days[day]}
                        </div>
                        <DayView activityList={activityList.filter((activity)=>{return activity.at.getDay() === day})}/>
                    </div>
                    ))
                }
            </div>

        </div>

    );
}