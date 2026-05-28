import { auth, currentUser } from "@clerk/nextjs/server";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not found", { status: 404 });
  }

  try {
    const { sessionClaims } = await auth();
    const user = await currentUser();

    const safeUser = user
      ? {
          id: (user as any).id,
          fullName: (user as any).fullName,
          emailAddresses: (user as any).emailAddresses,
          imageUrl: (user as any).imageUrl,
          publicMetadata: (user as any).publicMetadata,
          organization_id: (user as any).organization_id ?? (user as any).organizationId ?? (user as any).org_id,
          external_id: (user as any).external_id ?? (user as any).externalId,
        }
      : null;

    return new Response(JSON.stringify({ sessionClaims: sessionClaims ?? null, user: safeUser }, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
