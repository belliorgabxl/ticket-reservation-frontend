"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { register } from "@/lib/api/auth";
import { useAuth } from "@/lib/auth-context";
import Card from "@/components/ui/card";
import Field from "@/components/ui/input";
import Button from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await register({ name, email, password });
      await refreshUser();
      const next = searchParams.get("next");
      router.push(next && next.startsWith("/") ? next : "/events");
    } catch (err) {
      setError(err instanceof Error ? err.message : "failed to register");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-sm flex-col justify-center px-6 py-10">
      <h1 className="mb-1 text-2xl font-bold tracking-tight">
        Create an account
      </h1>
      <p className="mb-6 text-sm text-muted">
        Register to start booking seats.
      </p>

      <Card className="p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <Field
            id="name"
            label="Name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Field
            id="email"
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div>
            <Field
              id="password"
              label="Password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="mt-1.5 text-xs text-muted">At least 8 characters.</p>
          </div>

          {error ? (
            <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
              {error}
            </p>
          ) : null}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Creating account..." : "Register"}
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-accent">
          Log in
        </Link>
      </p>
    </main>
  );
}
