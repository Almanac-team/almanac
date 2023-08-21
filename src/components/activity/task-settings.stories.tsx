import type { Meta, StoryObj } from '@storybook/react';
import { TaskSettingConfig } from '~/components/activity/activity-settings';
import { useState } from 'react';
import { type TaskSetting } from '~/components/activity/models';

const meta: Meta<typeof TaskSettingConfig> = {
    title: 'Task Settings',
    component: TaskSettingConfig,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TaskSettingConfig>;

function TaskSettingWrapper() {
    const [setting, setSetting] = useState<TaskSetting>({
        estimatedRequiredTime: 1,
        deadlineMod: { value: 0, unit: 'minute' },
        reminderMod: { value: 0, unit: 'minute' },
        startMod: { value: 0, unit: 'minute' },
    });

    return <TaskSettingConfig setting={setting} onChange={setSetting} />;
}

export const Default: Story = {
    render: () => <TaskSettingWrapper />,
};
