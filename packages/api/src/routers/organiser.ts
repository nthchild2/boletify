/** Organiser profile router (ORG-001). */

import { TRPCError } from "@trpc/server";
import { ZodError, z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  ProfileError,
  getProfileForUser,
  updateProfileForUser,
} from "../lib/organiser-profile";

export const organiserRouter = createTRPCRouter({
  profile: protectedProcedure.query(async ({ ctx }) => {
    const profile = await getProfileForUser(ctx.userId);
    if (!profile)
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "No tienes un perfil de organizador",
      });
    return profile;
  }),

  // Loose input here; profileInputSchema runs inside so its first Spanish message
  // reaches the form instead of tRPC's raw list of Zod issues.
  updateProfile: protectedProcedure
    .input(
      z.object({
        organiserName: z.string().max(500),
        bio: z.string().max(5000).nullable(),
        logoUrl: z.string().max(2000).nullable(),
        slug: z.string().max(200),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await updateProfileForUser(ctx.userId, input);
      } catch (err) {
        if (err instanceof ProfileError)
          throw new TRPCError({ code: err.code, message: err.message });
        if (err instanceof ZodError)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: err.issues[0]?.message,
          });
        throw err;
      }
    }),
});
