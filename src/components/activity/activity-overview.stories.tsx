import type { Meta, StoryObj } from '@storybook/react';
import {ActivityOverview} from "~/components/activity/activity-overview";

import {CategoryInfo} from "~/components/activity/models";

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
        taskName: 'Task Name',
        activitySetting: {
            id: "1",
            name: "Activity",
            at: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 15),
            estimatedRequiredTime: {value: 1, unit: "hour"},
            deadlineMod: {value: 1, unit: "hour"},
            reminderMod: {value: 1, unit: "hour"},
            startMod: {value: 1, unit: "hour"}
        },
        categoryInfo: category1,
    }
};
export const OneTimeTaskTwo: Story = {
    args: {
        taskName: 'Task Name',
        activitySetting: {
            id: "1",
            name: "Activity",
            at: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 10),
            estimatedRequiredTime: {value: 1, unit: "hour"},
            deadlineMod: {value: 1, unit: "hour"},
            reminderMod: {value: 1, unit: "hour"},
            startMod: {value: 1, unit: "hour"}
        },
        categoryInfo: category1,
    }
};

export const OneTimeTaskOne: Story = {
    args: {
        taskName: 'Task Name',
        activitySetting: {
            id: "1",
            name: "Activity",
            at: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 5),
            estimatedRequiredTime: {value: 1, unit: "hour"},
            deadlineMod: {value: 1, unit: "hour"},
            reminderMod: {value: 1, unit: "hour"},
            startMod: {value: 1, unit: "hour"}
        },
        categoryInfo: category1,
    }
};

export const OneTimeTaskWarning: Story = {
    args: {
        taskName: 'Task Name',
        activitySetting: {
            id: "1",
            name: "Activity",
            at: new Date(new Date().getTime() + 25 * 60 * 60 * 1000),
            estimatedRequiredTime: {value: 1, unit: "hour"},
            deadlineMod: {value: 1, unit: "hour"},
            reminderMod: {value: 1, unit: "hour"},
            startMod: {value: 1, unit: "hour"}
        },
        categoryInfo: category1,
    }
};

export const OneTimeTaskToday: Story = {
    args: {
        taskName: 'Task Name',
        activitySetting: {
            id: "1",
            name: "Activity",
            at: new Date(new Date().getTime() + 24 * 60 * 57 * 1000),
            estimatedRequiredTime: {value: 1, unit: "hour"},
            deadlineMod: {value: 1, unit: "hour"},
            reminderMod: {value: 1, unit: "hour"},
            startMod: {value: 1, unit: "hour"}
        },
        categoryInfo: category1,
    }
};

export const OneTimeTaskOver: Story = {
    args: {
        taskName: 'Task Name',
    activitySetting: {
            id: "1",
            name: "Activity",
            at: new Date(new Date().getTime() + -24 * 60 * 57 * 1000),
            estimatedRequiredTime: {value: 1, unit: "hour"},
            deadlineMod: {value: 1, unit: "hour"},
            reminderMod: {value: 1, unit: "hour"},
            startMod: {value: 1, unit: "hour"}
        },
        categoryInfo: category1,
    }
};

export const OneTimeTaskVeryOver: Story = {
    args: {
        taskName: 'Task Name',
    activitySetting: {
            id: "1",
            name: "Activity",
            at: new Date(new Date().getTime() + -24 * 60 * 60 * 1000),
            estimatedRequiredTime: {value: 1, unit: "hour"},
            deadlineMod: {value: 1, unit: "hour"},
            reminderMod: {value: 1, unit: "hour"},
            startMod: {value: 1, unit: "hour"}
        },
        categoryInfo: category1,
    }
};

export const TaskWithLongCategoryName: Story = {
    args: {
        taskName: 'Task Name',
    activitySetting: {
            id: "1",
            name: "Activity",
            at: new Date(new Date().getTime() + -24 * 60 * 60 * 1000),
            estimatedRequiredTime: {value: 1, unit: "hour"},
            deadlineMod: {value: 1, unit: "hour"},
            reminderMod: {value: 1, unit: "hour"},
            startMod: {value: 1, unit: "hour"}
        },
        categoryInfo: {...category1, categoryName: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tincidunt tincidunt felis a pellentesque. Duis elementum nulla eget elementum efficitur. Sed eget suscipit ante. Maecenas malesuada non mi rhoncus venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut vulputate erat purus, ut iaculis lorem tincidunt et. Etiam vitae velit nec enim vulputate convallis ut eu sapien. Aliquam sodales lobortis orci, porttitor pellentesque nunc. Donec eu nunc ipsum. Aliquam erat volutpat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus porta enim commodo, congue orci at, congue nulla. '},
    }
};


export const TaskWithLongNameAndLongCategory: Story = {
    args: {
        taskName: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tincidunt tincidunt felis a pellentesque. Duis elementum nulla eget elementum efficitur. Sed eget suscipit ante. Maecenas malesuada non mi rhoncus venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut vulputate erat purus, ut iaculis lorem tincidunt et. Etiam vitae velit nec enim vulputate convallis ut eu sapien. Aliquam sodales lobortis orci, porttitor pellentesque nunc. Donec eu nunc ipsum. Aliquam erat volutpat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus porta enim commodo, congue orci at, congue nulla.',
    activitySetting: {
            id: "1",
            name: "Activity",
            at: new Date(new Date().getTime() + -24 * 60 * 60 * 1000),
            estimatedRequiredTime: {value: 1, unit: "hour"},
            deadlineMod: {value: 1, unit: "hour"},
            reminderMod: {value: 1, unit: "hour"},
            startMod: {value: 1, unit: "hour"}
        },
        categoryInfo: {...category1, categoryName: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tincidunt tincidunt felis a pellentesque. Duis elementum nulla eget elementum efficitur. Sed eget suscipit ante. Maecenas malesuada non mi rhoncus venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut vulputate erat purus, ut iaculis lorem tincidunt et. Etiam vitae velit nec enim vulputate convallis ut eu sapien. Aliquam sodales lobortis orci, porttitor pellentesque nunc. Donec eu nunc ipsum. Aliquam erat volutpat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus porta enim commodo, congue orci at, congue nulla. '},
    }
};
