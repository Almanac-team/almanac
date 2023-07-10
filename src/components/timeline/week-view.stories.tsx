import type { Meta, StoryObj } from '@storybook/react';
import { WeekView } from './week-view';
import { IActivity } from '~/utils/types';
const meta: Meta<typeof WeekView> = {
    title: 'Week View',
    component: WeekView,
    tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof WeekView>;

const activityOne: IActivity ={
    id: "1",
    name: "Task One",
    at: new Date(2023, 7, 9, 12, 0, 0),
    length: 2
}

const activityTwo: IActivity ={
    id: "1",
    name: "Task two",
    at: new Date(2023, 7, 13, 9, 0, 0),
    length: 1
}


export const NoWeekTasks: Story = {
    args: {
        activityList: []
    }
};

export const OneWeekTask: Story ={
    args: {
        activityList: [
            activityOne
        ]
    }
}

export const TwoWeekTask: Story ={
    args: {
        activityList: [
            activityOne,
            activityTwo
        ]
    }
}

