import {DragDropContext, Draggable, Droppable} from '@hello-pangea/dnd';
import {ActivitySetting} from "~/components/activity/activity-settings";
import clsx from "clsx";
import {ActivityOverview} from "~/components/activity/activity-overview";

export interface CategoryInfo {
    categoryName: string;
    backgroundColor: string;
    textColor: string;
}

export function ActivityColumn({categoryInfo, activities}: {
    categoryInfo: CategoryInfo,
    activities: ActivitySetting[]
}) {
    return (
        <div className="flex flex-col w-[520px]">
            <div
                className="flex flex-row items-center bg-amber-300 p-2 w-full justify-center" style={{backgroundColor: categoryInfo.backgroundColor}}>
                <span className={clsx("font-bold", categoryInfo.textColor)}>{categoryInfo.categoryName}</span>
            </div>
            <div className="flex flex-col w-full overflow-y-scroll space-y-2 py-2">
                {activities.map((activity, index) => (
                    <ActivityOverview key={activity.id} taskName={activity.name} activitySetting={activity} categoryInfo={categoryInfo} />
                ))}
            </div>
        </div>


    )

}