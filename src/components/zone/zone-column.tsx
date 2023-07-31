import { api } from '~/utils/api';
import React, { type ReactNode, useCallback, useState } from 'react';
import clsx from 'clsx';
import { Menu, MenuBody, MenuHandler } from '~/components/generic/menu';
import { Button, IconButton } from '@material-tailwind/react';

import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { type ZoneInfo } from '~/components/zone/models';

function AddZoneModal({
	onSubmit,
	updating,
}: {
	onSubmit?: (zoneInfo: ZoneInfo) => Promise<boolean>;
	updating?: boolean;
}) {
	const [zoneSetting, setZoneSetting] = useState<ZoneInfo>({
		id: '-1',
		name: '',
		color: '#3cd531',
		regions: [],
	});

	const [error, setError] = useState(false);

	return (
		<div
			className={clsx(
				'flex w-96 flex-col justify-start space-y-2',
				updating && ''
			)}
		>
			<input
				type="text"
				value={zoneSetting.name}
				className={clsx(
					'mr-2 border-b-2 p-2 text-xl text-gray-700 transition-colors focus:outline-none',
					!error
						? 'border-gray-300 focus:border-blue-500'
						: 'border-red-200 placeholder-red-500 focus:border-red-500'
				)}
				placeholder="Zone Name"
				onChange={(e) => {
					setError(false);
					setZoneSetting({ ...zoneSetting, name: e.target.value });
				}}
				disabled={updating}
			/>
			<input
				className="w-full"
				type="color"
				value={zoneSetting.color}
				onChange={(e) =>
					setZoneSetting({ ...zoneSetting, color: e.target.value })
				}
			/>
			<Button
				onClick={() => {
					if (zoneSetting.name.trim() === '') {
						setError(true);
					} else if (onSubmit) {
						void onSubmit(zoneSetting).then((success) => {
							if (!success) {
								setError(true);
							}
						});
					}
				}}
				disabled={updating}
			>
				Create
			</Button>
		</div>
	);
}

function Pill({
	children,
	className,
}: {
	children: ReactNode;
	className: string;
}) {
	return (
		<div
			className={clsx(
				'text-zinc-700 flex h-8 flex-row items-center justify-between rounded-lg px-2 text-[12px] font-bold',
				className
			)}
		>
			<span className="justify-self-center">{children}</span>
		</div>
	);
}

export function ZoneOverview({
	zone,
	openSetting,
}: {
	zone: ZoneInfo;
	openSetting?: () => void;
}) {
	const queryClient = api.useContext();

	const [updating, isUpdating] = useState(false);
	const { mutate: mutateZones } = api.zones.updateZones.useMutation();

	const submitFunction = useCallback(
		(zone: ZoneInfo) => {
			isUpdating(true);
			mutateZones(zone, {
				onSuccess: () => {
					void queryClient.zones.getZones.invalidate().then(() => {
						isUpdating(false);
					});
				},
			});
		},
		[mutateZones, queryClient.zones.getZones]
	);

	return (
		<div className="relative h-24 w-full select-none rounded-lg bg-gray-200">
			<div className="flex flex-row items-center">
				<div className="flex w-full flex-col space-y-2 p-2 pl-5">
					<div className="flex space-x-3">
						<span className="max-w-[calc(100%-100px)] overflow-x-hidden overflow-ellipsis whitespace-nowrap text-xl font-bold text-gray-900">
							{zone.name}
						</span>
					</div>
					<div className="flex space-x-2">
						<Pill className="bg-gray-400">17:00 - 18:00</Pill>
					</div>
				</div>
				<div className="absolute right-2 top-2">
					<IconButton
						className="h-8 w-8 rounded bg-gray-600 hover:bg-gray-500"
						onClick={openSetting}
					>
						<AdjustmentsHorizontalIcon className="h-8 w-6" />
					</IconButton>
				</div>
			</div>
		</div>
	);
}

export function ZoneColumn({
	zones,
	onSelect,
}: {
	zones?: ZoneInfo[];
	onSelect?: (index: number) => void;
}) {
	const queryClient = api.useContext();
	const { mutateAsync: createZones } = api.zones.createZones.useMutation();
	const [isOpen, setIsOpen] = useState(false);
	const [updating, setUpdating] = useState(false);

	return (
		<div className="flex h-full w-36 min-w-[20em] flex-col rounded-tl-md rounded-tr-md border-2 border-blue-800">
			<div className="flex w-full select-none flex-row items-center justify-center bg-blue-800 p-2">
				<span className="font-bold text-white">Zones</span>
			</div>
			<div className="flex w-full flex-grow flex-col space-y-2 overflow-y-scroll p-2">
				{zones
					? zones.map((zone, index) => (
							<ZoneOverview
								key={zone.id}
								zone={zone}
								openSetting={() => {
									if (onSelect) {
										onSelect(index);
									}
								}}
							/>
					  ))
					: null}
			</div>

			<Menu open={isOpen} handler={setIsOpen}>
				<MenuHandler>
					<div
						className={clsx(
							'flex w-full cursor-pointer select-none flex-row bg-blue-800 p-2 text-white hover:contrast-200'
						)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							className="mt-0.5 h-5 w-5"
						>
							<path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
						</svg>
						<span className="font-bold">Add Item</span>
					</div>
				</MenuHandler>
				<MenuBody>
					<AddZoneModal
						onSubmit={async (zoneInfo) => {
							setUpdating(true);
							try {
								await createZones(zoneInfo);

								void queryClient.zones.getZones
									.invalidate()
									.then(() => {
										setUpdating(false);
										setIsOpen(false);
									})
									.catch(() => {
										setUpdating(false);
										return false;
									});
								return true;
							} catch (e) {
								setUpdating(false);
								return false;
							}
						}}
						updating={updating}
					/>
				</MenuBody>
			</Menu>
		</div>
	);
}
