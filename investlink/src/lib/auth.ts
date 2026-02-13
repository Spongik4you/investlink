import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma), // IMPORTANT pt OAuth + DB
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin", 
    error: "/auth/error",
  },


  providers: [
    // Le poți lăsa, chiar dacă începi cu email+parolă.
    // Doar ai grijă ca env-urile să existe, altfel poate crăpa la runtime.
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID ?? "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET ?? "",
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password;

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          // le punem în token prin callbacks
        };
        } catch (err) {
        console.error("NEXTAUTH AUTHORIZE ERROR:", err);
        return null;
        }
      },  
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // când user există (la login), salvăm id
      if (user?.id) token.sub = user.id;

      // în fiecare request, încărcăm din DB câmpurile custom
      if (token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { type: true, verificationStatus: true },
        });

        token.type = dbUser?.type;
        token.verificationStatus = dbUser?.verificationStatus;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.type = token.type as any;
        session.user.verificationStatus = token.verificationStatus as any;
      }
      return session;
    },
  },
};
