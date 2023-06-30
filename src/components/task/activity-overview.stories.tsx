import type { Meta, StoryObj } from '@storybook/react';
import {ActivityOverview, CategoryInfo} from "~/components/task/activity-overview";

const meta: Meta<typeof ActivityOverview> = {
    title: 'Activity Overview',
    component: ActivityOverview,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ActivityOverview>;
const category1: CategoryInfo = {
    categoryName: 'Task!',
    backgroundColor: 'bg-amber-300',
    textColor: 'text-white',
}


export const OneTimeTaskFar: Story = {
    args: {
        remainingTime: 24 * 60 * 60 * 1000 * 15,
        taskName: 'Task Name',
        categoryInfo: category1,
    }
};
export const OneTimeTaskTwo: Story = {
    args: {
        remainingTime: 24 * 60 * 60 * 1000 * 10,
        taskName: 'Task Name',
        categoryInfo: category1,
    }
};

export const OneTimeTaskOne: Story = {
    args: {
        remainingTime: 24 * 60 * 60 * 1000 * 5,
        taskName: 'Task Name',
        categoryInfo: category1,
    }
};

export const OneTimeTaskWarning: Story = {
    args: {
        remainingTime: 24 * 60 * 60 * 1000,
        taskName: 'Task Name',
        categoryInfo: category1,
    }
};

export const OneTimeTaskToday: Story = {
    args: {
        remainingTime: 24 * 60 * 57 * 1000,
        taskName: 'Task Name',
        categoryInfo: category1,
    }
};

export const OneTimeTaskOver: Story = {
    args: {
        remainingTime: -24 * 60 * 57 * 1000,
        taskName: 'Task Name',
        categoryInfo: category1,
    }
};

export const OneTimeTaskVeryOver: Story = {
    args: {
        remainingTime: -24 * 60 * 60 * 1000,
        taskName: 'Task Name',
        categoryInfo: category1,
    }
};

export const TaskWithLongCategoryName: Story = {
    args: {
        remainingTime: -24 * 60 * 60 * 1000,
        taskName: 'Task Name',
        categoryInfo: {...category1, categoryName: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tincidunt tincidunt felis a pellentesque. Duis elementum nulla eget elementum efficitur. Sed eget suscipit ante. Maecenas malesuada non mi rhoncus venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut vulputate erat purus, ut iaculis lorem tincidunt et. Etiam vitae velit nec enim vulputate convallis ut eu sapien. Aliquam sodales lobortis orci, porttitor pellentesque nunc. Donec eu nunc ipsum. Aliquam erat volutpat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus porta enim commodo, congue orci at, congue nulla. '},
    }
};


export const TaskWithLongNameAndLongCategory: Story = {
    args: {
        remainingTime: -24 * 60 * 60 * 1000,
        taskName: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tincidunt tincidunt felis a pellentesque. Duis elementum nulla eget elementum efficitur. Sed eget suscipit ante. Maecenas malesuada non mi rhoncus venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut vulputate erat purus, ut iaculis lorem tincidunt et. Etiam vitae velit nec enim vulputate convallis ut eu sapien. Aliquam sodales lobortis orci, porttitor pellentesque nunc. Donec eu nunc ipsum. Aliquam erat volutpat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus porta enim commodo, congue orci at, congue nulla.',
        categoryInfo: {...category1, categoryName: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tincidunt tincidunt felis a pellentesque. Duis elementum nulla eget elementum efficitur. Sed eget suscipit ante. Maecenas malesuada non mi rhoncus venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut vulputate erat purus, ut iaculis lorem tincidunt et. Etiam vitae velit nec enim vulputate convallis ut eu sapien. Aliquam sodales lobortis orci, porttitor pellentesque nunc. Donec eu nunc ipsum. Aliquam erat volutpat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus porta enim commodo, congue orci at, congue nulla. '},
    }
};
