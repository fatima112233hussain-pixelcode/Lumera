import { SignUp } from "@clerk/nextjs";
import { AuthShell } from "@/components/marketing/auth-shell";

export const metadata = { title: "Start free" };

export default function SignUpPage() {
  return (
    <AuthShell
      title="Open your clinic"
      body="No card, no trial clock. Make an account and the whole thing is yours."
    >
      <SignUp />
    </AuthShell>
  );
}
