"use client";

import Link from "next/link";
import { BookOpen, PenLine, Search, Sparkles, ArrowRight, TrendingUp, Star } from "lucide-react";
import { WorkCard } from "@/components/work-card";
import type { Work } from "@/lib/api";

// Mock data for development
const mockWorks: Work[] = [
  {
    id: "1", author_id: "a1", title: "The Last Algorithm", slug: "the-last-algorithm",
    description: "In a world where code shapes reality, one programmer discovers the ultimate function -- one that could rewrite existence itself.",
    cover_url: null, status: "published", word_count: 128000, view_count: 15200,
    favorite_count: 3400, content_warning: null, rating: "general", language: "en",
    created_at: "2025-12-01T00:00:00Z", updated_at: "2026-06-01T00:00:00Z", published_at: "2025-12-15T00:00:00Z",
  },
  {
    id: "2", author_id: "a2", title: "Starfall Chronicles: Volume 3", slug: "starfall-chronicles-v3",
    description: "The continuation of the beloved sci-fi saga. Commander Li faces her greatest challenge yet beyond the Orion Arm.",
    cover_url: null, status: "published", word_count: 95000, view_count: 8700,
    favorite_count: 2100, content_warning: "violence", rating: "teen", language: "zh-CN",
    created_at: "2026-01-15T00:00:00Z", updated_at: "2026-05-28T00:00:00Z", published_at: "2026-02-01T00:00:00Z",
  },
  {
    id: "3", author_id: "a3", title: "Midnight Garden", slug: "midnight-garden",
    description: "A gothic romance set in Victorian England. Secrets bloom in the shadows of an ancient estate.",
    cover_url: null, status: "published", word_count: 67000, view_count: 5400,
    favorite_count: 1800, content_warning: null, rating: "mature", language: "en",
    created_at: "2026-03-01T00:00:00Z", updated_at: "2026-05-20T00:00:00Z", published_at: "2026-03-10T00:00:00Z",
  },
  {
    id: "4", author_id: "a4", title: "Quantum Tea Ceremony", slug: "quantum-tea-ceremony",
    description: "Where quantum physics meets traditional Japanese aesthetics. A physicist discovers that tea ceremonies hold the key to quantum coherence.",
    cover_url: null, status: "published", word_count: 42000, view_count: 3200,
    favorite_count: 890, content_warning: null, rating: "general", language: "zh-CN",
    created_at: "2026-04-10T00:00:00Z", updated_at: "2026-06-03T00:00:00Z", published_at: "2026-04-20T00:00:00Z",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative overflow-hidden py-20 sm:py-28 lg:py-36"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm mb-6"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)", backgroundColor: "var(--bg-primary)" }}>
            <Sparkles className="h-4 w-4" style={{ color: "var(--accent)" }} />
            <span>A structured narrative platform</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
            style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}
          >
            Where Stories
            <br />
            <span style={{ color: "var(--accent)" }}>Find Their Form</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            InkWeave gives your stories the structure they deserve -- volumes, chapters, themes, and a reading experience that respects both the craft and the reader.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "var(--accent)" }}
            >
              <Search className="h-4 w-4" />
              Start Reading
            </Link>
            <Link
              href="/write"
              className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-semibold transition-all hover:opacity-80"
              style={{ borderColor: "var(--border)", color: "var(--text-primary)", backgroundColor: "var(--bg-primary)" }}
            >
              <PenLine className="h-4 w-4" />
              Start Writing
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Works */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5" style={{ color: "var(--accent)" }} />
              <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}>
                Trending Now
              </h2>
            </div>
            <Link href="/browse?sort=popular" className="flex items-center gap-1 text-sm font-medium" style={{ color: "var(--accent)" }}>
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {mockWorks.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}>
              Built for Long-Form Storytelling
            </h2>
            <p className="mt-3 text-base max-w-xl mx-auto" style={{ color: "var(--text-muted)" }}>
              Every feature designed to honor the structure of your stories.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: BookOpen,
                title: "Volume & Chapter Structure",
                desc: "Organize your work into volumes and chapters with drag-and-drop sorting, batch operations, and cross-volume references.",
              },
              {
                icon: Sparkles,
                title: "Multi-Theme Reading Engine",
                desc: "Parchment, midnight, eye-care, and more. Reader preferences sync across devices. Typography tuned for long sessions.",
              },
              {
                icon: Star,
                title: "Rich Content Support",
                desc: "Markdown foundation with safe HTML/CSS/JS embedding. Code highlighting, collapsible annotations, interactive elements in sandboxed rendering.",
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-xl border p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-primary)" }}>
                <feature.icon className="h-8 w-8 mb-4" style={{ color: "var(--accent)" }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}>
            Ready to Begin?
          </h2>
          <p className="mt-4 text-base max-w-lg mx-auto" style={{ color: "var(--text-muted)" }}>
            Whether you write or read, your next story is waiting.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "var(--accent)" }}
            >
              Create Account
            </Link>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 text-sm font-medium"
              style={{ color: "var(--accent)" }}
            >
              Browse as Guest <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
