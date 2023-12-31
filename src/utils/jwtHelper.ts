import { encode, decode } from "next-auth/jwt";
import { env } from "~/env.js";
import { type User } from "@prisma/client";

export type AuthUser = Omit<User, "Password">;

export const tokenOneDay = 24 * 60 * 60;
export const tokenOnWeek = tokenOneDay * 7;

const craeteJWT = (token: AuthUser, duration: number) =>
  encode({ token, secret: env.JWT_SECRET, maxAge: duration });

export const jwtHelper = {
  createAcessToken: (token: AuthUser) => craeteJWT(token, tokenOneDay),
  createRefreshToken: (token: AuthUser) => craeteJWT(token, tokenOnWeek),
  verifyToken: (token: string) => decode({ token, secret: env.JWT_SECRET }),
};
