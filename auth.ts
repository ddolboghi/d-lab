import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { supabaseClient } from "./lib/getSupabaseClient";
import { Member } from "./utils/types";
import { verifyRegisteredMember } from "./actions/verify";

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  providers: [Google],
  pages: {
    signIn: "/login",
    error: "/error",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const { data: existingMember } = await supabaseClient
            .from("member")
            .select()
            .eq("email", user.email)
            .single<Member>();

          if (!existingMember) {
            const { data: member, error: memberInsertError } =
              await supabaseClient
                .from("member")
                .insert({
                  member_id: profile?.sub,
                  email: user.email,
                  name: user.name,
                })
                .select("email")
                .single<Member>();

            if (!member || memberInsertError) throw memberInsertError;

            const isRegisteredMember = await verifyRegisteredMember(
              member.email
            );
            user.isRegistered = isRegisteredMember;
          } else {
            const isRegisteredMember = await verifyRegisteredMember(
              existingMember.email
            );
            user.isRegistered = isRegisteredMember;
          }

          return true;
        } catch (error) {
          console.error("Error checking/creating user:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.isRegistered = user.isRegistered;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.isRegistered = token.isRegistered;
      return session;
    },
  },
});
