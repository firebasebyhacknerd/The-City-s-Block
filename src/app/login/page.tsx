import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = { title: "Sign In | The City's Block" };

export default function LoginPage() {
  return (
    <main className="container-shell py-12 pb-20">
      <div className="mx-auto max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}
