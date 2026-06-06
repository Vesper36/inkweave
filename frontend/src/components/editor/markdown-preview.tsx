"use client";

import { useMemo } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import rehypeParse from "rehype-parse";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export function MarkdownPreview({ content, className = "" }: MarkdownPreviewProps) {
  const html = useMemo(() => {
    if (!content.trim()) return "";

    try {
      // Step 1: Markdown → HTML (with GFM support)
      const mdResult = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkHtml, { sanitize: false })
        .processSync(content);

      let htmlStr = String(mdResult);

      // Step 2: Rehype pipeline (raw HTML support + syntax highlighting)
      const rehypeResult = unified()
        .use(rehypeParse, { fragment: true })
        .use(rehypeRaw)
        .use(rehypeHighlight)
        .use(rehypeStringify)
        .processSync(htmlStr);

      return String(rehypeResult);
    } catch {
      return `<p style="color: var(--text-muted)">预览渲染出错，请检查 Markdown 语法。</p>`;
    }
  }, [content]);

  if (!content.trim()) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`} style={{ color: "var(--text-muted)" }}>
        <p className="text-sm">开始输入内容后，这里将显示实时预览...</p>
      </div>
    );
  }

  return (
    <div
      className={`prose-reading overflow-auto h-full ${className}`}
      style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
