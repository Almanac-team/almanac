import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { type Region, type ZoneInfo } from '~/components/zone/models';
import { TimelineInteractionContext } from '~/components/timeline/models';
import { WeekView } from '~/components/timeline/timeline-view';
import { api } from '~/utils/api';

interface NotCreatedRegion {
	id: undefined;
	from: number;
	to: number;
}

type DisplayRegionUnion = Region | NotCreatedRegion;

export function ZoneView({
	zone,
	className,
}: {
	zone: ZoneInfo;
	className?: string;
}) {
	const [scheduledBlocks, setScheduledBlocks] = useState<
		DisplayRegionUnion[]
	>(zone.regions ?? []);
	const [changeList, setChangeList] = useState<string[]>([]);

	const queryClient = api.useContext();

	const { mutate: createRegions } = api.regions.createRegions.useMutation();
	const { mutate: updateRegions } = api.regions.updateRegions.useMutation();
	const { mutate: deleteRegions } = api.regions.deleteRegions.useMutation();

	const firstDayMidnight = new Date(0);

	const checkRedundancy = (scheduledBlocks: DisplayRegionUnion[]) => {
		const newScheduledBlocks = [];

		// this is horrible, but we'll replace the whole zone system soon
		for (const region of scheduledBlocks) {
			let shouldAdd = true;
			for (const existingRegion of newScheduledBlocks) {
				// if region overlaps existing region ends, extend the other region, and remove this one

				if (
					!(
						existingRegion.to < region.from - 0.01 ||
						region.to + 0.01 < existingRegion.from
					)
				) {
					existingRegion.to = Math.max(existingRegion.to, region.to);
					existingRegion.from = Math.min(
						existingRegion.from,
						region.from
					);
					shouldAdd = false;

					if (region.id !== undefined) {
						// if the region has an id, add it to the change list
						setChangeList((prev) => [...prev, region.id]);
					}

					if (!existingRegion.id) {
						// steal the id if it exists but does not for the existing region
						existingRegion.id = region.id;
					} else {
						// if the existingRegion had an id, add it to the change list
						setChangeList((prev) => [...prev, existingRegion.id]);
					}
					break;
				}
			}

			if (shouldAdd) {
				newScheduledBlocks.push(region);
			}
		}

		return newScheduledBlocks;
	};

	const onBackgroundClick = (index: number, percentY: number) => {
		const newHourPercent = Math.max(
			0,
			Math.floor(percentY * 48 - 0.5) / 48
		);

		setScheduledBlocks((prev) => {
			return checkRedundancy([
				...prev,
				{
					id: undefined,
					from: (index + newHourPercent) * 24,
					to:
						(index + newHourPercent) * 24 +
						Math.min(1, (1 - newHourPercent) * 24),
				},
			]);
		});
	};

	const updateFunctionRef = useRef((zone: ZoneInfo) => {
		return;
	});

	updateFunctionRef.current = useCallback(
		(zone: ZoneInfo) => {
			console.log('updating zone', zone.id, changeList);
			const createList: NotCreatedRegion[] = [];
			const updateList: Region[] = [];
			const deleteList: string[] = [];

			const scheduledBlocksMap = new Map<string, Region>();
			for (const region of scheduledBlocks) {
				if (region.id) {
					scheduledBlocksMap.set(region.id, region);
				} else {
					// this is fine as any region without an id is not created yet
					createList.push(region as NotCreatedRegion);
				}
			}

			for (const changedId of changeList) {
				const existingRegion = scheduledBlocksMap.get(changedId);
				if (existingRegion) {
					updateList.push(existingRegion);
				} else {
					deleteList.push(changedId);
				}
			}

			createRegions({ zoneId: zone?.id ?? '', regions: createList });
			updateRegions({ zoneId: zone?.id ?? '', regions: updateList });
			deleteRegions({ regionIds: deleteList });

			void queryClient.zones.invalidate();

			setChangeList([]);
		},
		[
			changeList,
			createRegions,
			deleteRegions,
			queryClient.zones,
			scheduledBlocks,
			updateRegions,
		]
	);

	useEffect(() => {
		// update zones on dismount
		setScheduledBlocks(zone.regions ?? []);

		return () => {
			updateFunctionRef.current(zone);
		};
	}, [zone]);

	if (!zone) {
		return <></>;
	}

	return (
		<div className={clsx('flex max-h-full flex-col py-2', className)}>
			<div className="flex flex-row items-center space-x-2">
				<div
					className="h-4 w-4 rounded-full"
					style={{ backgroundColor: zone.color }}
				/>
				<div className="text-xl font-bold">{zone.name}</div>
			</div>
			<TimelineInteractionContext.Provider value={{ onBackgroundClick }}>
				<WeekView
					className="h-full min-h-0 w-full border-b-2"
					blockList={scheduledBlocks.map((region) => ({
						id: region.id ?? '',
						name: '',
						date: new Date(region.from * 60 * 60 * 1000),
						hours: region.to - region.from,
						color: zone.color,
					}))}
					firstDayMidnight={firstDayMidnight}
				/>
			</TimelineInteractionContext.Provider>
		</div>
	);
}
