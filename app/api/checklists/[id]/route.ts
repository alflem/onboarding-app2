import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../prisma/middleware';

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const { name, items } = await req.json();

  const checklist = await prisma.checklist.update({
    where: { id: parseInt(id as string) },
    data: {
      name,
      items,
    },
  });

  return NextResponse.json(checklist, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  await prisma.checklist.delete({
    where: { id: parseInt(id as string) },
  });

  return NextResponse.json(null, { status: 204 });
}