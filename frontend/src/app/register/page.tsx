"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Eye, EyeOff, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.username.trim() || !form.email.trim() || !form.password) {
      setError("请填写所有必填字段");
      return;
    }
    if (form.password.length < 6) {
      setError("密码至少需要6个字符");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    setLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      // Register
      const regResp = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
          display_name: form.displayName.trim() || form.username.trim(),
        }),
      });

      if (!regResp.ok) {
        const data = await regResp.json().catch(() => ({ detail: "注册失败" }));
        throw new Error(data.detail || "注册失败");
      }

      // Auto-login after registration
      const params = new URLSearchParams();
      params.append("username", form.username.trim());
      params.append("password", form.password);

      const loginResp = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      if (!loginResp.ok) {
        // Registration succeeded but auto-login failed, redirect to login
        router.push("/login");
        return;
      }

      const { access_token } = await loginResp.json();
      const userResp = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      if (userResp.ok) {
        const user = await userResp.json();
        setAuth(user, access_token);
      }
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "注册失败");
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
            注册
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            创建账号，开始你的创作之旅。
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
              用户名 <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              id="username"
              type="text"
              value={form.username}
              onChange={(e) => updateField("username", e.target.value)}
              autoComplete="username"
              autoFocus
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                "--tw-ring-color": "var(--accent)",
              } as React.CSSProperties}
              placeholder="选择一个用户名"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              邮箱 <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              autoComplete="email"
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                "--tw-ring-color": "var(--accent)",
              } as React.CSSProperties}
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="displayName" className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              显示名称
            </label>
            <input
              id="displayName"
              type="text"
              value={form.displayName}
              onChange={(e) => updateField("displayName", e.target.value)}
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                "--tw-ring-color": "var(--accent)",
              } as React.CSSProperties}
              placeholder="可选，默认使用用户名"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              密码 <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                autoComplete="new-password"
                className="w-full rounded-lg border px-4 py-2.5 pr-10 text-sm outline-none transition-colors focus:ring-2"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  "--tw-ring-color": "var(--accent)",
                } as React.CSSProperties}
                placeholder="至少6个字符"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-muted)" }}
              >
                {showPwd ? <EyeOff className="" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              确认密码 <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              id="confirmPassword"
              type={showPwd ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              autoComplete="new-password"
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                "--tw-ring-color": "var(--accent)",
              } as React.CSSProperties}
              placeholder="再次输入密码"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "注册中..." : "注册"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>
          已有账号？{" "}
          <Link href="/login" className="font-medium hover:underline" style={{ color: "var(--accent)" }}>
            登录
          </Link>
        </p>
      </div>
    </div>
  );
}
