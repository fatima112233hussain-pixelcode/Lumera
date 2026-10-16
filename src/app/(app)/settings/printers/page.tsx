import { eq } from "drizzle-orm";
import { db } from "@/db";
import { printTemplates } from "@/db/schema";
import { requireTenantSession } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { PrinterManager } from "./printer-manager";

// Every render here depends on the signed-in tenant and must never
// be cached or shared across requests.
export const dynamic = "force-dynamic";

export const metadata = { title: "Printers" };

export default async function PrintersPage() {
  const { clinic, member } = await requireTenantSession();

  if (!can(member, "clinic:manage")) {
    return (
      <p className="text-muted-foreground py-10 text-center text-sm">
        You do not have permission to change printer settings.
      </p>
    );
  }

  const templates = await db
    .select()
    .from(printTemplates)
    .where(eq(printTemplates.clinicId, clinic.id))
    .orderBy(printTemplates.createdAt);

  return <PrinterManager templates={templates} />;
}
