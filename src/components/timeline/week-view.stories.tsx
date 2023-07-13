import type { Meta, StoryObj } from '@storybook/react';
import {DayView, WeekView} from './timeline-view';
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
    length: 2 * 60 * 1000
}

const activityTwo: IActivity ={
    id: "1",
    name: "Task two",
    at: new Date(2023, 7, 13, 9, 0, 0),
    length: 1 * 60 * 1000
}

const render = (args: any) => <div className="h-96">
    <WeekView {...args}/>
</div>


export const NoWeekTasks: Story = {
    args: {
        activityList: []
    },
    render
};

export const OneWeekTask: Story ={
    args: {
        activityList: [
            activityOne
        ]
    },
    render
}

export const TwoWeekTask: Story ={
    args: {
        activityList: [
            activityOne,
            activityTwo
        ]
    },
    render
}

