"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { BookOpen, Eye, Heart, Clock, ChevronRight, User } from "lucide-react";
import { formatDate, formatNumber, estimateReadTime } from "@/lib/utils";

// Mock data
const mockWork = {
  id: "1",
  title: "The Last Algorithm",
  slug: "the-last-algorithm",
  description: "In a world where code shapes reality, one programmer discovers the ultimate function -- one that could rewrite existence itself. Dr. Evelyn Lin's late-night experiments with floating-point residuals lead her to uncover the source code of the universe, but some discoveries come with costs that no paper publication could justify.",
  cover_url: null,
  status: "published",
  word_count: 128000,
  view_count: 15200,
  favorite_count: 3400,
  rating: "general",
  language: "en",
  created_at: "2025-12-01T00:00:00Z",
  updated_at: "2026-06-01T00:00:00Z",
  published_at: "2025-12-15T00:00:00Z",
  author: { id: "a1", display_name: "Evelyn Chen", username: "evelync" },
  tags: [
    { id: "1", name: "Sci-Fi", slug: "sci-fi", color: "#6366f1" },
    { id: "2", name: "AI", slug: "ai", color: "#06b6d4" },
    { id: "3", name: "Philosophy", slug: "philosophy", color: "#8b5cf6" },
  ],
  volumes: [
    {
      id: "v1", title: "Part I: The Source Code", sort_order: 0,
      chapters: [
        { id: "c1", title: "Chapter 1: Hello World", slug: "hello-world", word_count: 4200, status: "published", published_at: "2025-12-15T00:00:00Z" },
        { id: "c2", title: "Chapter 2: The First Variable", slug: "the-first-variable", word_count: 3800, status: "published", published_at: "2025-12-20T00:00:00Z" },
        { id: "c3", title: "Chapter 3: Recursive Dreams", slug: "recursive-dreams", word_count: 5100, status: "published", published_at: "2026-01-01T00:00:00Z" },
      ],
    },
    {
      id: "v2", title: "Part II: Compilation", sort_order: 1,
      chapters: [
        { id: "c4", title: "Chapter 4: Type Errors", slug: "type-errors", word_count: 4500, status: "published", published_at: "2026-01-15T00:00:00Z" },
        { id: "c5", title: "Chapter 5: The Stack Overflow", slug: "the-stack-overflow", word_count: 5800, status: "published", published_at: "2026-02-01T00:00:00Z" },
      ],
    },
  ],
};

export default function WorkDetailPage() {
  const params = useParams();
  const work = mockWork;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Work Header */}
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Cover Placeholder */}
          <div
            className="flex-shrink-0 w-40 h-56 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "var(--bg-tertiary)" }}
          >
            {work.cover_url ? (
              <img src={work.cover_url} alt={work.title} className="h-full w-full object-cover rounded-xl" />
            ) : (
              <BookOpen className="h-16 w-16" style={{ color: "var(--text-muted)" }} />
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}
            >
              {work.title}
            </h1>

            <div className="mt-3 flex items-center gap-3 text-sm" style={{ color: "var(--text-muted)" }}>
              <Link href={`/user/${work.author.username}`} className="flex items-center gap-1.5 hover:opacity-80" style={{ color: "var(--accent)" }}>
                <User className="h-4 w-4" />
                {work.author.display_name}
              </Link>
              <span>{work.rating !== "general" ? (work.rating === "mature" ? "18+" : "PG-13") : "General"}</span>
            </div>

            {work.description && (
              <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {work.description}
              </p>
            )}

            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {work.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/browse?tag=${tag.slug}`}
                  className="rounded-full px-3 py-1 text-xs font-medium transition-opacity hover:opacity-80"
                  style={{ backgroundColor: `${tag.color}15`, color: tag.color, border: `1px solid ${tag.color}30` }}
                >
                  {tag.name}
                </Link>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-5 flex items-center gap-5 text-sm" style={{ color: "var(--text-muted)" }}>
              <span className="flex items-center gap-1.5"><Eye className="h-4 w-4" />{formatNumber(work.view_count)}</span>
              <span className="flex items-center gap-1.5"><Heart className="h-4 w-4" />{formatNumber(work.favorite_count)}</span>
              <span>{formatNumber(work.word_count)} words</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />Updated {formatDate(work.updated_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <div
        className="rounded-xl border"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-primary)" }}
      >
        <div className="px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}>
            Table of Contents
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            {work.volumes.length} volumes, {work.volumes.reduce((sum, v) => sum + v.chapters.length, 0)} chapters
          </p>
        </div>

        {work.volumes.map((volume) => (
          <div key={volume.id}>
            <div
              className="px-6 py-3 border-b font-semibold text-sm"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)" }}
            >
              {volume.title}
              <span className="ml-2 font-normal" style={{ color: "var(--text-muted)" }}>
                ({volume.chapters.length} chapters)
              </span>
            </div>

            {volume.chapters.map((chapter, idx) => (
              <Link
                key={chapter.id}
                href={`/work/${work.slug}/chapter/${chapter.slug}`}
                className="flex items-center justify-between px-6 py-3 border-b transition-colors hover:opacity-80"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm tabular-nums" style={{ color: "var(--text-muted)", minWidth: "2rem" }}>
                    {idx + 1}.
                  </span>
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {chapter.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                  <span>{formatNumber(chapter.word_count)} words</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
