import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const taskRouter = createTRPCRouter({
  getAll: publicProcedure.mutation() => {
    return {
      task: `Hello Task 1`,
    }}
  }),
