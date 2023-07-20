import type { Meta, StoryObj } from '@storybook/react';
import {TimelineView} from './timeline-view';
import { ScheduledEvent } from '~/utils/types';
const meta: Meta<typeof TimelineView> = {
    title: 'Day View',
    component: TimelineView,
    tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof TimelineView>;

const activityOne: ScheduledEvent ={
    id: "1",
    name: "Task One",
    at: new Date(2023, 7, 9, 12, 0, 0),
    length: 2 * 60 * 1000
}

const activityTwo: ScheduledEvent ={
    id: "1",
    name: "Task two",
    at: new Date(2023, 7, 9, 9, 0, 0),
    length: 1 * 60 * 1000
}

const render = (args: any) => <div className="h-96">
    <TimelineView {...args}/>
</div>

export const NoDayTasks: Story = {
    args: {
        dayViewList: [
            {
                dayLabel: "2023-08-09",
                activityList: []
            }
        ]
    },
    render
};

export const OneDayTask: Story ={
    args: {
        dayViewList: [
            {
                dayLabel: "2023-08-09",
                activityList: [ activityOne ]
            }
        ]
    },
    render
}

export const TwoDayTask: Story ={
    args: {
        dayViewList: [
            {
                dayLabel: "2023-08-09",
                activityList: [
                    activityOne,
                    activityTwo
                ]
            }
        ]
    },
    render
}

export const NoWeekTasks: Story = {
    args: {
        dayViewList: [
            {
                dayLabel: "Sunday",
                activityList: [
                ]
            },
            {
                dayLabel: "Monday",
                activityList: [
                ]
            },
            {
                dayLabel: "Tuesday",
                activityList: [
                ]
            },
            {
                dayLabel: "Wednesday",
                activityList: [
                ]
            },
            {
                dayLabel: "Thursday",
                activityList: [
                ]
            },
            {
                dayLabel: "Friday",
                activityList: [
                ]
            },
            {
                dayLabel: "Saturday",
                activityList: [
                ]
            }
        ]
    },
    render
};

export const OneWeekTask: Story ={
    args: {
        dayViewList: [
            {
                dayLabel: "Sunday",
                activityList: [
                ]
            },
            {
                dayLabel: "Monday",
                activityList: [
                    activityOne
                ]
            },
            {
                dayLabel: "Tuesday",
                activityList: [
                ]
            },
            {
                dayLabel: "Wednesday",
                activityList: [
                ]
            },
            {
                dayLabel: "Thursday",
                activityList: [
                ]
            },
            {
                dayLabel: "Friday",
                activityList: [
                ]
            },
            {
                dayLabel: "Saturday",
                activityList: [
                ]
            }
        ]
    },
    render
}

export const TwoWeekTask: Story ={
    args: {
        dayViewList: [
            {
                dayLabel: "Sunday",
                activityList: [
                ]
            },
            {
                dayLabel: "Monday",
                activityList: [
                    activityOne
                ]
            },
            {
                dayLabel: "Tuesday",
                activityList: [
                ]
            },
            {
                dayLabel: "Wednesday",
                activityList: [
                    activityTwo
                ]
            },
            {
                dayLabel: "Thursday",
                activityList: [
                ]
            },
            {
                dayLabel: "Friday",
                activityList: [
                ]
            },
            {
                dayLabel: "Saturday",
                activityList: [
                ]
            }
        ]
    },
    render
}

