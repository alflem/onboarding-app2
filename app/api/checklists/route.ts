import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../prisma/middleware';

export async function POST(req: NextRequest) {
  const { name, items, organizationId } = await req.json();

  const checklist = await prisma.checklist.create({
    data: {
      name,
      items,
      organizationId,
    },
  });

  return NextResponse.json(checklist, { status: 201 });
}