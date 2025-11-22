import { Pool } from 'pg';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required.' }, { status: 400 });
    }

    // Check if user already exists
    const checkUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (checkUser.rows.length > 0) {
      return NextResponse.json({ error: 'User already exists.' }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Insert new user
    const newUser = await pool.query(
      'INSERT INTO users (email, "hashedPassword", name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, hashedPassword, name]
    );

    return NextResponse.json(newUser.rows[0], { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}