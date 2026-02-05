import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 bg-slate-900 text-slate-200">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white">
              ↗
            </span>
            <span className="text-sm font-semibold">InvestLink</span>
          </div>
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
