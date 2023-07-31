import {
	HourMinuteInput,
	LocalDateInput,
	LocalTimeInput,
	TimeConfigInput,
} from '~/components/time_picker/date';
import clsx from 'clsx';
import React, { useState } from 'react';
import { Button } from '@material-tailwind/react';
import {
	type ActivitySetting,
	type EventSetting,
	type TaskSetting,
} from '~/components/activity/models';

export function isTaskSetting(
	setting: TaskSetting | EventSetting | undefined
): setting is TaskSetting {
	return (setting as TaskSetting).deadlineMod !== undefined;
}

export function isEventSetting(
	setting: TaskSetting | EventSetting | undefined
): setting is EventSetting {
	return setting !== undefined && !isTaskSetting(setting);
}

export function isTask(
	activity: ActivitySetting<TaskSetting | EventSetting | undefined>
): activity is ActivitySetting<TaskSetting> {
	return isTaskSetting(activity.setting);
}

export function isEvent(
	activity: ActivitySetting<TaskSetting | EventSetting | undefined>
): activity is ActivitySetting<EventSetting> {
	return isEventSetting(activity.setting);
}

export function ActivityUpdateModal<T extends TaskSetting | EventSetting>({
	originalActivitySetting,
	onSubmit,
	updating,
}: {
	originalActivitySetting: ActivitySetting<T>;
	onSubmit?: (activitySetting: ActivitySetting<T>) => void;
	updating?: boolean;
}) {
	const [error, setError] = useState(false);

	const [activitySetting, setActivitySetting] = useState<ActivitySetting<T>>(
		originalActivitySetting
	);
	let inner;

	if (isTaskSetting(activitySetting.setting)) {
		inner = (
			<TaskSettingConfig
				setting={activitySetting.setting}
				onChange={(setting) =>
					setActivitySetting({
						...activitySetting,
						setting: setting as T,
					})
				}
				disabled={updating}
			/>
		);
	} else {
		inner = (
			<EventSettingConfig
				setting={activitySetting.setting}
				onChange={(setting) =>
					setActivitySetting({
						...activitySetting,
						setting: setting as T,
					})
				}
				disabled={updating}
			/>
		);
	}

	return (
		<div
			className={clsx(
				'flex w-96 flex-col justify-start space-y-2',
				updating && ''
			)}
		>
			<input
				type="text"
				value={activitySetting.name}
				className={clsx(
					'mr-2 border-b-2 p-2 text-xl text-gray-700 transition-colors focus:outline-none',
					!error
						? 'border-gray-300 focus:border-blue-500'
						: 'border-red-200 placeholder-red-500 focus:border-red-500'
				)}
				placeholder="Activity Name"
				onChange={(e) => {
					setError(false);
					setActivitySetting({
						...activitySetting,
						name: e.target.value,
					});
				}}
				disabled={updating}
			/>
			{inner}
			<Button
				onClick={() => {
					if (activitySetting.name.trim() === '') {
						setError(true);
					} else if (onSubmit) {
						onSubmit(activitySetting);
					}
				}}
				disabled={updating}
			>
				Update
			</Button>
		</div>
	);
}

export function TaskSettingConfig(props: {
	setting: TaskSetting;
	onChange?: (taskSetting: TaskSetting) => void;
	disabled?: boolean;
}) {
	return (
		<div className="flex select-none flex-col space-y-2">
			<div className="flex items-center space-x-2 whitespace-nowrap">
				<span>Due Date</span>
				<LocalDateInput
					value={props.setting.at}
					onChange={(newDate: Date) =>
						props.onChange &&
						props.onChange({
							...props.setting,
							at: newDate,
						})
					}
					disabled={props.disabled}
				/>

				<LocalTimeInput
					value={props.setting.at}
					onChange={(newDate: Date) =>
						props.onChange &&
						props.onChange({
							...props.setting,
							at: newDate,
						})
					}
					disabled={props.disabled}
				/>
			</div>

			<div className="flex items-center space-x-2 whitespace-nowrap">
				<span>Estimated Time Required</span>
				<HourMinuteInput
					minutes={props.setting.estimatedRequiredTime}
					onChange={(value) => {
						props.onChange &&
							props.onChange({
								...props.setting,
								estimatedRequiredTime: Math.max(value, 0),
							});
					}}
					disabled={props.disabled}
				/>
				<span>Hours</span>
			</div>
			<div className="flex items-center space-x-2 whitespace-nowrap">
				<span>Try and finish</span>
				<TimeConfigInput
					timeConfig={props.setting.deadlineMod}
					onChange={(value, unit) => {
						props.onChange &&
							props.onChange({
								...props.setting,
								deadlineMod: {
									value: Math.max(
										value ??
											props.setting.deadlineMod.value,
										0
									),
									unit:
										unit ?? props.setting.deadlineMod.unit,
								},
							});
					}}
					disabled={props.disabled}
				/>
				<span>before</span>
			</div>
			<div className="flex items-center space-x-2 whitespace-nowrap">
				<span>Remind me</span>
				<TimeConfigInput
					timeConfig={props.setting.reminderMod}
					onChange={(value, unit) => {
						props.onChange &&
							props.onChange({
								...props.setting,
								reminderMod: {
									value: Math.max(
										value ??
											props.setting.reminderMod.value,
										0
									),
									unit:
										unit ?? props.setting.reminderMod.unit,
								},
							});
					}}
					disabled={props.disabled}
				/>
				<span>before</span>
			</div>
			<div className="flex items-center space-x-2 whitespace-nowrap">
				<span>Ignore until</span>
				<TimeConfigInput
					timeConfig={props.setting.startMod}
					onChange={(value, unit) => {
						props.onChange &&
							props.onChange({
								...props.setting,
								startMod: {
									value: Math.max(
										value ?? props.setting.startMod.value,
										0
									),
									unit: unit ?? props.setting.startMod.unit,
								},
							});
					}}
					disabled={props.disabled}
				/>
				<span>before</span>
			</div>
		</div>
	);
}

export function EventSettingConfig(props: {
	setting: EventSetting;
	onChange?: (eventSetting: EventSetting) => void;
	disabled?: boolean;
}) {
	const localTime = new Date(props.setting.at);
	localTime.setHours(
		localTime.getHours() - new Date().getTimezoneOffset() / 60
	);

	return (
		<div className="flex select-none flex-col space-y-2">
			<div className="flex items-center space-x-2 whitespace-nowrap">
				<span>At</span>
				<LocalDateInput
					value={props.setting.at}
					onChange={(newDate: Date) =>
						props.onChange &&
						props.onChange({
							...props.setting,
							at: newDate,
						})
					}
					disabled={props.disabled}
				/>

				<LocalTimeInput
					value={props.setting.at}
					onChange={(newDate: Date) =>
						props.onChange &&
						props.onChange({
							...props.setting,
							at: newDate,
						})
					}
					disabled={props.disabled}
				/>
			</div>

			<div className="flex items-center space-x-2 whitespace-nowrap">
				<span>Estimated Time Required</span>
				<HourMinuteInput
					minutes={props.setting.estimatedRequiredTime}
					onChange={(value) => {
						props.onChange &&
							props.onChange({
								...props.setting,
								estimatedRequiredTime: Math.max(value, 0),
							});
					}}
					disabled={props.disabled}
				/>
				<span>Hours</span>
			</div>
			<div className="flex items-center space-x-2 whitespace-nowrap">
				<span>Remind me</span>
				<TimeConfigInput
					timeConfig={props.setting.reminderMod}
					onChange={(value, unit) => {
						props.onChange &&
							props.onChange({
								...props.setting,
								reminderMod: {
									value: Math.max(
										value ??
											props.setting.reminderMod.value,
										0
									),
									unit:
										unit ?? props.setting.reminderMod.unit,
								},
							});
					}}
					disabled={props.disabled}
				/>
				<span>before</span>
			</div>
			<div className="flex items-center space-x-2 whitespace-nowrap">
				<span>Ignore until</span>
				<TimeConfigInput
					timeConfig={props.setting.startMod}
					onChange={(value, unit) => {
						props.onChange &&
							props.onChange({
								...props.setting,
								startMod: {
									value: Math.max(
										value ?? props.setting.startMod.value,
										0
									),
									unit: unit ?? props.setting.startMod.unit,
								},
							});
					}}
					disabled={props.disabled}
				/>
				<span>before</span>
			</div>
		</div>
	);
}
