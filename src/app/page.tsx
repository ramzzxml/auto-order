import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex-grow flex flex-col justify-center items-center px-6 py-24 text-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto space-y-6">
        <span className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary bg-blue-50 rounded-full border border-blue-200">
          Enterprise Workflow Automation Engine
        </span>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">
          Automated Catchmail Verification with <span className="text-primary">Instant PayQRIS Payments</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Deploy premium catchmail account automation nodes with precise execution control, real-time analytics dashboards, and instant localized credit infrastructure scaling.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link href="/login" className="px-6 py-3 bg-primary text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 transition">
            Access Command Portal
          </Link>
          <a href="#architecture" className="px-6 py-3 bg-white text-slate-700 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition">
            Review API Specs
          </a>
        </div>
      </div>

      <div id="architecture" className="max-w-5xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Automated Forwarding Execution</h3>
          <p className="text-slate-600 text-sm">Proxy high frequency configurations directly into the premium routing cluster. Multi-threaded infrastructure processes tasks inside tight execution bounds.</p>
        </div>
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Catchmail Verification Linkers</h3>
          <p className="text-slate-600 text-sm">Our system automatically parses email structures on the backend via Catchmail setups, pulling verification fields out instantly with zero browser overhead.</p>
        </div>
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-2">PayQRIS Credit Infrastructure</h3>
          <p className="text-slate-600 text-sm">Top-up ledger pipelines run automatically through PayQRIS backend polling. Credits lock into balance accounts within fractions of a second.</p>
        </div>
      </div>
    </div>
  );
}
