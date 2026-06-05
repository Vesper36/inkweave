import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-6 w-6" style={{ color: "var(--accent)" }} />
              <span className="text-lg font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}>
                InkWeave
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              A structured narrative platform for creators and readers. Building digital libraries where stories breathe.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Browse</h3>
            <ul className="space-y-2">
              <li><Link href="/browse" className="text-sm hover:opacity-80" style={{ color: "var(--text-secondary)" }}>All Works</Link></li>
              <li><Link href="/tags" className="text-sm hover:opacity-80" style={{ color: "var(--text-secondary)" }}>Tags</Link></li>
              <li><Link href="/browse?sort=popular" className="text-sm hover:opacity-80" style={{ color: "var(--text-secondary)" }}>Popular</Link></li>
              <li><Link href="/browse?sort=recent" className="text-sm hover:opacity-80" style={{ color: "var(--text-secondary)" }}>Recent</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>For Creators</h3>
            <ul className="space-y-2">
              <li><Link href="/write" className="text-sm hover:opacity-80" style={{ color: "var(--text-secondary)" }}>Start Writing</Link></li>
              <li><Link href="/dashboard" className="text-sm hover:opacity-80" style={{ color: "var(--text-secondary)" }}>Dashboard</Link></li>
              <li><Link href="/guide" className="text-sm hover:opacity-80" style={{ color: "var(--text-secondary)" }}>Writing Guide</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>About</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm hover:opacity-80" style={{ color: "var(--text-secondary)" }}>About Us</Link></li>
              <li><Link href="/terms" className="text-sm hover:opacity-80" style={{ color: "var(--text-secondary)" }}>Terms</Link></li>
              <li><Link href="/privacy" className="text-sm hover:opacity-80" style={{ color: "var(--text-secondary)" }}>Privacy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center" style={{ borderColor: "var(--border)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            &copy; {new Date().getFullYear()} InkWeave. Built with care for creators and readers.
          </p>
        </div>
      </div>
    </footer>
  );
}
