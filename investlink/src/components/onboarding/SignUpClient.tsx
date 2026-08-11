"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

import {
  AuthShell,
  OAuthButtons,
  OrDivider,
} from "@/components/auth/AuthShell";

/**
 * Signup — varianta A: email + parolă, FĂRĂ alegerea rolului aici.
 *
 * `roleSuggestion` vine din landing (ex. butonul „For Startups"). NU e un
 * angajament: îl păstrăm în sessionStorage ca pasul 0 al onboarding-ului să-l
 * pre-selecteze. Sursa de adevăr pentru rol e onboarding-ul, nu acest URL —
 * așa nu se pierde la refresh sau la login cu Google.
 */
export default function SignUpClient({
  roleSuggestion,
}: {
  roleSuggestion?: "STARTUP" | "INVESTOR" | "EXPERT";
}) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  function rememberRoleSuggestion() {
    if (roleSuggestion && typeof window !== "undefined") {
      window.sessionStorage.setItem("investlink:roleSuggestion", roleSuggestion);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password") || "");
    const confirmPassword = String(fd.get("confirmPassword") || "");

    if (password !== confirmPassword) {
      setMsg("Passwords don't match.");
      setLoading(false);
      return;
    }

    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      password,
      confirmPassword,
      // Rol placeholder — va fi setat la pasul 0 al onboarding-ului.
      role: roleSuggestion ?? "STARTUP",
    };

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setMsg(data?.error ?? "Couldn't create the account.");
      setLoading(false);
      return;
    }

    rememberRoleSuggestion();
    const login = await signIn("credentials", {
      redirect: true,
      callbackUrl: "/auth/continue",
      email: payload.email,
      password: payload.password,
    });
    if (login?.error) setMsg("Account created, but automatic sign-in failed.");
    setLoading(false);
  }

  return (
    <AuthShell
      eyebrow="Get started"
      title="Create your account"
      subtitle="One account for all three roles — you'll choose yours next."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/auth/signin" className="font-semibold text-blue-600 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <OAuthButtons
        onGoogle={() => {
          rememberRoleSuggestion();
          signIn("google", { callbackUrl: "/auth/continue" });
        }}
        onLinkedIn={() => {
          rememberRoleSuggestion();
          signIn("linkedin", { callbackUrl: "/auth/continue" });
        }}
      />
      <OrDivider />

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-900">Full name</label>
          <input
            name="name"
            required
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-900">Email</label>
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-900">Phone</label>
          <input
            name="phone"
            required
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="+373..."
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-900">Password</label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="Min 8 characters"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-900">Confirm</label>
            <input
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="Repeat password"
            />
          </div>
        </div>

        {msg && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {msg}
          </div>
        )}

        <button
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Creating..." : "Create account"}
        </button>

        <p className="text-center text-[11px] leading-relaxed text-slate-400">
          By creating an account you agree to our Terms and Privacy Policy.
        </p>
      </form>
    </AuthShell>
  );
}
