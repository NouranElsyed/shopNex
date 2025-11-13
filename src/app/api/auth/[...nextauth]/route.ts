/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions, DefaultSession, DefaultUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { api } from "@/src/config/api.config";
import CredentialsProvider from "next-auth/providers/credentials";


declare module "next-auth" {
  interface User extends DefaultUser {
    role?: string;
    accessToken?: string; 
    phone?: string
  }
  interface Session {
    user: {
      role?: string;
    } & DefaultSession["user"];
    accessToken?: string; 
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    accessToken?: string;
  }
}


export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { prompt: "select_account" } },
    }),
     CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        phone: { label: "Phone", type: "text" },
        mode: { label: "Mode", type: "hidden" }, // "login" or "signup"
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { name, email, password, phone, mode } = credentials;
     

        try {
          if (mode === "signup") {
           
            const signupRes = await api.post("/auth/signup", {
              name,
              email,
              password,
              rePassword: password,
              phone,
            });

           

            if (signupRes.data?.token && signupRes.data?.user) {
              return {
                id: signupRes.data.user.id,
                email: signupRes.data.user.email,
                name: signupRes.data.user.name,
                role: signupRes.data.user.role ?? "user",
                accessToken: signupRes.data.token,
              };
            }
            return null;
          } else {
           
            const signinRes = await api.post("/auth/signin", {
              email,
              password,
            });
          

            if (signinRes.data?.token && signinRes.data?.user) {
              return {
                id: signinRes.data.user.id,
                email: signinRes.data.user.email,
                name: signinRes.data.user.name,
                role: signinRes.data.user.role ?? "user",
                accessToken: signinRes.data.token,
              };
            }
            return null;
          }
        } catch (error: any) {
          const errorMsg = error.response?.data.message || "Something went wrong!";
  console.error("Credentials auth error:", errorMsg);
  throw new Error(errorMsg); 
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user?.email) return false;

        try {
        
          const res = await api.post("/auth/signin", {
            email: user.email,
            password: process.env.OAUTH_DEFAULT_PASSWORD!
          });
          
          if (res.data?.token) {
            user.accessToken = res.data.token;
            user.role = res.data.user.role ?? "user";
            return true;
          }
        } catch (err: any) {
          console.error("Google signin error:", err.response?.data || err.message);
          
        
          try {
            const signupRes = await api.post("/auth/signup", {
              name: user.name ?? "Google User",
              email: user.email,
              password: process.env.OAUTH_DEFAULT_PASSWORD!,
              rePassword: process.env.OAUTH_DEFAULT_PASSWORD!,
              phone: user.phone ?? "01000000000",
            });
            
            if (signupRes.data?.token) {
              user.accessToken = signupRes.data.token;
              user.role = signupRes.data.user.role ?? "user";
              return true;
            }
          } catch (signupErr: any) {
            console.error("Google signup error:", signupErr.response?.data || signupErr.message);
              throw new Error(signupErr.response?.data.message||signupErr.message); 
          }
        }
      }

      return true;
    },

    async jwt({ token, user, account }) {
     
     
      if (user && account) {
        token.accessToken = user.accessToken;
        token.role = user.role;
      }
      
      return token;
    },

    async session({ session, token }) {
 
      session.accessToken = token.accessToken as string;
      session.user.role = token.role as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };