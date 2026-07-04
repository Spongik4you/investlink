import { z } from "zod";

// Validăm variabilele de mediu O SINGURĂ DATĂ, la pornirea aplicației.
// Dacă lipsește ceva obligatoriu, aplicația nu pornește deloc — cu un mesaj
// clar despre ce lipsește — în loc să crape mai târziu, în mijlocul unui
// request, cu o eroare greu de urmărit (ex. Prisma "invalid connection string"
// aruncată de undeva din adâncul unei rute API).

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),

  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET lipsește din .env"),
  NEXTAUTH_URL: z.string().url(),

  // OAuth — opționale: dacă lipsesc, provider-ul respectiv e dezactivat
  // automat în src/lib/auth.ts, deci nu trebuie să blocheze pornirea.
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  LINKEDIN_CLIENT_ID: z.string().optional(),
  LINKEDIN_CLIENT_SECRET: z.string().optional(),

  STRIPE_SECRET_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const missing = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");

  throw new Error(
    `Variabile de mediu invalide sau lipsă în .env:\n${missing}\n\n` +
      `Verifică .env.example pentru lista completă.`,
  );
}

export const env = parsed.data;