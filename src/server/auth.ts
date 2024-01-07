import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import bcrypt from "bcrypt";

import { env } from "~/env";
import { db } from "~/server/db";
import { redirect } from "next/navigation";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  events: {
    async signIn(message) {
      console.log(message);
    },
  },
  callbacks: {
    // signIn: ({ user }) => {
    //   console.log(user);
    //   return true;
    // },
    // async redirect({ url, baseUrl }) {
    //   return "/hello";
    // },
    session: ({ session, token }) => {
      console.log(session);
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      };
    },
    // jwt: ({ token, user }) => {
    //   if (user) {
    //     token.accessToken = user.name;
    //   }

    //   return token;
    // },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    // newUser: "/auth/register",
  },
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    // DiscordProvider({
    //   clientId: env.DISCORD_CLIENT_ID,
    //   clientSecret: env.DISCORD_CLIENT_SECRET,
    // }),
    CredentialsProvider({
      id: "next-auth",
      name: "Login with username",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "enter your username",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        console.log("authorize");
        const user = await db.user.findFirstOrThrow({
          where: {
            username: credentials?.username,
          },
        });
        // const user = { id: "1", name: "J Smith", email: "jsmith@example.com" };
        if (user) {
          return user;
        } else {
          throw new Error("Invalid credentials");
        }
        // if (credentials) {
        //   return credentials;
        // } else {
        //   throw new Error("Invalid credentials");
        // }
        // try {
        //   const user = await db.user.findFirstOrThrow({
        //     where: {
        //       username: credentials?.username,
        //     },
        //   });
        //   if (user && credentials) {
        //     const validPassword = await bcrypt.compare(
        //       credentials?.password,
        //       user.password!,
        //     );
        //     if (validPassword) {
        //       console.log(user);
        //       return {
        //         id: user.id,
        //         username: user.username,
        //       };
        //     }
        //   }
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  debug: process.env.NODE_ENV === "development",
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
