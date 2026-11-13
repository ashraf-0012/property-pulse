import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/config/database";
import User from "@/models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  callbacks: {
    // Invoked on successful sign-in
    async signIn({ profile }) {
      // 1. Connect to the database
      await connectDB();

      // 2. Check if the user exists
      const userExists = await User.findOne({
        email: profile.email,
      });

      // 3. If the user doesn't exist, create one
      if (!userExists) {
        const username = (profile.name || profile.email.split("@")[0]).slice(
          0,
          20
        );

        await User.create({
          email: profile.email,
          username,
          image: profile.picture,
        });
      }

      // 4. Allow sign-in
      return true;
    },

    // Modify the session object
    async session({ session }) {
      // 1. Get the user from the database
      const user = await User.findOne({
        email: session.user.email,
      });

      // 2. Add the database user ID to the session
      if (user) {
        session.user.id = user._id.toString();
      }

      // 3. Return the session
      return session;
    },
  },
};

