import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { Pool } from "pg"
import PostgresAdapter from "@auth/pg-adapter"
import { compare } from "bcryptjs" // Using bcryptjs

// --- THIS IS THE SINGLETON FIX ---
declare global {
  var pgPool: Pool | undefined
}
const pool = global.pgPool || new Pool({
  connectionString: process.env.DATABASE_URL,
});
if (process.env.NODE_ENV !== "production") {
  global.pgPool = pool
}
// ---------------------------------

// --- DIAGNOSTICS ---
// We can remove these now, login is working
// console.log("--- AUTH.TS DIAGNOSTICS ---");
// ...
// ---------------------------------

const authResult = NextAuth({
  // --- THIS IS THE FIX ---
  // Force a "jwt" session. This is faster and avoids the
  // database race condition with the middleware.
  session: { strategy: "jwt" },
  // ---------------------

  adapter: PostgresAdapter(pool), 
  providers: [
    // --- 1. Google Provider (existing) ---
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    
    // --- 2. Credentials Provider (NEW) ---
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // We know this works, so we can remove the console logs
        if (!credentials?.email || !credentials.password) {
          return null
        }
        
        const result = await pool.query(
          'SELECT * FROM users WHERE email = $1',
          [credentials.email]
        );
        const user = result.rows[0];

        if (!user || !user.hashedPassword) {
          return null
        }

        const isValidPassword = await compare(credentials.password as string, user.hashedPassword);

        if (!isValidPassword) {
          return null
        }

        // Return user object (without password)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image
        };
      }
    })
  ],
  
  // --- 3. Tell NextAuth where our custom pages are ---
  pages: {
    signIn: '/login', // Redirects to /login if auth is required
  }
})

// NOW, explicitly export the properties from the result.
export const handlers = authResult.handlers
export const signIn = authResult.signIn
export const signOut = authResult.signOut
export const auth = authResult.auth