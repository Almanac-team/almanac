import {z} from 'zod';
import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc"

import {Region, ZoneInfo} from "~/components/zone/models";

const zonesRouter = createTRPCRouter({
    getZones: protectedProcedure.query(async ({ctx}): Promise<ZoneInfo[]> => {
        const userId = ctx.session.user.id
        return (await ctx.prisma.zone.findMany({
            where: {
                userId: userId
            },
            include: {
                regions: true
            }
        })).map((zone): ZoneInfo => {
            return {
                id: zone.id,
                name: zone.name,
                color: zone.color,
                regions: zone.regions.map((region) => {
                    return {
                        id: region.id,
                        from: region.from,
                        to: region.to
                    }
                })
            }
        })
    }),

    createZones: protectedProcedure.input(z.object({
            name: z.string(),
            color: z.string()
        })
    ).mutation(async ({ctx, input}): Promise<ZoneInfo> => {
        const userId = ctx.session.user.id
        const zone = await ctx.prisma.zone.create({
            data: {
                name: input.name,
                color: input.color,
                userId: userId
            }
        })
        return {
            id: zone.id,
            name: zone.name,
            color: zone.color,
            regions: []
        }
    }),

    updateZones: protectedProcedure.input(z.object({
            id: z.string(),
            name: z.string(),
            color: z.string()
        })
    ).mutation(async ({ctx, input}): Promise<ZoneInfo> => {
        const userId = ctx.session.user.id
        const zone = await ctx.prisma.zone.update({
            where: {
                id: input.id
            },
            data: {
                name: input.name,
                color: input.color,
                userId: userId
            }
        })
        return {
            id: zone.id,
            name: zone.name,
            color: zone.color,
            regions: []
        }
    }),
    getZonesByActivityId: protectedProcedure.input(z.object({
            activityId: z.string()
        })
    ).query(async ({ctx, input}): Promise<ZoneInfo[] | undefined> => {
        const userId = ctx.session.user.id
        const activity = (await ctx.prisma.activity.findUnique({
            where: {
                id: input.activityId,
                category: {
                    userId: userId
                }
            },
            include: {
                ActivityZonePair: {
                    include: {
                        zone: {
                            include: {
                                regions: true
                            }
                        }
                    }

                }
            }
        }))

        return activity?.ActivityZonePair.map((pair) => {
            return {
                id: pair.zone.id,
                name: pair.zone.name,
                color: pair.zone.color,
                regions: pair.zone.regions.map((region): Region => {
                    return {
                        id: region.id,
                        from: region.from,
                        to: region.to
                    }
                })
            }
        })
    })
})

export default zonesRouter