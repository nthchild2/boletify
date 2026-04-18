/**
 * Authentication router
 * Handles user registration, login, logout, and profile operations
 */

import { TRPCError } from '@trpc/server';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { hashPassword, verifyPassword } from '../utils/password';
import { registerSchema, loginSchema } from '../validators/auth';
import { db } from '@boletify/db';
import { users } from '@boletify/db/src/schema';
import { eq } from 'drizzle-orm';

export const authRouter = createTRPCRouter({
  /**
   * Register a new user
   * Creates user account with email and password
   */
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input }) => {
      const { email, password, name, role = 'buyer' } = input;

      // Check if user already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email.toLowerCase()))
        .limit(1);

      if (existingUser.length > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Email already registered',
        });
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Create user
      const newUser = await db
        .insert(users)
        .values({
          email: email.toLowerCase(),
          passwordHash,
          name,
          role,
        })
        .returning();

      if (!newUser[0]) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create user',
        });
      }

      return {
        id: newUser[0].id,
        email: newUser[0].email,
        name: newUser[0].name,
        role: newUser[0].role,
      };
    }),

  /**
   * Login user
   * Validates credentials and returns user + session token
   */
  login: publicProcedure.input(loginSchema).mutation(async ({ input }) => {
    const { email, password } = input;

    // Find user by email
    const userList = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (userList.length === 0) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid email or password',
      });
    }

    const user = userList[0];

    // Validate password
    const isValidPassword = await verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid email or password',
      });
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }),

  /**
   * Get current user (protected)
   */
  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Not authenticated',
      });
    }

    const userList = await db
      .select()
      .from(users)
      .where(eq(users.id, ctx.userId))
      .limit(1);

    if (userList.length === 0) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    const user = userList[0];

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }),
});
