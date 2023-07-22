import type {Meta, StoryObj} from '@storybook/react';
import {TimelineView, WeekView} from './timeline-view';
import {ScheduledEvent} from '~/utils/types';
import {getWeekStart} from "~/pages/sprint";

const meta: Meta<typeof TimelineView> = {
    title: 'Day View',
    component: TimelineView,
    tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof TimelineView>;
type WeekStory = StoryObj<typeof WeekView>;

const startDay = getWeekStart(new Date());

const activityOne: ScheduledEvent = {
    id: "1",
    name: "Task One",
    date: new Date(2023, 7, 9, 12, 0, 0),
    hours: 2 * 60 * 1000
}

const activityTwo: ScheduledEvent = {
    id: "1",
    name: "Task two",
    date: new Date(2023, 7, 9, 9, 0, 0),
    hours: 1 * 60 * 1000
}

const render = (args: any) => <div className="h-96">
    <TimelineView {...args}/>
</div>

const renderWeek = (args: any) => <div className="h-96">
    <WeekView {...args}/>
</div>

export const NoDayTasks: Story = {
    args: {
        dayViewList: [
            {
                dayLabel: "2023-08-09",
                activityList: [],
                startDay
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
                startDay
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
                startDay
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
        activityList: [],
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

