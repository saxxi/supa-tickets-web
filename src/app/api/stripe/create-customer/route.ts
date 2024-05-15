import { v4 } from 'uuid';

export async function POST(req: Request) {
  const payload = await req.json()
  console.log('payload', payload);
  return Response.json({ customerId: `str-test-${v4()}` })
}
