import type { Meta, StoryObj } from '@storybook/react';
import { ActivityOverview } from '~/components/activity/activity-overview';

import { type CategoryInfo } from '~/components/activity/models';
import { CategoryContext } from '~/components/activity/activity-column';

const meta: Meta<typeof ActivityOverview> = {
    title: 'Activity Overview',
    component: ActivityOverview,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ActivityOverview>;
const category1: CategoryInfo = {
    id: '1',
    categoryName: 'Task!',
    backgroundColor: '#942626',
    textColor: 'text-white',
};

const render = (args: any) => (
    <div>
        <CategoryContext.Provider value={category1}>
            <ActivityOverview {...args} />;
        </CategoryContext.Provider>
    </div>
);

const customRender = (categoryInfo: CategoryInfo) => {
    const render = (args: any) => (
        <div>
            <CategoryContext.Provider value={categoryInfo}>
                <ActivityOverview {...args} />;
            </CategoryContext.Provider>
        </div>
    );
    return render;
};

export const OneTimeTaskFar: Story = {
    args: {
        activity: {
            id: '1',
            name: 'Task Name',
            activityType: 'task',
            setting: {
                at: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 15),
                estimatedRequiredTime: 60,
                deadlineMod: { value: 1, unit: 'hour' },
                reminderMod: { value: 1, unit: 'hour' },
                startMod: { value: 1, unit: 'hour' },
            },
        },
    },
    render,
};
export const OneTimeTaskTwo: Story = {
    args: {
        activity: {
            id: '1',
            name: 'Task Name',
            activityType: 'task',
            setting: {
                at: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 10),
                estimatedRequiredTime: 60,
                deadlineMod: { value: 1, unit: 'hour' },
                reminderMod: { value: 1, unit: 'hour' },
                startMod: { value: 1, unit: 'hour' },
            },
        },
    },
    render,
};

export const OneTimeTaskOne: Story = {
    args: {
        activity: {
            id: '1',
            name: 'Task Name',
            activityType: 'task',
            setting: {
                at: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 5),
                estimatedRequiredTime: 60,
                deadlineMod: { value: 1, unit: 'hour' },
                reminderMod: { value: 1, unit: 'hour' },
                startMod: { value: 1, unit: 'hour' },
            },
        },
    },
    render,
};

export const OneTimeTaskWarning: Story = {
    args: {
        activity: {
            id: '1',
            name: 'Task Name',
            activityType: 'task',
            setting: {
                at: new Date(new Date().getTime() + 25 * 60 * 60 * 1000),
                estimatedRequiredTime: 60,
                deadlineMod: { value: 1, unit: 'hour' },
                reminderMod: { value: 1, unit: 'hour' },
                startMod: { value: 1, unit: 'hour' },
            },
        },
    },
    render,
};

export const OneTimeTaskToday: Story = {
    args: {
        activity: {
            id: '1',
            name: 'Task Name',
            activityType: 'task',
            setting: {
                at: new Date(new Date().getTime() + 24 * 60 * 57 * 1000),
                estimatedRequiredTime: 60,
                deadlineMod: { value: 1, unit: 'hour' },
                reminderMod: { value: 1, unit: 'hour' },
                startMod: { value: 1, unit: 'hour' },
            },
        },
    },
    render,
};

export const OneTimeTaskOver: Story = {
    args: {
        activity: {
            id: '1',
            name: 'Task Name',
            activityType: 'task',
            setting: {
                at: new Date(new Date().getTime() + -24 * 60 * 57 * 1000),
                estimatedRequiredTime: 60,
                deadlineMod: { value: 1, unit: 'hour' },
                reminderMod: { value: 1, unit: 'hour' },
                startMod: { value: 1, unit: 'hour' },
            },
        },
    },
    render,
};

export const OneTimeTaskVeryOver: Story = {
    args: {
        activity: {
            id: '1',
            name: 'Task Name',
            activityType: 'task',
            setting: {
                at: new Date(new Date().getTime() + -24 * 60 * 60 * 1000),
                estimatedRequiredTime: 60,
                deadlineMod: { value: 1, unit: 'hour' },
                reminderMod: { value: 1, unit: 'hour' },
                startMod: { value: 1, unit: 'hour' },
            },
        },
    },
    render,
};

export const TaskWithLongCategoryName: Story = {
    args: {
        activity: {
            id: '1',
            name: 'Task Name',
            activityType: 'task',
            setting: {
                at: new Date(new Date().getTime() + -24 * 60 * 60 * 1000),
                estimatedRequiredTime: 60,
                deadlineMod: { value: 1, unit: 'hour' },
                reminderMod: { value: 1, unit: 'hour' },
                startMod: { value: 1, unit: 'hour' },
            },
        },
    },
    render: customRender({
        ...category1,
        categoryName:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tincidunt tincidunt felis a pellentesque. Duis elementum nulla eget elementum efficitur. Sed eget suscipit ante. Maecenas malesuada non mi rhoncus venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut vulputate erat purus, ut iaculis lorem tincidunt et. Etiam vitae velit nec enim vulputate convallis ut eu sapien. Aliquam sodales lobortis orci, porttitor pellentesque nunc. Donec eu nunc ipsum. Aliquam erat volutpat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus porta enim commodo, congue orci at, congue nulla. ',
    }),
};

export const TaskWithLongNameAndLongCategory: Story = {
    args: {
        activity: {
            id: '1',
            name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tincidunt tincidunt felis a pellentesque. Duis elementum nulla eget elementum efficitur. Sed eget suscipit ante. Maecenas malesuada non mi rhoncus venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut vulputate erat purus, ut iaculis lorem tincidunt et. Etiam vitae velit nec enim vulputate convallis ut eu sapien. Aliquam sodales lobortis orci, porttitor pellentesque nunc. Donec eu nunc ipsum. Aliquam erat volutpat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus porta enim commodo, congue orci at, congue nulla.',
            activityType: 'task',
            setting: {
                at: new Date(new Date().getTime() + -24 * 60 * 60 * 1000),
                estimatedRequiredTime: 60,
                deadlineMod: { value: 1, unit: 'hour' },
                reminderMod: { value: 1, unit: 'hour' },
                startMod: { value: 1, unit: 'hour' },
            },
        },
    },
    render: customRender({
        ...category1,
        categoryName:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tincidunt tincidunt felis a pellentesque. Duis elementum nulla eget elementum efficitur. Sed eget suscipit ante. Maecenas malesuada non mi rhoncus venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut vulputate erat purus, ut iaculis lorem tincidunt et. Etiam vitae velit nec enim vulputate convallis ut eu sapien. Aliquam sodales lobortis orci, porttitor pellentesque nunc. Donec eu nunc ipsum. Aliquam erat volutpat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus porta enim commodo, congue orci at, congue nulla. ',
    }),
};
