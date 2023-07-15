import {z} from 'zod';
import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc"

const definitionsRouter = createTRPCRouter({
    createCategory: protectedProcedure.input(z.object({
        name: z.string(),
        color: z.string(),
    })).mutation(({ctx, input}) => {
        const userId = ctx?.session?.user.id
        const {name, color} = input

        ctx.prisma.category.create({
            data: {
                name,
                color,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        }).then((category) => {
            return {
                id: category.id,
                name,
                color
            }
        }).catch((error) => {
            console.log(error)
            return {
                id: -1,
                name: "",
                color: ""
            }
        });
    }),

    updateCategory: protectedProcedure.input(z.object({
        id: z.string(),
        name: z.string(),
        color: z.string(),
    })).mutation(({ctx, input}) => {
        const userId = ctx?.session?.user.id
        const {id, name, color} = input

        ctx.prisma.category.update({
            where: {
                id: id,
                userId: userId
            },
            data: {
                name,
                color
            }
        }).then((category) => {
            return {
                id: category.id,
                name,
                color
            }
        }).catch((error) => {
            console.log(error)
            return {
                id: -1,
                name: "",
                color: ""
            }
        });
    }),

    getCategories: protectedProcedure.query(({ctx}) => {
        const userId = ctx?.session?.user?.id
        return ctx.prisma.category.findMany({
            where: {
                userId: userId
            }
        })
    }),

    deleteCategory: protectedProcedure.input(z.object({
        id: z.string()
    })).mutation(({ctx, input}) => {
        const userId = ctx?.session?.user.id
        const {id} = input

        ctx.prisma.category.delete({
            where: {
                id: id,
                userId: userId
            }
        }).then((category) => {
            return {
                id: category.id,
                name: category.name,
                color: category.color
            }
        }).catch((error) => {
            console.log(error)
            return {
                id: -1,
                name: "",
                color: ""
            }
        });
    }),
})

export default definitionsRouter