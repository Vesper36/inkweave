"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { CodeEditor } from "@/components/editor/codemirror-editor";
import { MarkdownPreview } from "@/components/editor/markdown-preview";
import { useDraftStore, useAutoSave } from "@/stores/draft";
import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import {
  Eye, EyeOff, Save, Clock, ChevronLeft, Settings,
  Maximize2, Minimize2, SplitSquareHorizontal,
  CheckCircle, AlertCircle, Loader2
} from "lucide-react";

type ViewMode = "split" | "editor" | "preview";

export default function EditorPage() {
  const router = useRouter();
  const { currentTheme } = useTheme();
  const {
    currentDraft,
    setCurrentDraft,
    updateContent,
    updateTitle,
    isSaving,
    lastSavedAt,
  } = useDraftStore();
  const { save } = useAutoSave(30000);

  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [showSettings, setShowSettings] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const autoSaveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize default draft if none exists
  useEffect(() => {
    if (!currentDraft) {
      setCurrentDraft({
        id: `draft-${Date.now()}`,
        workSlug: "untitled",
        volumeId: "",
        title: "未命名章节",
        content: "",
        updatedAt: Date.now(),
        dirty: false,
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save every 30s
  useEffect(() => {
    autoSaveTimerRef.current = setInterval(() => {
      save();
    }, 30000);

    return () => {
      if (autoSaveTimerRef.current) clearInterval(autoSaveTimerRef.current);
    };
  }, [save]);

  // Update word/char count
  const handleContentChange = useCallback(
    (content: string) => {
      updateContent(content);
      const chars = content.length;
      const cjk = (content.match(/[一-鿿぀-ゟ゠-ヿ]/g) || []).length;
      const words = content.trim() ? cjk + content.replace(/[一-鿿぀-ゟ゠-ヿ]/g, " ").split(/\s+/).filter(Boolean).length : 0;
      setCharCount(chars);
      setWordCount(words);
    },
    [updateContent]
  );

  // Manual save (Ctrl+S)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [save]);

  const isDark = currentTheme.id === "dark" || currentTheme.id === "midnight";
  const content = currentDraft?.content || "";
  const title = currentDraft?.title || "";

  const formatTime = (ts: number | null) => {
    if (!ts) return "";
    const d = new Date(ts);
    return d.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Top Bar */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b flex-shrink-0"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/write")}
            className="p-1.5 rounded-lg hover:opacity-80"
            style={{ color: "var(--text-muted)" }}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <input
            type="text"
            value={title}
            onChange={(e) => updateTitle(e.target.value)}
            className="text-lg font-semibold bg-transparent border-none outline-none"
            style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)", minWidth: "200px" }}
            placeholder="章节标题..."
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Save Status */}
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
            {isSaving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>保存中...</span>
              </>
            ) : currentDraft?.dirty ? (
              <>
                <AlertCircle className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} />
                <span>未保存</span>
              </>
            ) : lastSavedAt ? (
              <>
                <CheckCircle className="h-3.5 w-3.5" style={{ color: "#22c55e" }} />
                <span>已保存 {formatTime(lastSavedAt)}</span>
              </>
            ) : (
              <>
                <Clock className="h-3.5 w-3.5" />
                <span>自动保存</span>
              </>
            )}
          </div>

          {/* Manual Save */}
          <button
            onClick={save}
            disabled={!currentDraft?.dirty || isSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50"
            style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}
          >
            <Save className="h-3.5 w-3.5" />
            保存
          </button>

          {/* View Mode Toggle */}
          <div
            className="flex items-center border rounded-lg overflow-hidden"
            style={{ borderColor: "var(--border)" }}
          >
            {[
              { mode: "editor" as const, icon: EyeOff, title: "仅编辑" },
              { mode: "split" as const, icon: SplitSquareHorizontal, title: "分栏" },
              { mode: "preview" as const, icon: Eye, title: "仅预览" },
            ].map((item) => (
              <button
                key={item.mode}
                onClick={() => setViewMode(item.mode)}
                title={item.title}
                className="p-1.5 transition-colors"
                style={{
                  backgroundColor: viewMode === item.mode ? "var(--accent-soft)" : "transparent",
                  color: viewMode === item.mode ? "var(--accent)" : "var(--text-muted)",
                }}
              >
                <item.icon className="h-4 w-4" />
              </button>
            ))}
          </div>

          {/* Settings */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 rounded-lg hover:opacity-80"
            style={{ color: "var(--text-muted)" }}
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Editor + Preview */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor Panel */}
        {(viewMode === "editor" || viewMode === "split") && (
          <div className={cn("flex flex-col overflow-hidden", viewMode === "split" ? "w-1/2 border-r" : "w-full")} style={{ borderColor: "var(--border)" }}>
            <CodeEditor
              value={content}
              onChange={handleContentChange}
              theme={isDark ? "dark" : "light"}
              placeholder="在此输入 Markdown 内容...\n\n支持标准 Markdown 语法、GFM 扩展、HTML 标签。\n\n快捷键：\n  Ctrl+S 保存\n  Tab 缩进\n  Ctrl+B 粗体\n  Ctrl+I 斜体"
            />
          </div>
        )}

        {/* Preview Panel */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div className={cn("flex flex-col overflow-hidden", viewMode === "split" ? "w-1/2" : "w-full")}>
            <div className="flex-1 overflow-auto px-6 py-8" style={{ backgroundColor: "var(--bg-primary)" }}>
              <MarkdownPreview content={content} />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div
        className="flex items-center justify-between px-4 py-1.5 border-t text-xs flex-shrink-0"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)", color: "var(--text-muted)" }}
      >
        <div className="flex items-center gap-4">
          <span>{wordCount} 字</span>
          <span>{charCount} 字符</span>
          <span>{content.split("\n").length} 行</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Markdown</span>
          <span>UTF-8</span>
          <span>{viewMode === "split" ? "分栏模式" : viewMode === "editor" ? "编辑模式" : "预览模式"}</span>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSettings(false)} />
          <div
            className="relative w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6"
            style={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border)" }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>编辑器设置</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              更多编辑器设置将在后续版本中开放，包括字体大小、Tab 宽度、自动补全等。
            </p>
            <button
              onClick={() => setShowSettings(false)}
              className="mt-4 w-full py-2 rounded-lg text-sm font-medium"
              style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
