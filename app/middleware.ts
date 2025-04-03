import NextAuth from "next-auth";
import authConfig from "@/lib/authConfig";

export const {auth: middleware} = NextAuth(authConfig);

export const config = {
    matcher: ["/((?!api|_next/static|.*\\.mp4$|.*\\.png$|.*\\.jpg$).*)"]
};
