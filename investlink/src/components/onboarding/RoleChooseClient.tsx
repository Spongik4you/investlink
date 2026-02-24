"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Role = "STARTUP" | "INVESTOR" | "EXPERT";

function RoleCard({
  title,
  desc,
  icon,
  onClick,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group w-full rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        {icon}
      </div>
      <div className="mt-5 text-lg font-semibold text-slate-900">{title}</div>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{desc}</p>
      <div className="mt-6 text-sm font-semibold text-blue-600 opacity-0 transition group-hover:opacity-100">
        Continue →
      </div>
    </button>
  );
}

export default function RoleChooseClient() {
  const router = useRouter();
  const [loadingRole, setLoadingRole] = useState<Role | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function choose(role: Role) {
    setErr(null);
    setLoadingRole(role);

    try {
      const res = await fetch("/api/onboarding/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Failed");

      router.push(data.nextUrl);
    } catch (e: any) {
      setErr(e?.message ?? "Something went wrong");
      setLoadingRole(null);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white">
      <div className="mx-auto max-w-5xl px-6 py-14">
        <div className="flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 19V5M4 19H20M7 15l4-4 3 3 5-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="text-2xl font-semibold text-slate-900">InvestLink</div>
        </div>

        <h1 className="mt-12 text-center text-4xl font-semibold tracking-tight text-slate-900">
          Join InvestLink: Choose Your Role
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-slate-500">
          Select the role that best describes you to begin your tailored onboarding experience.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <RoleCard
            title="Startup"
            desc="Launch your vision. Connect with investors and experts to grow your business."
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2c3 2 5 5 5 8 0 4-3 7-7 7-3 0-6-2-7-5 4 0 7-3 9-10Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 21c1-3 3-5 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            }
            onClick={() => choose("STARTUP")}
          />

          <RoleCard
            title="Investor"
            desc="Discover promising ventures. Fund the next generation of innovators and gain returns."
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 7h16v10H4V7Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 11h2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            }
            onClick={() => choose("INVESTOR")}
          />

          <RoleCard
            title="Expert"
            desc="Share your knowledge. Mentor startups, consult, and contribute your industry insights."
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 18h0"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M9 9a3 3 0 1 1 6 0c0 2-3 2-3 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            }
            onClick={() => choose("EXPERT")}
          />
        </div>

        {err && (
          <div className="mx-auto mt-8 max-w-2xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        )}

        <p className="mt-16 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} InvestLink. All rights reserved.
        </p>
      </div>
    </div>
  );
}