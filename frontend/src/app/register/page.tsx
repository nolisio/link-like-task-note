import AuthForm from "../../components/AuthForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--color-accent-pink)] rounded-full blur-[100px] opacity-20" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-primary-light)] rounded-full blur-[100px] opacity-20" />
      <AuthForm mode="register" />
    </main>
  );
}
