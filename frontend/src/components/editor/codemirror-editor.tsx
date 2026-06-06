"use client";

import { useEffect, useRef, useCallback } from "react";
import { EditorView, keymap, placeholder, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection } from "@codemirror/view";
import { EditorState, type Extension } from "@codemirror/state";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching, indentOnInput } from "@codemirror/language";
import { oneDark } from "@codemirror/theme-one-dark";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { autocompletion, completionKeymap } from "@codemirror/autocomplete";
import { lintKeymap } from "@codemirror/lint";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  theme?: "light" | "dark";
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}

// Markdown toolbar snippets
const markdownSnippets: Record<string, string> = {
  bold: "**",
  italic: "*",
  strikethrough: "~~",
  code: "`",
  codeblock: "```\n\n```",
  heading1: "# ",
  heading2: "## ",
  heading3: "### ",
  quote: "> ",
  link: "[](url)",
  image: "![alt](url)",
  list: "- ",
  ordered: "1. ",
  hr: "\n---\n",
  details: "<details>\n<summary></summary>\n\n</details>",
  html: "<div>\n\n</div>",
};

export function CodeEditor({ value, onChange, theme = "light", placeholder: ph = "Start writing...", readOnly = false, className = "" }: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);

  // Keep callback ref current
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const getExtensions = useCallback((): Extension[] => {
    const baseExtensions: Extension[] = [
      lineNumbers(),
      highlightActiveLine(),
      highlightActiveLineGutter(),
      drawSelection(),
      history(),
      indentOnInput(),
      bracketMatching(),
      highlightSelectionMatches(),
      autocompletion(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      markdown({ base: markdownLanguage }),
      keymap.of([
        ...defaultKeymap,
        ...historyKeymap,
        ...searchKeymap,
        ...completionKeymap,
        ...lintKeymap,
        indentWithTab,
      ]),
      placeholder(ph),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          onChangeRef.current(update.state.doc.toString());
        }
      }),
      EditorView.lineWrapping,
    ];

    if (theme === "dark") {
      baseExtensions.push(oneDark);
    }

    if (readOnly) {
      baseExtensions.push(EditorState.readOnly.of(true));
    }

    return baseExtensions;
  }, [theme, ph, readOnly]);

  // Initialize editor
  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: value,
      extensions: getExtensions(),
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync external value changes
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current !== value) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      });
    }
  }, [value]);

  // Toolbar action
  const insertAtCursor = useCallback((before: string, after = "") => {
    const view = viewRef.current;
    if (!view) return;
    const { from, to } = view.state.selection.main;
    const selected = view.state.sliceDoc(from, to);
    const insertion = before + (selected || "") + after;
    view.dispatch({
      changes: { from, to, insert: insertion },
      selection: { anchor: from + before.length, head: from + before.length + (selected || "").length },
    });
    view.focus();
  }, []);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Toolbar */}
      <div
        className="flex items-center gap-1 px-3 py-2 border-b overflow-x-auto flex-shrink-0"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}
      >
        {[
          { label: "H1", title: "一级标题", action: () => insertAtCursor(markdownSnippets.heading1) },
          { label: "H2", title: "二级标题", action: () => insertAtCursor(markdownSnippets.heading2) },
          { label: "H3", title: "三级标题", action: () => insertAtCursor(markdownSnippets.heading3) },
          { sep: true },
          { label: "B", title: "粗体", action: () => insertAtCursor("**", "**"), bold: true },
          { label: "I", title: "斜体", action: () => insertAtCursor("*", "*"), italic: true },
          { label: "S", title: "删除线", action: () => insertAtCursor("~~", "~~") },
          { sep: true },
          { label: "</>", title: "代码", action: () => insertAtCursor("`", "`") },
          { label: "{ }", title: "代码块", action: () => insertAtCursor("```\n", "\n```") },
          { sep: true },
          { label: "\"", title: "引用", action: () => insertAtCursor("> ") },
          { label: "-", title: "无序列表", action: () => insertAtCursor("- ") },
          { label: "1.", title: "有序列表", action: () => insertAtCursor("1. ") },
          { sep: true },
          { label: "Link", title: "链接", action: () => insertAtCursor("[", "](url)") },
          { label: "Img", title: "图片", action: () => insertAtCursor("![alt](", ")") },
          { label: "---", title: "分割线", action: () => insertAtCursor("\n---\n") },
          { sep: true },
          { label: "<>", title: "HTML块", action: () => insertAtCursor("<div>\n", "\n</div") },
          { label: "Details", title: "可折叠注释", action: () => insertAtCursor("<details>\n<summary>", "</summary>\n\n</details>") },
        ].map((item, i) =>
          "sep" in item && item.sep ? (
            <div key={i} className="w-px h-5 mx-1" style={{ backgroundColor: "var(--border)" }} />
          ) : (
            <button
              key={i}
              onClick={"action" in item ? item.action : undefined}
              title={"title" in item ? item.title : undefined}
              className="px-2 py-1 text-xs rounded hover:opacity-80 transition-colors whitespace-nowrap"
              style={{
                color: "var(--text-secondary)",
                backgroundColor: "transparent",
                fontWeight: "bold" in item && item.bold ? 700 : undefined,
                fontStyle: "italic" in item && item.italic ? "italic" : undefined,
              }}
            >
              {"label" in item ? item.label : ""}
            </button>
          )
        )}
      </div>

      {/* Editor */}
      <div ref={editorRef} className="flex-1 overflow-auto" />
    </div>
  );
}
