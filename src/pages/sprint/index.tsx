import Head from 'next/head';
import { WeekView } from '~/components/timeline/timeline-view';
import { useEffect, useState } from 'react';
import { Button } from '@material-tailwind/react';
import { api } from '~/utils/api';
import { type ScheduledBlock } from '~/components/timeline/models';

export function getWeekStart(date: Date) {
	const today = date;
	today.setHours(0, 0, 0, 0);
	today.setDate(today.getDate() - today.getDay() + 1);
	return today;
}

export interface GeneratedEvent {
	id: string;
	activityId: string;
	name: string;
	date: Date;
	hours: number;
}

export default function Home() {
	const [activityList, setActivityList] = useState<ScheduledBlock[]>([]);
	const [firstDayMidnight] = useState<Date>(getWeekStart(new Date()));

	const { data } = api.generatedEvents.getGeneratedEvents.useQuery();

	useEffect(() => {
		if (data) {
			setActivityList(data);
		}
	}, [data]);

	return (
		<>
			<Head>
				<title>Calendar</title>
				<meta name="description" content="Sprint" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="flex max-h-screen flex-col">
				<div className="flex flex-col">
					<Button
						color="blue"
						onClick={() => {
							setActivityList([
								...activityList,
								{
									id: Math.random().toString(36).substring(7),
									name: 'Test',
									date: new Date('7/19/2023'),
									hours: 60,
								},
							]);
						}}
					>
						Generate Greedy
					</Button>
				</div>
				<WeekView
					className="mt-2 h-full min-h-0 w-full"
					blockList={activityList}
					firstDayMidnight={firstDayMidnight}
				/>
			</main>
		</>
	);
}
