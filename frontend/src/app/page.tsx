"use client";

import Link from "next/link";
import { BookOpen, PenLine, Search, Sparkles, ArrowRight, TrendingUp, Star } from "lucide-react";
import { WorkCard } from "@/components/work-card";
import type { Work } from "@/lib/api";

// Mock data for development
const mockWorks: Work[] = [
  {
    id: "1", author_id: "a1", title: "最后的算法", slug: "the-last-algorithm",
    description: "在一个由代码塑造的现实世界里，一位程序员发现了终极函数 -- 一个可以重写存在本身的秘密。",
    cover_url: null, status: "published", word_count: 128000, view_count: 15200,
    favorite_count: 3400, content_warning: null, rating: "general", language: "en",
    created_at: "2025-12-01T00:00:00Z", updated_at: "2026-06-01T00:00:00Z", published_at: "2025-12-15T00:00:00Z",
  },
  {
    id: "2", author_id: "a2", title: "星落编年史 第三卷", slug: "starfall-chronicles-v3",
    description: "备受喜爱的科幻传奇续篇。李指挥官在猎户臂之外面临她最大的挑战。",
    cover_url: null, status: "published", word_count: 95000, view_count: 8700,
    favorite_count: 2100, content_warning: "violence", rating: "teen", language: "zh-CN",
    created_at: "2026-01-15T00:00:00Z", updated_at: "2026-05-28T00:00:00Z", published_at: "2026-02-01T00:00:00Z",
  },
  {
    id: "3", author_id: "a3", title: "午夜花园", slug: "midnight-garden",
    description: "一部维多利亚时代英格兰的哥特式浪漫。秘密在一座古老庄园的阴影中悄然绽放。",
    cover_url: null, status: "published", word_count: 67000, view_count: 5400,
    favorite_count: 1800, content_warning: null, rating: "mature", language: "en",
    created_at: "2026-03-01T00:00:00Z", updated_at: "2026-05-20T00:00:00Z", published_at: "2026-03-10T00:00:00Z",
  },
  {
    id: "4", author_id: "a4", title: "量子茶道", slug: "quantum-tea-ceremony",
    description: "当量子物理遇见日本传统美学。一位物理学家发现茶道中蕴含量子相干性的密钥。",
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
            <span>为创作者与读者而生的结构化叙事平台</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
            style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}
          >
            让故事
            <br />
            <span style={{ color: "var(--accent)" }}>找到它们的栖息地</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            墨织为你的故事提供它应得的叙事结构 -- 卷册目录、章节管理、多主题阅读引擎，以及尊重创作与读者的沉浸式阅读体验。
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "var(--accent)" }}
            >
              <Search className="h-4 w-4" />
              开始阅读
            </Link>
            <Link
              href="/write"
              className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-semibold transition-all hover:opacity-80"
              style={{ borderColor: "var(--border)", color: "var(--text-primary)", backgroundColor: "var(--bg-primary)" }}
            >
              <PenLine className="h-4 w-4" />
              开始写作
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
                热门趋势
              </h2>
            </div>
            <Link href="/browse?sort=popular" className="flex items-center gap-1 text-sm font-medium" style={{ color: "var(--accent)" }}>
              查看全部 <ArrowRight className="h-4 w-4" />
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
              为长篇小说而生
            </h2>
            <p className="mt-3 text-base max-w-xl mx-auto" style={{ color: "var(--text-muted)" }}>
              每一个功能都为叙事的完整性而精心设计。
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: BookOpen,
                title: "卷册结构管理",
                desc: "将作品组织为卷与章，支持拖拽排序、批量操作、跨卷引用，让长篇创作井井有条。",
              },
              {
                icon: Sparkles,
                title: "多主题阅读引擎",
                desc: "羊皮纸、深夜黑、护眼绿等多套主题，阅读偏好跨设备云端同步，为长时间沉浸阅读调校的排版。",
              },
              {
                icon: Star,
                title: "富媒体内容支持",
                desc: "Markdown 基底 + 安全 HTML/CSS/JS 嵌入。代码高亮、可折叠注释、沙箱隔离的交互元素。",
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
            准备好开始了么？
          </h2>
          <p className="mt-4 text-base max-w-lg mx-auto" style={{ color: "var(--text-muted)" }}>
            无论是写作还是阅读，你的下一篇故事正在等待。
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "var(--accent)" }}
            >
              注册账号
            </Link>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 text-sm font-medium"
              style={{ color: "var(--accent)" }}
            >
              游客浏览 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
