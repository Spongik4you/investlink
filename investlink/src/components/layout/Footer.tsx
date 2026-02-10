import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 bg-slate-900 text-slate-200">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-5">
        <div className="md:col-span-2">
        <Link href="/" className="group flex items-center gap-2 font-bold text-slate-900">
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
          <span className="text-lg font-bold tracking-tight text-slate-900 text-white">InvestLink</span>
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

        <div>
          <h4 className="text-sm font-semibold">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li><Link className="hover:text-white" href="#">About</Link></li>
            <li><Link className="hover:text-white" href="#">Contact</Link></li>
            <li><Link className="hover:text-white" href="#">Careers</Link></li>
            <li><Link className="hover:text-white" href="#">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Legal</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li><Link className="hover:text-white" href="#">Terms</Link></li>
            <li><Link className="hover:text-white" href="#">Privacy</Link></li>
            <li><Link className="hover:text-white" href="#">Risk Disclosure</Link></li>
            <li><Link className="hover:text-white" href="#">Cookies</Link></li>
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
