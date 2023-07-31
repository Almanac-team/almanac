import type { Meta, StoryObj } from '@storybook/react';
import { EventSettingConfig } from '~/components/activity/activity-settings';
import { useState } from 'react';
import { type EventSetting } from '~/components/activity/models';

const meta: Meta<typeof EventSettingConfig> = {
    title: 'Event Settings',
    component: EventSettingConfig,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EventSettingConfig>;

function TaskSettingWrapper() {
    const [setting, setSetting] = useState<EventSetting>({
        at: (() => {
            const date = new Date();
            date.setHours(23, 59, 0, 0);
            return date;
        })(),
        estimatedRequiredTime: 1,
        reminderMod: { value: 0, unit: 'minute' },
        startMod: { value: 0, unit: 'minute' },
    });

    return <EventSettingConfig setting={setting} onChange={setSetting} />;
}

export const Default: Story = {
    render: () => <TaskSettingWrapper />,
};
