"use client";

import Link from "next/link";
import { Tag as TagIcon } from "lucide-react";

const mockTags = [
  { id: "1", name: "Sci-Fi", slug: "sci-fi", color: "#6366f1", category: "genre", usage_count: 120 },
  { id: "2", name: "Fantasy", slug: "fantasy", color: "#8b5cf6", category: "genre", usage_count: 95 },
  { id: "3", name: "Romance", slug: "romance", color: "#ec4899", category: "genre", usage_count: 88 },
  { id: "4", name: "Mystery", slug: "mystery", color: "#f59e0b", category: "genre", usage_count: 67 },
  { id: "5", name: "Horror", slug: "horror", color: "#ef4444", category: "genre", usage_count: 45 },
  { id: "6", name: "AI", slug: "ai", color: "#06b6d4", category: "theme", usage_count: 89 },
  { id: "7", name: "Time Travel", slug: "time-travel", color: "#10b981", category: "theme", usage_count: 56 },
  { id: "8", name: "Found Family", slug: "found-family", color: "#f97316", category: "trope", usage_count: 78 },
  { id: "9", name: "Enemies to Lovers", slug: "enemies-to-lovers", color: "#e11d48", category: "trope", usage_count: 92 },
  { id: "10", name: "Slow Burn", slug: "slow-burn", color: "#d97706", category: "trope", usage_count: 64 },
  { id: "11", name: "Cyberpunk", slug: "cyberpunk", color: "#7c3aed", category: "genre", usage_count: 38 },
  { id: "12", name: "Historical", slug: "historical", color: "#92400e", category: "genre", usage_count: 41 },
];

const categories = ["genre", "theme", "trope"];

export default function TagsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}>
          Tags
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
          Browse works by tags -- genres, themes, tropes, and more.
        </p>
      </div>

      {categories.map((category) => {
        const categoryTags = mockTags.filter((t) => t.category === category);
        if (categoryTags.length === 0) return null;

        return (
          <div key={category} className="mb-10">
            <h2
              className="text-lg font-semibold capitalize mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              {category}
            </h2>
            <div className="flex flex-wrap gap-3">
              {categoryTags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/browse?tag=${tag.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all hover:opacity-80 hover:shadow-sm"
                  style={{
                    borderColor: `${tag.color}30`,
                    color: tag.color,
                    backgroundColor: `${tag.color}08`,
                  }}
                >
                  <TagIcon className="h-3.5 w-3.5" />
                  {tag.name}
                  <span className="text-xs opacity-60">{tag.usage_count}</span>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
