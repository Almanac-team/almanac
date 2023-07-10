import {useRef, useState} from "react";
import type { IActivity } from "~/utils/types";
import cn from 'classnames'

export function DayView(props : {activityList: IActivity[]} ) {
    const { activityList } = props;
    return (
        <div className="relative w-[240px] h-[1080px]">
            {
                Array.from({length: 24}, (_, i) => i + 1).map(hour => (
                <div key={hour} className={cn('w-[240px] h-[40px]',`bg-gray-${hour%2 ? 100:200}`)}></div>
                ))
            }
            {activityList.map(activity => (
                <div 
                    className='absolute bg-blue-400 text-white w-[200px] px-2 flex text-sm rounded-md' 
                    style={{height: activity.length*19, top: activity.at.getHours()*40+1}} 
                    key={activity.id}>
                    {activity.name}
                </div>
            ))}
        </div>
    );
}