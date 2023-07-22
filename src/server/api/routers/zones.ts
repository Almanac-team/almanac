import {z} from 'zod';
import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc"
import {type ZoneInfo} from "~/components/zone/zone-column";

const zonesRouter = createTRPCRouter({
    getZones: protectedProcedure.query(async ({ctx}): Promise<ZoneInfo[]> => {
        const userId = ctx.session.user.id
        return (await ctx.prisma.zoneInfo.findMany({
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

    createZone: protectedProcedure.input(z.object({
            name: z.string()
        })
    ).mutation(async ({ctx, input}): Promise<ZoneInfo> => {
            const userId = ctx.session.user.id
            const zone = await ctx.prisma.zoneInfo.create({
                data: {
                    name: input.name,
                    userId: userId
                }
            })
            return {
                id: zone.id,
                name: zone.name,
                regions: []
            }
        }
    )
})

export default zonesRouter