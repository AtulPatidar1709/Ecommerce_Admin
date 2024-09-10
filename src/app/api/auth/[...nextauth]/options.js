import User from '@/models/user';
import bcrypt from 'bcryptjs';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { dbConnect } from '@/lib/dbConnect';

await dbConnect();

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text', placeholder: 'User Email' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          await dbConnect(); // Ensure the database is connected

          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error('No User Found with this Email');
          }

          // Check if the user is verified
          if (!user.isAdmin) {
            throw new Error('Your account is awaiting admin verification.');
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            return {
              id: user._id,
              email: user.email,
              name: user.name,
              image: user?.image || '',
            };
          } else {
            throw new Error('Incorrect Password');
          }
        } catch (error) {
          throw new Error(error.message || 'Failed to Login.');
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      await dbConnect();
      if (account.provider === 'google') {
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          try {
            const newUser = await User.create({
              name: user.name,
              email: user.email,
              googleId: account.id,
              image: user.image,
              isVerified: false, // Newly created users need verification
            });

            // Redirect to wait-for-verification page for new users
            if (!newUser.isAdmin) {
              return '/sign-in'; // Redirect path
            }
          } catch (error) {
            throw new Error('Failed to create user.');
          }
        } else if (!existingUser.isAdmin) {
          // If the existing user is not verified, redirect them to the wait-for-verification page
          return '/sign-in';
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
      }
      return session;
    },
  },
  pages: {
    signIn: '/sign-in',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXT_AUTH_SECRET,
};
