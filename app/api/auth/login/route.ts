import { NextResponse } from "next/server";
import { users } from "@/lib/data";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = "supersecretkey";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = users.find(u => u.email === email);

  if (!user) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 400 }
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 400 }
    );
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    SECRET,
    { expiresIn: "1h" }
  );

  return NextResponse.json({
    message: "Login successful",
    token
  });
}
