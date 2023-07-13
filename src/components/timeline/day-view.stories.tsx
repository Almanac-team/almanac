import type { Meta, StoryObj } from '@storybook/react';
import { DayView } from './timeline-view';
import { IActivity } from '~/utils/types';
const meta: Meta<typeof DayView> = {
    title: 'Day View',
    component: DayView,
    tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof DayView>;

const activityOne: IActivity ={
    id: "1",
    name: "Task One",
    at: new Date(2023, 7, 9, 12, 0, 0),
    length: 2
}

const activityTwo: IActivity ={
    id: "1",
    name: "Task two",
    at: new Date(2023, 7, 9, 9, 0, 0),
    length: 1
}

export const NoDayTasks: Story = {
    args: {
        activityList: []
    }
};

export const OneDayTask: Story ={
    args: {
        activityList: [
            activityOne
        ]
    }
}

export const TwoDayTask: Story ={
    args: {
        activityList: [
            activityOne,
            activityTwo
        ]
    }
}

