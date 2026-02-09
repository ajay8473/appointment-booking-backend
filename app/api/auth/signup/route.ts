import { NextResponse } from "next/server";
import { users } from "@/lib/data";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const { name, email, password, role } = await req.json();

  if (!name || !email || !password || !role) {
    return NextResponse.json(
      { message: "All fields required" },
      { status: 400 }
    );
  }

  const existing = users.find(u => u.email === email);
  if (existing) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: randomUUID(),
    name,
    email,
    password: hashedPassword,
    role
  };

  users.push(newUser);

  return NextResponse.json({
    message: "User registered successfully"
  });
}
