import type {Meta, StoryObj} from '@storybook/react';
import {
    ActivitySetting,
    ActivityType,
    TimeConfig,
    TimeConfigInput,
    TimeConfigUnit
} from "~/components/task/activity-settings";
import {useState} from "react";

const meta: Meta<typeof ActivitySetting> = {
    title: 'Activity Settings',
    component: ActivitySetting,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ActivitySetting>;

function ActivitySettingWrapper() {
    const [activityType, setActivityType] = useState<ActivityType>("task");

    const [name, setName] = useState("Activity");
    const [at, setAt] = useState(new Date());
    const [estimatedRequiredTime, setEstimatedRequiredTime] = useState<TimeConfig>({value: 1, unit: "hour"});
    const [reminderMod, setReminderMod] = useState<TimeConfig>({value: 1, unit: "hour"});
    const [startMod, setStartMod] = useState<TimeConfig>({value: 1, unit: "hour"});



    return (
        <ActivitySetting activityType={activityType} activitySetting={{
            id: "1",
            name,
            at,
            estimatedRequiredTime,
            reminderMod,
            startMod
        }}/>
    )
}

export const Default: Story = {
    render: () => <ActivitySettingWrapper/>
};
