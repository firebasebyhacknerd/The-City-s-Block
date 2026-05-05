import { SignupForm } from "@/components/auth/SignupForm";

export const metadata = { title: "Create Account | The City's Block" };

export default function SignupPage() {
  return (
    <main className="container-shell py-12 pb-20">
      <div className="mx-auto max-w-md">
        <SignupForm />
      </div>
    </main>
  );
}
