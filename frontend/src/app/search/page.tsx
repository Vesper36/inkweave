"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search, BookOpen, FileText, Eye, Heart,
  Filter, X, Loader2, ChevronLeft, ChevronRight,
} from "lucide-react";
import { searchApi, type SearchHit, type SearchResults } from "@/lib/api";
import { formatNumber } from "@/lib/utils";

const ratingLabels: Record<string, string> = {
  general: "全年龄",
  teen: "青少年",
  mature: "成人",
};

const sortOptions = [
  { value: "", label: "相关度" },
  { value: "updated_at:desc", label: "最近更新" },
  { value: "view_count:desc", label: "最多阅读" },
  { value: "favorite_count:desc", label: "最多收藏" },
  { value: "word_count:desc", label: "最多字数" },
];

type SearchType = "all" | "works" | "chapters";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState<SearchType>("all");
  const [page, setPage] = useState(1);
  const [rating, setRating] = useState("");
  const [sort, setSort] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(
    async (q: string, p: number) => {
      if (!q.trim()) {
        setResults(null);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const data = await searchApi.search({
          q: q.trim(),
          type: searchType,
          page: p,
          page_size: 20,
          rating: rating || undefined,
          sort: sort || undefined,
          status: "published",
        });
        setResults(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "搜索失败，请稍后重试");
      } finally {
        setLoading(false);
      }
    },
    [searchType, rating, sort]
  );

  // Initial search on mount
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery); doSearch(initialQuery, 1);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-search when filters change
  useEffect(() => {
    if (query.trim()) {
      setPage(1);
      doSearch(query, 1);
    }
  }, [searchType, rating, sort]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim()) {
        setPage(1);
        doSearch(value, 1);
        const sp = new URLSearchParams();
        sp.set("q", value.trim());
        router.replace(`/search?${sp.toString()}`, { scroll: false });
      }
    }, 400);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    doSearch(query, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = results
    ? Math.ceil((results.works?.total_hits || 0) / 20)
    : 0;

  function renderHighlighted(text: string | undefined) {
    if (!text) return null;
    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  }

  function renderWorkHit(hit: SearchHit, idx: number) {
    return (
      <Link
        key={hit.id || idx}
        href={`/work/${hit.slug}`}
        className="block rounded-xl border p-5 transition-all hover:shadow-md"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-primary)" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="h-4 w-4 flex-shrink-0" style={{ color: "var(--accent)" }} />
              <h3
                className="font-semibold truncate"
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}
              >
                {hit._formatted?.title ? renderHighlighted(hit._formatted.title) : hit.title}
              </h3>
              {hit.rating && hit.rating !== "general" && (
                <span
                  className="flex-shrink-0 rounded px-1.5 py-0.5 text-xs"
                  style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}
                >
                  {ratingLabels[hit.rating] || hit.rating}
                </span>
              )}
            </div>

            {(hit._formatted?.description || hit.description) && (
              <p
                className="text-sm line-clamp-2 mb-2"
                style={{ color: "var(--text-secondary)" }}
                dangerouslySetInnerHTML={{
                  __html: hit._formatted?.description || hit.description || "",
                }}
              />
            )}

            <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
              {hit.author_name && <span>{hit.author_name}</span>}
              {hit.word_count != null && (
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {formatNumber(hit.word_count)} 字
                </span>
              )}
              {hit.view_count != null && (
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {formatNumber(hit.view_count)}
                </span>
              )}
              {hit.favorite_count != null && (
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {formatNumber(hit.favorite_count)}
                </span>
              )}
            </div>

            {hit.tags && hit.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {hit.tags.slice(0, 5).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full px-2 py-0.5 text-xs"
                    style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  function renderChapterHit(hit: SearchHit, idx: number) {
    return (
      <Link
        key={hit.id || idx}
        href={`/work/${hit.work_slug || ""}/chapter/${hit.slug || ""}`}
        className="block rounded-xl border p-5 transition-all hover:shadow-md"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-primary)" }}
      >
        <div className="flex items-center gap-2 mb-1">
          <FileText className="h-4 w-4 flex-shrink-0" style={{ color: "var(--accent)" }} />
          <h3 className="font-medium" style={{ color: "var(--text-primary)" }}>
            {hit._formatted?.title ? renderHighlighted(hit._formatted.title) : hit.title}
          </h3>
        </div>
        {hit._formatted?.content_text && (
          <p
            className="text-sm line-clamp-3 mb-2"
            style={{ color: "var(--text-secondary)" }}
            dangerouslySetInnerHTML={{ __html: hit._formatted.content_text }}
          />
        )}
        <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
          {hit.work_title && <span>出自: {hit.work_title}</span>}
          {hit.author_name && <span>{hit.author_name}</span>}
          {hit.word_count != null && <span>{formatNumber(hit.word_count)} 字</span>}
        </div>
      </Link>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Input */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: "var(--text-muted)" }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="搜索作品、标签、作者..."
            autoFocus
            className="w-full rounded-xl border py-3.5 pl-12 pr-12 text-base outline-none transition-colors focus:ring-2"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
              "--tw-ring-color": "var(--accent)",
            } as React.CSSProperties}
          />
          {query && (
            <button
              onClick={() => { setQuery(""); setResults(null); inputRef.current?.focus(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-muted)" }}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center border rounded-lg overflow-hidden" style={{ borderColor: "var(--border)" }}>
          {([
            { type: "all" as const, label: "全部" },
            { type: "works" as const, label: "作品" },
            { type: "chapters" as const, label: "章节" },
          ]).map((item) => (
            <button
              key={item.type}
              onClick={() => setSearchType(item.type)}
              className="px-3 py-1.5 transition-colors"
              style={{
                backgroundColor: searchType === item.type ? "var(--accent-soft)" : "transparent",
                color: searchType === item.type ? "var(--accent)" : "var(--text-muted)",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-lg border px-3 py-1.5 text-xs outline-none"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)" }}
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
          style={{
            borderColor: "var(--border)",
            backgroundColor: showFilters ? "var(--accent-soft)" : "transparent",
            color: showFilters ? "var(--accent)" : "var(--text-muted)",
          }}
        >
          <Filter className="h-3.5 w-3.5" />
          筛选
        </button>

        {results && !loading && (
          <span className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>
            找到 {results.total} 个结果
          </span>
        )}
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="mb-6 rounded-xl border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}>
          <div className="flex flex-wrap gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>分级</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="rounded-lg border px-3 py-1.5 text-xs outline-none"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
              >
                <option value="">全部</option>
                <option value="general">全年龄</option>
                <option value="teen">青少年</option>
                <option value="mature">成人</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin" style={{ color: "var(--accent)" }} />
          <span className="ml-2 text-sm" style={{ color: "var(--text-muted)" }}>搜索中...</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border p-6 text-center" style={{ borderColor: "var(--border)", backgroundColor: "" }}>
          <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>
        </div>
      )}

      {/* Results */}
      {!loading && !error && results && (
        <div className="space-y-8">
          {results.works && results.works.hits.length > 0 && (
            <div>
              {searchType === "all" && (
                <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>
                  作品 ({results.works.total_hits})
                </h2>
              )}
              <div className="space-y-3">
                {results.works.hits.map((hit, i) => renderWorkHit(hit, i))}
              </div>
            </div>
          )}

          {results.chapters && results.chapters.hits.length > 0 && (
            <div>
              {searchType === "all" && (
                <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>
                  章节 ({results.chapters.total_hits})
                </h2>
              )}
              <div className="space-y-3">
                {results.chapters.hits.map((hit, i) => renderChapterHit(hit, i))}
              </div>
            </div>
          )}

          {results.total === 0 && (
            <div className="rounded-xl border p-12 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}>
              <Search className="h-12 w-12 mx-auto mb-4" style={{ color: "var(--text-muted)" }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>未找到相关结果</h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>试试换个关键词，或调整筛选条件。</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-40"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                上一页
              </button>
              <span className="text-xs px-3" style={{ color: "var(--text-muted)" }}>{page} / {totalPages}</span><button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-40"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
              >
                下一页
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && !results && !error && (
        <div className="rounded-xl border p-12 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}>
          <Search className="h-16 w-16 mx-auto mb-4" style={{ color: "var(--text-muted)" }} />
          <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>搜索作品与章节</h3>
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>输入关键词开始搜索，支持标题、内容、标签、作者名。</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["科幻", "奇幻", "言情", "悬疑"].map((tag) => (
              <button
                key={tag}
                onClick={() => handleInputChange(tag)}
                className="rounded-full border px-3 py-1 text-xs transition-colors hover:opacity-80"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
