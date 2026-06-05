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
                墨织
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              为创作者与读者而生的结构化叙事平台。让故事在合适的容器里自然生长。
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>发现</h3>
            <ul className="space-y-2">
              <li><Link href="/browse" className="text-sm hover:opacity-80" style={{ color: "var(--text-secondary)" }}>全部作品</Link></li>
              <li><Link href="/tags" className="text-sm hover:opacity-80" style={{ color: "var(--text-secondary)" }}>标签云</Link></li>
              <li><Link href="/browse?sort=popular" className="text-sm hover:opacity-80" style={{ color: "var(--text-secondary)" }}>热门排行</Link></li>
              <li><Link href="/browse?sort=recent" className="text-sm hover:opacity-80" style={{ color: "var(--text-secondary)" }}>最近更新</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>创作者</h3>
            <ul className="space-y-2">
              <li><Link href="/write" className="text-sm hover:opacity-80" style={{ color: "var(--text-secondary)" }}>开始写作</Link></li>
              <li><Link href="/dashboard" className="text-sm hover:opacity-80" style={{ color: "var(--text-secondary)" }}>工作台</Link></li>
              <li><Link href="/guide" className="text-sm hover:opacity-80" style={{ color: "var(--text-secondary)" }}>写作指南</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>关于</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm hover:opacity-80" style={{ color: "var(--text-secondary)" }}>关于我们</Link></li>
              <li><Link href="/terms" className="text-sm hover:opacity-80" style={{ color: "var(--text-secondary)" }}>服务条款</Link></li>
              <li><Link href="/privacy" className="text-sm hover:opacity-80" style={{ color: "var(--text-secondary)" }}>隐私政策</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center" style={{ borderColor: "var(--border)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            &copy; {new Date().getFullYear()} 墨织 InkWeave. 用心为创作者与读者构建。
          </p>
        </div>
      </div>
    </footer>
  );
}
