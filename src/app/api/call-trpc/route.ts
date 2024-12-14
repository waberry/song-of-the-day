import { NextResponse } from 'next/server';
import { createCaller } from '~/server/api/root';
import { db } from '~/server/db';

export async function POST(request: Request) {
  const { name, type, input } = await request.json();

  // Create a server-side caller
  const caller = createCaller({ db });

  try {
    let result;

    if (type === 'query') {
      // Queries generally have no input
      result = await (caller[name as keyof typeof caller] as () => Promise<any>)();
    } else if (type === 'mutation') {
      result = await (caller[name as keyof typeof caller] as (args: any) => Promise<any>)(input);
    } else {
      throw new Error('Unknown endpoint type');
    }

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
