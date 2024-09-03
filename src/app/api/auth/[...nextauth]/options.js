import User from "@/models/user";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { dbConnect } from "@/lib/dbConnect";

await dbConnect();

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text", placeholder: "User Email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log(credentials);
        await dbConnect();
        try {
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error("No User Found with this Email or name");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect Password");
          }
        } catch (error) {
          throw new Error("Failed to Login.");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOOGLE_ID,
      clientSecret: process.env.GOOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      await dbConnect(); // Ensure the database is connected

      if (account.provider === "google") {
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          try {
            // Create a new user with googleId
            await User.create({
              name: user.name,
              email: user.email,
              googleId: account.id, // Use the Google account ID as googleId
              image: user.image, // Save the profile image if available
            });
          } catch (error) {
            console.error("Error creating user:", error);
            throw new Error("Failed to create user.");
          }
        }
      }

      return true; // Return true to indicate successful sign-in
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.email = token.email;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt", // Use "jwt" for token-based sessions
  },
  secret: process.env.NEXT_AUTH_SECRET,
};
