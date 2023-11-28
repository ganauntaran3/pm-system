import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const taskRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        tasks: `Hello ${input.text}`,
      };
    }),
});
