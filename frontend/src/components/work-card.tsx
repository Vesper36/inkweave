import Link from "next/link";
import { BookOpen, Eye, Heart, Clock } from "lucide-react";
import { cn, formatDate, formatNumber, estimateReadTime } from "@/lib/utils";
import type { Work } from "@/lib/api";

interface WorkCardProps {
  work: Work;
  variant?: "default" | "featured" | "compact";
}

export function WorkCard({ work, variant = "default" }: WorkCardProps) {
  return (
    <Link
      href={`/work/${work.slug}`}
      className={cn(
        "group block rounded-xl border transition-all duration-200 hover:shadow-md",
        variant === "featured" && "md:flex"
      )}
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--bg-primary)",
        boxShadow: "0 1px 3px var(--shadow)",
      }}
    >
      {/* Cover */}
      <div
        className={cn(
          "relative overflow-hidden",
          variant === "featured" ? "md:w-48 md:flex-shrink-0" : "aspect-[3/4]",
          variant === "compact" && "aspect-square"
        )}
        style={{ backgroundColor: "var(--bg-tertiary)" }}
      >
        {work.cover_url ? (
          <img
            src={work.cover_url}
            alt={work.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen className="h-12 w-12" style={{ color: "var(--text-muted)" }} />
          </div>
        )}
        {/* Rating Badge */}
        {work.rating !== "general" && (
          <span
            className="absolute top-2 right-2 rounded-md px-1.5 py-0.5 text-xs font-medium"
            style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}
          >
            {work.rating === "mature" ? "18+" : "PG-13"}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3
          className="font-semibold leading-tight transition-colors group-hover:opacity-80 line-clamp-2"
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}
        >
          {work.title}
        </h3>

        {work.description && variant !== "compact" && (
          <p className="mt-2 text-sm leading-relaxed line-clamp-2" style={{ color: "var(--text-muted)" }}>
            {work.description}
          </p>
        )}

        {work.content_warning && (
          <span
            className="mt-2 inline-block rounded-md px-2 py-0.5 text-xs"
            style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-muted)" }}
          >
            CW: {work.content_warning}
          </span>
        )}

        <div className="mt-3 flex items-center gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {formatNumber(work.view_count)}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            {formatNumber(work.favorite_count)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {formatDate(work.updated_at)}
          </span>
        </div>
      </div>
    </Link>
  );
}
