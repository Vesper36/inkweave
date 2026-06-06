"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Eye, EyeOff, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("请填写用户名和密码");
      return;
    }
    setError("");
    setLoading(true);
    try {
      // Backend expects form-data for OAuth2 password flow
      const params = new URLSearchParams();
      params.append("username", username.trim());
      params.append("password", password);

      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const resp = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      if (!resp.ok) {
        const data = await resp.json().catch(() => ({ detail: "登录失败" }));
        throw new Error(data.detail || "用户名或密码错误");
      }

      const { access_token } = await resp.json();

      // Fetch user info
      const userResp = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      if (!userResp.ok) throw new Error("获取用户信息失败");
      const user = await userResp.json();

      setAuth(user, access_token);
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "登录失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <BookOpen className="h-8 w-8" style={{ color: "var(--accent)" }} />
            <span className="text-2xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}>
              墨织
            </span>
          </Link>
          <h1 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
            登录
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            欢迎回来，继续你的创作之旅。
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div
              className="rounded-lg px-4 py-3 text-sm"
              style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              用户名
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                "--tw-ring-color": "var(--accent)",
              } as React.CSSProperties}
              placeholder="输入用户名"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full rounded-lg border px-4 py-2.5 pr-10 text-sm outline-none transition-colors focus:ring-2"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  "--tw-ring-color": "var(--accent)",
                } as React.CSSProperties}
                placeholder="输入密码"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-muted)" }}
              >
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "登录中..." : "登录"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>
          还没有账号？{" "}
          <Link href="/register" className="font-medium hover:underline" style={{ color: "var(--accent)" }}>
            注册
          </Link>
        </p>

        {/* Demo hint */}
        <div
          className="mt-6 rounded-lg px-4 py-3 text-xs"
          style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
        >
          <p className="font-medium mb-1" style={{ color: "var(--text-secondary)" }}>演示账号</p>
          <p>用户名: <code>demo_reader</code> / 密码: <code>demo1234</code></p>
          <p>用户名: <code>alice</code> / 密码: <code>alice1234</code></p>
        </div>
      </div>
    </div>
  );
}
