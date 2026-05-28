import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";
import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";

import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL!
);

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

function getDisplayName(user: {
  fullName?: string | null;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  primaryEmailAddress?: { emailAddress?: string | null } | null;
}, sessionClaims?: Record<string, unknown>) {
  const claimUsername = sessionClaims?.username as string | undefined;
  const claimName = sessionClaims?.name as string | undefined;
  const claimFirstName = sessionClaims?.first_name as string | undefined;
  const claimLastName = sessionClaims?.last_name as string | undefined;
  const claimEmail = sessionClaims?.email as string | undefined;

  const fallbackName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  const claimFallbackName = [claimFirstName, claimLastName].filter(Boolean).join(" ").trim();

  // Try fullName first, then firstName+lastName, then other fields
  if (user.fullName?.trim()) return user.fullName.trim();
  if (fallbackName) return fallbackName;
  if (claimName?.trim()) return claimName.trim();
  if (claimFallbackName) return claimFallbackName;
  if (user.username?.trim()) return user.username.trim();
  if (claimUsername?.trim()) return claimUsername.trim();
  if (user.primaryEmailAddress?.emailAddress) return user.primaryEmailAddress.emailAddress;
  if (claimEmail) return claimEmail;

  return "User";
}

export async function POST(req: Request) {
  const { sessionClaims } = await auth();

  if (!sessionClaims) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await currentUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { room } = await req.json();

  const document = await convex.query(
    api.documents.getById,
    { id: room }
  );

  if (!document) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Accept multiple possible user id formats — Clerk/Convex may store different ids
  const sessionSub = (sessionClaims as any)?.sub ?? (sessionClaims as any)?.user_id ?? (sessionClaims as any)?.uid;
  const userIdCandidates = [
    (user as any).id,
    (user as any).sub,
    sessionSub,
    (user as any).external_id,
  ].filter(Boolean).map(String);

  const isOwner = userIdCandidates.some((id) => String(document.ownerId) === id);

  // Resolve organization id from several possible places (Clerk/Convex differences)
  const userOrgId = (user as any).organization_id ?? (user as any).organizationId ?? (user as any).org_id ?? (user as any).publicMetadata?.organizationId;

  const sessionOrgId = (sessionClaims as any)?.org_id ?? (sessionClaims as any)?.organization_id;

  let isOrganizationMember = !!(
    document.organizationId && (
      String(document.organizationId) === String(sessionOrgId) ||
      String(document.organizationId) === String(userOrgId)
    )
  );

  // Dev-time debugging to help track mismatches (will not expose secrets)
  if (process.env.NODE_ENV !== "production") {
    try {
      // eslint-disable-next-line no-console
      console.debug("Liveblocks auth: documentOrg=", document.organizationId, "sessionOrg=", sessionOrgId, "userOrg=", userOrgId);
    } catch (e) {}
  }

  if (process.env.NODE_ENV !== "production") {
    try {
      // eslint-disable-next-line no-console
      console.debug("Liveblocks auth: documentOwner=", document.ownerId, "userCandidates=", userIdCandidates);
    } catch (e) {}
  }

  // If org membership still unknown, fall back to Clerk's organizations API to verify membership
  if (!isOrganizationMember && document.organizationId) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.debug("Liveblocks auth: entering clerk fallback (user.getOrganizationMemberships) for userId=", (user as any).id);
    }
    try {
      const getUserMemberships = (user as any).getOrganizationMemberships;
      let memberships: any = undefined;
      if (typeof getUserMemberships === "function") {
        memberships = await getUserMemberships.call(user, {});
      } else {
        // last-resort: try clerkClient API (some SDK versions expose different shapes)
        try {
            const clerk = await clerkClient();
            memberships = await (clerk.users?.getOrganizationMembershipList?.({ userId: (user as any).id }) ?? undefined);
        } catch (err) {
          memberships = undefined;
        }
      }

      if (memberships && (Array.isArray(memberships) || memberships.data)) {
        const items = Array.isArray(memberships) ? memberships : memberships.data ?? [];
        const match = items.some((m: any) => String(m.organization?.id ?? m.organizationId ?? m.organization?.organizationId) === String(document.organizationId));
        if (match) {
          isOrganizationMember = true;
        }
      }

      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.debug("Liveblocks auth (clerk fallback): memberships=", memberships);
      }
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.error("Liveblocks auth (clerk fallback) error:", e);
      }
    }
  }

  if (!isOwner && !isOrganizationMember) {
    return new Response("Unauthorized", { status: 401 });
  }

  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name: getDisplayName(user as any, sessionClaims as any),
      avatar: user.imageUrl,
      
    },
  });

  session.allow(room, session.FULL_ACCESS);

  const { body, status } = await session.authorize();

  return new Response(body, { status });
}