import { CreateOrganization } from "@clerk/nextjs";
import { AuthShell } from "@/components/marketing/auth-shell";

export const metadata = { title: "Set up your clinic" };

export default function OnboardingPage() {
  return (
    <AuthShell
      title="Name your clinic"
      body="We will fill your price list with the treatments most clinics offer, ready for you to edit."
    >
      <CreateOrganization
        skipInvitationScreen
        afterCreateOrganizationUrl="/dashboard"
        appearance={{ elements: { rootBox: "w-full max-w-md" } }}
      />
    </AuthShell>
  );
}
