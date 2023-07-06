import type {Meta, StoryObj} from '@storybook/react';
import {
    ActivitySettingModal,
    ActivityType,
    TimeConfig,
    TimeConfigInput,
    TimeConfigUnit
} from "~/components/activity/activity-settings";
import {useState} from "react";

const meta: Meta<typeof ActivitySettingModal> = {
    title: 'Activity Settings',
    component: ActivitySettingModal,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ActivitySettingModal>;

function ActivitySettingWrapper() {
    const [activityType, setActivityType] = useState<ActivityType>("task");

    const [name, setName] = useState("Activity");
    const [at, setAt] = useState(new Date());
    const [estimatedRequiredTime, setEstimatedRequiredTime] = useState<TimeConfig>({value: 1, unit: "hour"});
    const [deadlineMod, setDeadlineMod] = useState<TimeConfig>({value: 1, unit: "hour"});
    const [reminderMod, setReminderMod] = useState<TimeConfig>({value: 1, unit: "hour"});
    const [startMod, setStartMod] = useState<TimeConfig>({value: 1, unit: "hour"});



    return (
        <ActivitySettingModal activityType={activityType} activitySetting={{
            id: "1",
            name,
            at,
            estimatedRequiredTime,
            deadlineMod,
            reminderMod,
            startMod
        }}/>
    )
}

export const Default: Story = {
    render: () => <ActivitySettingWrapper/>
};
