"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Settings, X, BookOpen, ArrowUp } from "lucide-react";
import { useReaderStore } from "@/stores";
import { formatDate, formatNumber } from "@/lib/utils";

// Mock chapter data
const mockChapter = {
  id: "c1",
  title: "Chapter 1: Hello World",
  slug: "hello-world",
  word_count: 4200,
  author_note: "This is where it all begins. I wrote this chapter at 3am, fueled by nothing but instant coffee and the conviction that every great story starts with a single line of code.",
  content_html: `
    <p>The cursor blinked on an empty screen -- a single, patient pulse of light in the darkness of Dr. Lin's office at 2:47 AM. She had been staring at it for forty-three minutes, though anyone watching would have thought she was simply sleeping with her eyes open.</p>
    <p>But Dr. Evelyn Lin never slept. Not anymore.</p>
    <p>The terminal displayed nothing unusual: a standard POSIX shell, a blinking cursor, the soft hum of a machine waiting for instruction. It was the same terminal she had used ten thousand times. The same keyboard. The same desk.</p>
    <p>Everything was the same, and yet tonight, something was <em>different</em>.</p>
    <h2>The Discovery</h2>
    <p>She had found it in the residuals -- the tiny rounding errors that accumulated when floating-point operations cascaded through billions of iterations. Everyone else dismissed them as noise. Evelyn saw patterns.</p>
    <blockquote>The universe, she suspected, was not written in mathematics. It was written in code. And like all code, it had bugs.</blockquote>
    <p>She began to type:</p>
    <pre><code>fn reality_check() -> Result&lt;Universe, Error&gt; {
    let constants = PhysicalConstants::load()?;
    let fine_structure = constants.alpha();

    // The fine-structure constant should be dimensionless
    // but what if it's actually a pointer?
    let ptr = fine_structure as *const Reality;

    unsafe {
        match ptr.as_ref() {
            Some(r) =&gt; Ok(r.clone()),
            None =&gt; Err(Error::SimulationBoundary),
        }
    }
}</code></pre>
    <p>The code compiled on the first try. It should not have compiled.</p>
    <p>Evelyn leaned back in her chair, the leather creaking in the silence. The return value was not what she expected. It was not an error. It was not a crash.</p>
    <p>It was a <code>Reality</code> object with a field she had never seen before: <code>author: "unknown"</code>.</p>
    <h2>Questions Without Answers</h2>
    <p>She saved the output to a file named <code>truth.txt</code>, then immediately deleted it. Some things, she decided, were better left unsaved. Some discoveries came with costs that no paper publication could justify.</p>
    <p>But the cursor kept blinking. Patient. Waiting. As if the machine itself knew that she would type again -- that once you see the source code of reality, you cannot simply close the terminal.</p>
    <details>
      <summary>Author's Note</summary>
      <p>This chapter was inspired by the fine-tuning problem in physics. The fine-structure constant (approximately 1/137) is one of the most precisely measured quantities in physics, and nobody knows why it has the value it does. What if the answer is simpler -- and more terrifying -- than we imagine?</p>
    </details>
  `,
  prev_chapter: null as { title: string; slug: string } | null,
  next_chapter: { title: "Chapter 2: The First Variable", slug: "the-first-variable" } as { title: string; slug: string } | null,
  work: { title: "The Last Algorithm", slug: "the-last-algorithm" },
  volume: { title: "Part I: The Source Code" },
};

export default function ChapterPage() {
  const params = useParams();
  const chapter = mockChapter;
  const { fontSize, lineHeight, setFontSize, setLineHeight } = useReaderStore();
  const [showSettings, setShowSettings] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    setReadProgress(progress);
    setShowScrollTop(scrollTop > 500);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="reading-progress" style={{ width: `${readProgress}%` }} />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Chapter Header */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm mb-4" style={{ color: "var(--text-muted)" }}>
            <Link href={`/work/${chapter.work.slug}`} className="hover:opacity-80" style={{ color: "var(--accent)" }}>
              {chapter.work.title}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span>{chapter.volume.title}</span>
          </nav>

          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}
          >
            {chapter.title}
          </h1>

          <div className="mt-3 flex items-center gap-4 text-sm" style={{ color: "var(--text-muted)" }}>
            <span>{formatNumber(chapter.word_count)} 字</span>
            <span>约{Math.ceil(chapter.word_count / 500)}分钟</span>
          </div>
        </div>

        {/* Chapter Content */}
        <article
          className="prose-reading"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight,
            color: "var(--text-primary)",
            fontFamily: "var(--font-serif)",
          }}
          dangerouslySetInnerHTML={{ __html: chapter.content_html }}
        />

        {/* Author Note */}
        {chapter.author_note && (
          <div
            className="mt-10 rounded-xl border p-6"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}
          >
            <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
              作者的话
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {chapter.author_note}
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between border-t pt-8" style={{ borderColor: "var(--border)" }}>
          {chapter.prev_chapter ? (
            <Link
              href={`/work/${chapter.work.slug}/chapter/${chapter.prev_chapter.slug}`}
              className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "var(--accent)" }}
            >
              <ChevronLeft className="h-4 w-4" />
              {chapter.prev_chapter.title}
            </Link>
          ) : (
            <div />
          )}

          {chapter.next_chapter ? (
            <Link
              href={`/work/${chapter.work.slug}/chapter/${chapter.next_chapter.slug}`}
              className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "var(--accent)" }}
            >
              {chapter.next_chapter.title}
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <div />
          )}
        </div>

        {/* Back to Work */}
        <div className="mt-6 text-center">
          <Link
            href={`/work/${chapter.work.slug}`}
            className="inline-flex items-center gap-2 text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            <BookOpen className="h-4 w-4" />
            返回目录
          </Link>
        </div>
      </div>

      {/* Reader Settings FAB */}
      <button
        onClick={() => setShowSettings(true)}
        className="fixed bottom-6 right-6 z-40 rounded-full p-3 shadow-lg transition-all hover:scale-105"
        style={{ backgroundColor: "var(--accent)", color: "white" }}
        aria-label="Reading settings"
      >
        <Settings className="h-5 w-5" />
      </button>

      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-20 right-6 z-40 rounded-full p-3 shadow-lg transition-all hover:scale-105"
          style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSettings(false)} />
          <div
            className="relative w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6"
            style={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>阅读设置</h3>
              <button onClick={() => setShowSettings(false)} style={{ color: "var(--text-muted)" }}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Font Size */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                字体大小: {fontSize}px
              </label>
              <input
                type="range"
                min={14}
                max={24}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Line Height */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                行高: {lineHeight}
              </label>
              <input
                type="range"
                min={1.4}
                max={2.2}
                step={0.05}
                value={lineHeight}
                onChange={(e) => setLineHeight(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
