import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../prisma/middleware';

export async function POST(req: NextRequest) {
  const { name } = await req.json();
  const organization = await prisma.organization.create({
    data: { name },
  });
  return NextResponse.json(organization, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  await prisma.organization.delete({
    where: { id: parseInt(id as string) },
  });
  return NextResponse.json(null, { status: 204 });
}