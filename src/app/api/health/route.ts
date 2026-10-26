import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.nxt_build_id || 'dev',
    },
    { status: 200 }
  );
}
