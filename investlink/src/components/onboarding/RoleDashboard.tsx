import Link from "next/link";

type Props = {
  roleLabel: string;
};

export function RoleDashboard({ roleLabel }: Props) {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-blue-600">Dashboard</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">{roleLabel} workspace</h1>
          <p className="mt-2 text-sm text-slate-600">
            Onboarding complet. Următorul pas este să adăugăm modulele dedicate (matches, messaging, billing).
          </p>

          <div className="mt-5">
            <Link href="/" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
