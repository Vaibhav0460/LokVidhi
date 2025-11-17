import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { Pool } from "pg"
import PostgresAdapter from "@auth/pg-adapter"

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

// --- DIAGNOSTICS (Still useful) ---
console.log("--- AUTH.TS DIAGNOSTICS ---");
console.log("DATABASE_URL set:", !!process.env.DATABASE_URL);
console.log("GOOGLE_CLIENT_ID set:", !!process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET set:", !!process.env.GOOGLE_CLIENT_SECRET);
console.log("NEXTAUTH_SECRET set:", !!process.env.NEXTAUTH_SECRET);
console.log("---------------------------");
// ---------------------------------


// --- THIS IS THE FIX ---
// Call NextAuth and store the result in a local const first.
// This breaks the race condition.
const authResult = NextAuth({
  adapter: PostgresAdapter(pool), 
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
})

// NOW, explicitly export the properties from the result.
export const handlers = authResult.handlers
export const signIn = authResult.signIn
export const signOut = authResult.signOut
export const auth = authResult.auth