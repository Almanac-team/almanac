import type {Meta, StoryObj} from '@storybook/react';
import {TimelineView, WeekView} from './timeline-view';
import {ScheduledEvent} from '~/utils/types';
import {getWeekStart} from "~/pages/sprint";

const meta: Meta<typeof TimelineView> = {
    title: 'Timeline View',
    component: TimelineView,
    tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof TimelineView>;
type WeekStory = StoryObj<typeof WeekView>;

const startDay = getWeekStart(new Date(2023, 7, 9, 12, 0, 0));

const activityOne: ScheduledEvent = {
    id: "1",
    name: "Task One",
    date: new Date(2023, 7, 9, 12, 0, 0),
    hours: 2
}

const activityTwo: ScheduledEvent = {
    id: "1",
    name: "Task Two",
    date: new Date(2023, 7, 9, 9, 0, 0),
    hours: 1
}

const render = (args: any) => <TimelineView className="h-[500px]" {...args}/>
const renderWeek = (args: any) => <WeekView className="h-[500px]" {...args}/>

export const NoDayTasks: Story = {
    args: {
        dayViewList: [
            {
                dayLabel: "2023-08-09",
                activityList: [],
                startDay: new Date(2023, 7, 9, 0, 0, 0),
            }
        ]
    },
    render
};

export const OneDayTask: Story = {
    args: {
        dayViewList: [
            {
                dayLabel: "2023-08-09",
                activityList: [activityOne],
                startDay: new Date(2023, 7, 9, 0, 0, 0),
            }
        ]
    },
    render
}

export const TwoDayTask: Story = {
    args: {
        dayViewList: [
            {
                dayLabel: "2023-08-09",
                activityList: [
                    activityOne,
                    activityTwo
                ],
                startDay: new Date(2023, 7, 9, 0, 0, 0),
            }
        ]
    },
    render
}

export const NoWeekTasks: WeekStory = {
    args: {},
    render: renderWeek
};

export const OneWeekTask: WeekStory = {
    args: {
        activityList: [activityOne],
        firstDayMidnight: startDay,
    },
    render: renderWeek
}

export const TwoWeekTask: WeekStory = {
    args: {
        activityList: [activityOne, activityTwo],
        firstDayMidnight: startDay,
    },
    render: renderWeek
}



export const ComplexWeekTask: WeekStory = {
    args: {
        activityList: [activityOne, activityTwo,
            {
                id: "1",
                name: "Task three",
                date: new Date(2023, 7, 9, 22, 0, 0),
                hours: 10
            }],
        firstDayMidnight: startDay,
    },
    render: renderWeek
}

