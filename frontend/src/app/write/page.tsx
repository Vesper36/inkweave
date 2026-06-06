"use client";

import { PenLine, BookOpen, FileText, Code2 } from "lucide-react";
import Link from "next/link";

export default function WritePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}
        >
          写作
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
          创作与管理你的作品。
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-10">
        <Link
          href="/write/editor"
          className="flex items-center gap-4 rounded-xl border p-6 text-left transition-all hover:shadow-md"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-primary)" }}
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg"
            style={{ backgroundColor: "var(--accent-soft)" }}
          >
            <Code2 className="h-6 w-6" style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>MDX 编辑器</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Markdown 实时预览编辑</p>
          </div>
        </Link>

        <button
          className="flex items-center gap-4 rounded-xl border p-6 text-left transition-all hover:shadow-md"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-primary)" }}
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg"
            style={{ backgroundColor: "var(--accent-soft)" }}
          >
            <PenLine className="h-6 w-6" style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>新建作品</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>从零开始创作一个新故事</p>
          </div>
        </button>

        <button
          className="flex items-center gap-4 rounded-xl border p-6 text-left transition-all hover:shadow-md"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-primary)" }}
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg"
            style={{ backgroundColor: "var(--accent-soft)" }}
          >
            <FileText className="h-6 w-6" style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>导入文档</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>从 Markdown 或 DOCX 导入</p>
          </div>
        </button>
      </div>

      {/* Recent Drafts */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          最近草稿
        </h2>
        <div
          className="rounded-xl border p-6 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}
        >
          <BookOpen className="h-10 w-10 mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            使用 MDX 编辑器写作后，草稿将自动保存在此处。
          </p>
          <Link
            href="/write/editor"
            className="inline-flex items-center gap-2 mt-4 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <Code2 className="h-4 w-4" />
            打开编辑器
          </Link>
        </div>
      </div>

      {/* My Works (Placeholder) */}
      <div
        className="rounded-xl border p-8 text-center"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}
      >
        <BookOpen className="h-12 w-12 mx-auto mb-4" style={{ color: "var(--text-muted)" }} />
        <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
          我的作品
        </h3>
        <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          登录后即可查看你的作品并开始创作。
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: "var(--accent)" }}
        >
          登录
        </Link>
      </div>
    </div>
  );
}
