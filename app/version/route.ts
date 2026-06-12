// app/api/version/route.ts (or pages/api/version.ts)
export async function GET() {
  return Response.json({
    version: process.env.NEXT_PUBLIC_BUILD_ID,
  });
}