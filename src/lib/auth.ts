import UserModel from "@/models/User";
import { connectDB } from "./db";
import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  //callbacks :
  // Callbacks ke bina username aur id frontend pe nahi milega.
  // jwt callback token mein save karta hai,
  // session callback frontend tak pohchata hai.

  callbacks: {
    async signIn({ user, account }) {
      try {
        await connectDB();

        if (account?.provider === "google") {
          const existingUser = await UserModel.findOne({
            email: user.email?.toLowerCase(),
          });

          if (!existingUser) {
            await UserModel.create({
              name: user.name,
              email: user.email?.toLowerCase(),
              isOnline: true,
            });
          }
        }
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },

    async jwt({ token, user }) {
      await connectDB();
      // if (user) {
      //   token.id = user.id;
      //   token.username = (user as any).username;
      // }
      // return token;

      const email = user?.email || token.email;

      if (email) {
        const dUser = await UserModel.findOne({
          email: email.toLowerCase(),
        });

        if (dUser) {
          token.id = dUser._id.toString();
          token.username = dUser.username;
          token.hasUsername = !!dUser.username;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).username = token.username;
        (session.user as any).hasUsername = token.hasUsername;
      }

      return session;
    },
  },

  events: {
    async signIn(message) {
      console.log("User signed in");
    },
  },

  //TODO: uncomment this page section
  // pages: {
  //   signIn: "/login", // ← ab NextAuth mera /login page use karega
  // },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
