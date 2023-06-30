import type {Meta, StoryObj} from '@storybook/react';
import {ActivitySetting, ActivityType, TimeConfig} from "~/components/task/activity-settings";

const meta: Meta<typeof ActivitySetting> = {
    title: 'Activity Settings',
    component: ActivitySetting,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ActivitySetting>;

export const Default: Story = {
    args: {
        activityType: ActivityType.Task,
        activitySetting: {
            id: "1",
            name: "Activity Name",
            at: new Date(),
            estimatedRequiredTime: {
                value: 1,
                unit: "hour"
            },

            reminderMod: {
                value: 1,
                unit: "hour"
            },
            startMod: {
                value: 1,
                unit: "hour"
            }
        }
    }
};
