import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { Pool } from "pg"
import PostgresAdapter from "@auth/pg-adapter"
import { compare } from "bcryptjs"

// Singleton Database Pool
declare global {
  var pgPool: Pool | undefined
}
const pool = global.pgPool || new Pool({
  connectionString: process.env.DATABASE_URL,
});
if (process.env.NODE_ENV !== "production") {
  global.pgPool = pool
}

const authResult = NextAuth({
  session: { strategy: "jwt" },
  adapter: PostgresAdapter(pool),
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [credentials.email]);
        const user = result.rows[0];

        if (!user || !user.hashedPassword) return null;

        const isValidPassword = await compare(credentials.password as string, user.hashedPassword);
        if (!isValidPassword) return null;

        // DEBUG LOG 1: Check if DB returns the role
        console.log(">>> AUTHORIZE: Found User:", { email: user.email, role: user.role });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role 
        };
      }
    })
  ],

  callbacks: {
    async jwt({ token, user, trigger }) {
      // DEBUG LOG 2: Check what enters the Token
      if (user) {
        console.log(">>> JWT INITIAL (Login):", { role: (user as any).role });
        token.role = (user as any).role; 
      }

      // Safety Net
      if (!token.role && token.email) {
         console.log(">>> JWT REFRESH: Fetching role from DB for", token.email);
         try {
           const res = await pool.query("SELECT role FROM users WHERE email = $1", [token.email]);
           if (res.rows.length > 0) token.role = res.rows[0].role;
         } catch (e) { console.error(e); }
      }
      
      // DEBUG LOG 3: Check final token
      // console.log(">>> JWT FINAL:", { role: token.role }); 
      return token;
    },
    async session({ session, token }) {
      // Return a NEW object to ensure React picks up the change
      return {
        ...session,
        user: {
          ...session.user,
          role: token.role as string, // Explicitly add role
        }
      };
    }
  },

  pages: {
    signIn: '/login',
  }
})

export const handlers = authResult.handlers
export const signIn = authResult.signIn
export const signOut = authResult.signOut
export const auth = authResult.auth