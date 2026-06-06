"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Menu, X, BookOpen, PenLine, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "@/components/theme-switcher";

export function Header() {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = useCallback(() => {
    const q = searchQuery.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
      setSearchOpen(false);
    }
  }, [searchQuery, router]);

  return (
    <header className="sticky top-0 z-50 border-b" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-primary)", backdropFilter: "blur(12px)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-7 w-7" style={{ color: "var(--accent)" }} />
            <span className="text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}>
              墨织
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/browse" className="text-sm font-medium transition-colors hover:opacity-80" style={{ color: "var(--text-secondary)" }}>
              发现
            </Link>
            <Link href="/tags" className="text-sm font-medium transition-colors hover:opacity-80" style={{ color: "var(--text-secondary)" }}>
              标签
            </Link>
            <Link href="/write" className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-80" style={{ color: "var(--accent)" }}>
              <PenLine className="h-4 w-4" />
              写作
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="rounded-lg p-2 transition-colors hover:opacity-80"
              style={{ color: "var(--text-secondary)" }}
              aria-label="Toggle search"
            >
              <Search className="h-5 w-5" />
            </button>

            <ThemeSwitcher />

            {/* User Avatar Placeholder */}
            <button
              className="rounded-full p-1.5 transition-colors hover:opacity-80"
              style={{ color: "var(--text-secondary)", backgroundColor: "var(--bg-tertiary)" }}
              aria-label="User menu"
            >
              <User className="h-5 w-5" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-lg p-2 transition-colors"
              style={{ color: "var(--text-secondary)" }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--text-muted)" }} />
              <input
                type="text"
                placeholder="搜索作品、标签、作者..."
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                className="w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:ring-2"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  "--tw-ring-color": "var(--accent)",
                } as React.CSSProperties}
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t pb-4 pt-3 space-y-2" style={{ borderColor: "var(--border)" }}>
            <Link href="/browse" className="block px-3 py-2 text-sm font-medium rounded-lg" style={{ color: "var(--text-secondary)" }} onClick={() => setMobileMenuOpen(false)}>
              发现
            </Link>
            <Link href="/tags" className="block px-3 py-2 text-sm font-medium rounded-lg" style={{ color: "var(--text-secondary)" }} onClick={() => setMobileMenuOpen(false)}>
              标签
            </Link>
            <Link href="/write" className="block px-3 py-2 text-sm font-medium rounded-lg" style={{ color: "var(--accent)" }} onClick={() => setMobileMenuOpen(false)}>
              写作
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
