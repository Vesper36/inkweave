"use client";

import { type ReactNode } from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </ThemeProvider>
    </QueryProvider>
  );
}
