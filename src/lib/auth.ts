import { cache } from "react";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { clinics, members } from "@/db/schema";
import type { Clinic, Member } from "@/db/schema";
import {
  assertCan,
  can,
  maxDiscountFor,
  type Permission,
} from "@/lib/permissions";

export interface TenantSession {
  clinic: Clinic;
  member: Member;
}

/**
 * The organisation's current name, straight from Clerk. Cached per request,
 * and falls back to the passed-in cached name if the lookup fails, so a
 * Clerk hiccup degrades to a slightly stale name rather than an error page.
 */
const currentOrgName = cache(
  async (orgId: string, fallback: string): Promise<string> => {
    try {
      const client = await clerkClient();
      const org = await client.organizations.getOrganization({
        organizationId: orgId,
      });
      return org.name || fallback;
    } catch {
      return fallback;
    }
  },
);

/**
 * The single door every request goes through to learn which clinic it belongs
 * to. Cached per request so a page with a dozen server components pays for one
 * lookup, not a dozen.
 *
 * Returns null rather than throwing so callers can decide between redirecting
 * to sign-in and rendering an empty state.
 */
export const getTenantSession = cache(
  async (): Promise<TenantSession | null> => {
    const { userId, orgId, orgSlug } = await auth();
    if (!userId || !orgId) return null;

    const [row] = await db
      .select()
      .from(clinics)
      .where(eq(clinics.clerkOrgId, orgId))
      .limit(1);

    if (!row) return null;

    // Clerk is the authority on the organisation's name; the column is a
    // cache of it. Prefer the live claim so a rename shows up immediately
    // rather than waiting on a webhook.
    const liveName = await currentOrgName(orgId, row.name);
    const clinic: Clinic =
      liveName === row.name ? row : { ...row, name: liveName };

    // Write the cache back in the background. A failure here is not worth
    // failing the request over — the render already has the right name.
    if (liveName !== row.name) {
      void db
        .update(clinics)
        .set({ name: liveName, slug: orgSlug ?? row.slug, updatedAt: new Date() })
        .where(eq(clinics.id, row.id))
        .catch(() => {});
    }

    const [member] = await db
      .select()
      .from(members)
      .where(
        and(eq(members.clinicId, clinic.id), eq(members.clerkUserId, userId)),
      )
      .limit(1);

    // Signed in, and the org exists, but this user was never provisioned into
    // it — treat as no access rather than silently granting a default role.
    if (!member || !member.isActive) return null;

    return { clinic, member };
  },
);

export class UnauthorizedError extends Error {
  constructor(message = "Not signed in to a clinic") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/** For server actions and route handlers, where "no session" is always a bug. */
export async function requireTenantSession(): Promise<TenantSession> {
  const session = await getTenantSession();
  if (!session) throw new UnauthorizedError();
  return session;
}

/**
 * The workhorse for mutations: proves there is a session AND that the caller
 * holds the permission, in one call.
 */
export async function requirePermission(
  permission: Permission,
): Promise<TenantSession> {
  const session = await requireTenantSession();
  assertCan(session.member, permission);
  return session;
}

export async function hasPermission(permission: Permission): Promise<boolean> {
  const session = await getTenantSession();
  return session ? can(session.member, permission) : false;
}

/** Discount ceiling for the signed-in operator, in percent. */
export async function currentMaxDiscount(): Promise<number> {
  const session = await getTenantSession();
  return session ? maxDiscountFor(session.member) : 0;
}

/**
 * Kept so every write path reads the same as before, but nothing is gated:
 * Softco is free, so there is no lapsed state to lock anyone out of. The
 * name stays requireActivePermission rather than being renamed across
 * every action file, and the error type stays exported because callers
 * still catch it.
 */
export class SubscriptionLapsedError extends Error {
  constructor() {
    super("This clinic's account is not active");
    this.name = "SubscriptionLapsedError";
  }
}

/** Guards every write path. Permission is the only gate here. */
export async function requireActivePermission(
  permission: Permission,
): Promise<TenantSession> {
  return requirePermission(permission);
}
