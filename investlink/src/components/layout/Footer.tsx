import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
        <Link href="/" className="group flex items-center gap-2 font-bold text-white">
          <div className="grid h-9 w-9 place-items-center rounded-md bg-blue-700 text-white
                        transition-transform duration-200 group-hover:scale-105" aria-hidden="true">
            <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.0"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* trending line */}
                <path d="M4 16l6-6 4 4 6-6" />
                {/* arrow corner */}
                <path d="M20 8v6" />
                <path d="M20 8h-6" />
              </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">InvestLink</span>
        </Link>
          <p className="mt-4 max-w-sm text-sm text-slate-300">
            Connecting investors, startups, and experts in a trusted global ecosystem.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Platform</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li><Link className="hover:text-white" href="/investors">For Investors</Link></li>
            <li><Link className="hover:text-white" href="/startups">For Startups</Link></li>
            <li><Link className="hover:text-white" href="/experts">For Experts</Link></li>
            <li><Link className="hover:text-white" href="/pricing">Pricing</Link></li>
          </ul>
        </div>

        {/* Coloanele Company și Legal au fost scoase: toate cele 8 link-uri
            duceau la href="#". Un link care nu duce nicăieri costă mai multă
            încredere decât absența lui. Se readaugă când paginile există. */}
        <div>
          <h4 className="text-sm font-semibold">Account</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li><Link className="hover:text-white" href="/auth/signin">Sign in</Link></li>
            <li><Link className="hover:text-white" href="/auth/signup">Create account</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 text-xs text-slate-400">
          <span>© {new Date().getFullYear()} InvestLink. All rights reserved.</span>
          <span>Built for trust • verification • scale</span>
        </div>
      </div>
    </footer>
  );
}
