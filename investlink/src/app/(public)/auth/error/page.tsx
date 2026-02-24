export default function AuthErrorPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="text-2xl font-bold">Auth error</h1>
      <p className="mt-2 text-slate-600">
        Cod eroare: <span className="font-mono">{searchParams?.error ?? "unknown"}</span>
      </p>
      <p className="mt-4 text-sm text-slate-500">
        Dacă vezi <b>CredentialsSignin</b>, înseamnă email/parolă greșite sau user fără passwordHash.
      </p>
    </div>
  );
}
