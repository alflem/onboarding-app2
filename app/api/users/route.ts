import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../prisma/middleware';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { email, password, role, organizationId } = await req.json();
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
      organizationId,
    },
  });

  return NextResponse.json(user, { status: 201 });
}