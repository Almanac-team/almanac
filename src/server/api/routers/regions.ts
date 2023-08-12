import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

const regionsRouter = createTRPCRouter({
    updateRegions: protectedProcedure
        .input(
            z.object({
                zoneId: z.string(),
                regions: z.array(
                    z.object({
                        id: z.string(),
                        from: z.number(),
                        to: z.number(),
                    })
                ),
            })
        )
        .mutation(({ ctx, input }) => {
            const userId = ctx.session.user.id;
            input.regions.map(async (region) => {
                return await ctx.prisma.region.update({
                    where: {
                        id: region.id,
                        zone: {
                            userId: userId,
                        },
                    },
                    data: {
                        from: region.from,
                        to: region.to,
                    },
                });
            });
        }),
    createRegions: protectedProcedure
        .input(
            z.object({
                zoneId: z.string(),
                regions: z.array(
                    z.object({
                        from: z.number(),
                        to: z.number(),
                    })
                ),
            })
        )
        .mutation(({ ctx, input }) => {
            const userId: string = ctx.session.user.id;
            return ctx.prisma.zone.update({
                where: {
                    id: input.zoneId,
                    userId: userId,
                },
                data: {
                    regions: {
                        createMany: {
                            data: input.regions.map((region) => {
                                return {
                                    from: region.from,
                                    to: region.to,
                                };
                            }),
                        },
                    },
                },
            });
        }),
    deleteRegions: protectedProcedure
        .input(
            z.object({
                regionIds: z.array(z.string()),
            })
        )
        .mutation(({ ctx, input }) => {
            const userId: string = ctx.session.user.id;
            return ctx.prisma.region.deleteMany({
                where: {
                    id: {
                        in: input.regionIds,
                    },
                    zone: {
                        userId: userId,
                    },
                },
            });
        }),
});

export default regionsRouter
