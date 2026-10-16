import { SignIn } from "@clerk/nextjs";
import { AuthShell } from "@/components/marketing/auth-shell";

export const metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <AuthShell
      title="Welcome back"
      body="Sign in to pick up where your clinic left off."
    >
      <SignIn />
    </AuthShell>
  );
}
