import UserModel from "@/models/User";
import { connectDB } from "./db";
import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        username: {},
        password: {},
      },

      async authorize(credentials: any) {
        try {
          await connectDB();

          if (!credentials?.username || !credentials?.password) {
            throw new Error("Missing Credentials");
          }

          const user = await UserModel.findOne({
            username: credentials.username.toLowerCase(),
          });

          if (!user) {
            throw new Error("User not found");
          }

          if (!user.password) {
            throw new Error("Please login using Google");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password,
          );
          if (!isPasswordCorrect) {
            throw new Error("Invalid password");
          }
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            username: user.username,
          };
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],

  //callbacks :
  // Callbacks ke bina username aur id frontend pe nahi milega.
  // jwt callback token mein save karta hai,
  // session callback frontend tak pohchata hai.

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).username = token.username;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login", // ← ab NextAuth mera /login page use karega
  },
  
  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
