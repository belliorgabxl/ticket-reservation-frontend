"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/api/auth";
import { useAuth } from "@/lib/auth-context";
import Card from "@/components/ui/card";
import Field from "@/components/ui/input";
import Button from "@/components/ui/button";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await login({ email, password });
      // Update the shared auth state immediately — router.push alone
      // wouldn't do this, since it doesn't remount the layout/header.
      await refreshUser();
      const next = searchParams.get("next");
      router.push(next && next.startsWith("/") ? next : "/events");
    } catch (err) {
      setError(err instanceof Error ? err.message : "failed to login");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-sm flex-col justify-center px-6 py-10">
      <h1 className="mb-1 text-2xl font-bold tracking-tight">Welcome back</h1>
      <p className="mb-6 text-sm text-muted">Log in to continue booking.</p>

      <Card className="p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <Field
            id="email"
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Field
            id="password"
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error ? (
            <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
              {error}
            </p>
          ) : null}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Logging in..." : "Log in"}
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-center text-sm text-muted">
        No account?{" "}
        <Link href="/register" className="font-medium text-accent">
          Register
        </Link>
      </p>
    </main>
  );
}
