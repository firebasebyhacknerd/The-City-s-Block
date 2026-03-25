import { AuthForm } from "@/components/portal/AuthForm";

export default function LoginPage() {
  return (
    <main className="container-shell py-12 pb-20">
      <div className="mx-auto max-w-xl">
        <AuthForm mode="login" />
      </div>
    </main>
  );
}
