import {z} from 'zod';
import {createTRPCRouter, publicProcedure, protectedProcedure} from "~/server/api/trpc"

const userSettingsRouter = createTRPCRouter({
    getUserSettings: protectedProcedure
        .query(({ctx}) => {
            const userId = ctx?.session?.user?.id
            return {userId}
        }),
    updateUserSettings: protectedProcedure
        .input(z.object({
            timezone: z.string(),
            timeFormat: z.string(), 
            dateFormat: z.string()
        }))
        .mutation(({ctx, input}) => {
            const userId = ctx?.session?.user.id
            const {timezone, timeFormat, dateFormat} = input
            console.dir(timezone)
            console.dir(timeFormat)
            console.dir(dateFormat)
            return {
                timezone,
                timeFormat,
                dateFormat
            }
        })
})

export default userSettingsRouter