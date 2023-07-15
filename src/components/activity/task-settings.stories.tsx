import type {Meta, StoryObj} from '@storybook/react';
import {
    type TaskSetting,
    TaskSettingConfig
} from "~/components/activity/activity-settings";
import {useState} from "react";

const meta: Meta<typeof TaskSettingConfig> = {
    title: 'Activity Settings',
    component: TaskSettingConfig,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TaskSettingConfig>;

function TaskSettingWrapper() {

    const [setting, setSetting] = useState<TaskSetting>(
        {
            at: (() => {
                const date = new Date();
                date.setHours(23, 59, 0, 0);
                return date;
            })(),
            estimatedRequiredTime: {value: 1, unit: "hour"},
            deadlineMod: {value: 0, unit: "minute"},
            reminderMod: {value: 0, unit: "minute"},
            startMod: {value: 0, unit: "minute"},
        }
    );

    return (
        <TaskSettingConfig setting={setting} onChange={setSetting}/>
    )
}

export const Default: Story = {
    render: () => <TaskSettingWrapper/>
};
