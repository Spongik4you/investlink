"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Field = {
  name: string;
  label: string;
  placeholder: string;
  type?: "text" | "number" | "textarea";
};

type Props = {
  role: "STARTUP" | "INVESTOR" | "EXPERT";
  title: string;
  description: string;
  fields: Field[];
  submitLabel: string;
  dashboardPath: string;
};

export function RoleOnboardingForm({
  role,
  title,
  description,
  fields,
  submitLabel,
  dashboardPath,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, ...payload }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error ?? "Nu am putut salva onboarding-ul.");
      setLoading(false);
      return;
    }

    router.push(dashboardPath);
    router.refresh();
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-600">{description}</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="text-sm font-medium text-slate-700">{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    placeholder={field.placeholder}
                    className="mt-1 h-24 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                ) : (
                  <input
                    name={field.name}
                    type={field.type ?? "text"}
                    placeholder={field.placeholder}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                )}
              </div>
            ))}

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Saving..." : submitLabel}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
