"use client";

import { useState } from "react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { WorkCard } from "@/components/work-card";
import type { Work } from "@/lib/api";

const mockWorks: Work[] = [
  {
    id: "1", author_id: "a1", title: "The Last Algorithm", slug: "the-last-algorithm",
    description: "In a world where code shapes reality, one programmer discovers the ultimate function.",
    cover_url: null, status: "published", word_count: 128000, view_count: 15200,
    favorite_count: 3400, content_warning: null, rating: "general", language: "en",
    created_at: "2025-12-01T00:00:00Z", updated_at: "2026-06-01T00:00:00Z", published_at: "2025-12-15T00:00:00Z",
  },
  {
    id: "2", author_id: "a2", title: "Starfall Chronicles: Volume 3", slug: "starfall-chronicles-v3",
    description: "Commander Li faces her greatest challenge yet beyond the Orion Arm.",
    cover_url: null, status: "published", word_count: 95000, view_count: 8700,
    favorite_count: 2100, content_warning: "violence", rating: "teen", language: "zh-CN",
    created_at: "2026-01-15T00:00:00Z", updated_at: "2026-05-28T00:00:00Z", published_at: "2026-02-01T00:00:00Z",
  },
  {
    id: "3", author_id: "a3", title: "Midnight Garden", slug: "midnight-garden",
    description: "A gothic romance set in Victorian England. Secrets bloom in the shadows.",
    cover_url: null, status: "published", word_count: 67000, view_count: 5400,
    favorite_count: 1800, content_warning: null, rating: "mature", language: "en",
    created_at: "2026-03-01T00:00:00Z", updated_at: "2026-05-20T00:00:00Z", published_at: "2026-03-10T00:00:00Z",
  },
  {
    id: "4", author_id: "a4", title: "Quantum Tea Ceremony", slug: "quantum-tea-ceremony",
    description: "Where quantum physics meets traditional Japanese aesthetics.",
    cover_url: null, status: "published", word_count: 42000, view_count: 3200,
    favorite_count: 890, content_warning: null, rating: "general", language: "zh-CN",
    created_at: "2026-04-10T00:00:00Z", updated_at: "2026-06-03T00:00:00Z", published_at: "2026-04-20T00:00:00Z",
  },
  {
    id: "5", author_id: "a5", title: "Echoes of the Void", slug: "echoes-of-the-void",
    description: "A deep space exploration narrative that questions the nature of consciousness.",
    cover_url: null, status: "published", word_count: 83000, view_count: 4100,
    favorite_count: 1200, content_warning: "psychological", rating: "teen", language: "en",
    created_at: "2026-02-20T00:00:00Z", updated_at: "2026-05-15T00:00:00Z", published_at: "2026-03-01T00:00:00Z",
  },
  {
    id: "6", author_id: "a6", title: "The Ink Mage Chronicles", slug: "ink-mage-chronicles",
    description: "In a world where tattoos grant magical powers, a young artist discovers she can ink the impossible.",
    cover_url: null, status: "published", word_count: 156000, view_count: 12800,
    favorite_count: 4500, content_warning: null, rating: "general", language: "zh-CN",
    created_at: "2025-11-01T00:00:00Z", updated_at: "2026-06-02T00:00:00Z", published_at: "2025-11-20T00:00:00Z",
  },
];

const sortOptions = [
  { value: "updated_at", label: "Recently Updated" },
  { value: "created_at", label: "Newest" },
  { value: "view_count", label: "Most Viewed" },
  { value: "favorite_count", label: "Most Favorited" },
];

const ratingFilters = [
  { value: "", label: "All Ratings" },
  { value: "general", label: "General" },
  { value: "teen", label: "Teen" },
  { value: "mature", label: "Mature" },
];

export default function BrowsePage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("updated_at");
  const [rating, setRating] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = mockWorks
    .filter((w) => {
      if (search && !w.title.toLowerCase().includes(search.toLowerCase()) && !w.description?.toLowerCase().includes(search.toLowerCase())) return false;
      if (rating && w.rating !== rating) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "view_count") return b.view_count - a.view_count;
      if (sort === "favorite_count") return b.favorite_count - a.favorite_count;
      return new Date(b[sort as keyof Work] as string).getTime() - new Date(a[sort as keyof Work] as string).getTime();
    });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}>
          Browse Works
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
          Discover stories across genres, fandoms, and styles.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Search by title, description, tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:ring-2"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
              }}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:opacity-80"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)", backgroundColor: "var(--bg-secondary)" }}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-4 rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Sort by</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-md border px-3 py-1.5 text-sm outline-none"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="rounded-md border px-3 py-1.5 text-sm outline-none"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
              >
                {ratingFilters.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-4 text-sm" style={{ color: "var(--text-muted)" }}>
        {filtered.length} work{filtered.length !== 1 ? "s" : ""} found
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((work) => (
          <WorkCard key={work.id} work={work} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-lg" style={{ color: "var(--text-muted)" }}>No works found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
