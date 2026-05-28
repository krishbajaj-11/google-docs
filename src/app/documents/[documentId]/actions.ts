"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import {ConvexHttpClient} from "convex/browser";
import {api} from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL!
);

export async function getDocuments(
  ids: Id<"documents">[]
) {
  return await convex.query(
    api.documents.getByIds,
    { ids }
  );
}


function getDisplayName(user: {
  fullName?: string | null;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  primaryEmailAddress?: { emailAddress?: string | null } | null;
}) {
  const fallbackName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();

  if (user.fullName?.trim()) return user.fullName.trim();
  if (fallbackName) return fallbackName;
  if (user.username?.trim()) return user.username.trim();
  if (user.primaryEmailAddress?.emailAddress) return user.primaryEmailAddress.emailAddress;

  return "User";
}

export async function getUsers() {
  const { sessionClaims } = await auth();
  const clerk = await clerkClient();
  const organizationId = sessionClaims?.org_id as string | undefined;

  const userListQuery = organizationId
    ? { organizationId: [organizationId] }
    : undefined;

  const response = userListQuery
    ? await clerk.users.getUserList(userListQuery)
    : await clerk.users.getUserList();

  const users = response.data.map((user) => ({
    id: user.id,
    name: getDisplayName(user),
    avatar: user.imageUrl,
    username: user.username ?? undefined,
    email: user.primaryEmailAddress?.emailAddress ?? undefined,
  }));

  return users;
}