export async function register() {
  // Rulează o singură dată, la pornirea serverului Next.js (nu în browser).
  // Doar importul declanșează validarea Zod din env.ts — dacă lipsește
  // o variabilă obligatorie, aplicația nu pornește deloc.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("@/lib/env");
  }
}