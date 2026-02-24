import "../globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "InvestLink",
  description: "Where investors, startups and experts build the future together",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <div className="min-h-screen bg-white text-slate-900">
        <Navbar />
        <main className="px-4">{children}</main>
        <Footer />
      </div>
  );
}
