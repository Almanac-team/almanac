import {z} from 'zod';
import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc"

import {ZoneInfo} from "~/components/zone/models";

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
    })
})

export default zonesRouter