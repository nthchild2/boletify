/**
 * Auth.js v5 configuration
 * Uses JWT strategy (simpler) with credentials provider
 *
 * NOTE: Uses raw neon() tagged-template queries instead of Drizzle ORM
 * to avoid the @neondatabase/serverless v1.x incompatibility with
 * drizzle-orm's neon-http driver. Once the server is restarted with
 * neon pinned to 0.10.4 (see root package.json overrides), this can
 * be reverted back to Drizzle.
 */

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { neon } from '@neondatabase/serverless';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = (credentials.email as string).toLowerCase();
        const password = credentials.password as string;

        const sql = neon(process.env.BOLETIFY_DATABASE_URL!);
        const rows = await sql`
          SELECT id, email, name, role, password_hash
          FROM users
          WHERE email = ${email}
          LIMIT 1
        `;

        if (rows.length === 0) {
          return null;
        }

        const user = rows[0];
        if (!user.password_hash) {
          return null;
        }

        const isValid = await compare(password, user.password_hash as string);
        if (!isValid) {
          return null;
        }

        return {
          id: String(user.id),
          email: user.email as string,
          name: user.name as string,
          role: user.role as string,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
  },
});