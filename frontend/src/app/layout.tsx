import type { Metadata } from "next";
import { Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const notoSans = Noto_Sans_SC({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const notoSerif = Noto_Serif_SC({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "墨织 InkWeave - 结构化叙事平台",
    template: "%s | 墨织 InkWeave",
  },
  description:
    "面向创作者与读者的结构化叙事平台。为长篇连载、同人衍生、互动文本提供卷册管理、多主题阅读、安全富媒体渲染。",
  keywords: ["小说", "同人", "写作", "阅读", "故事", "网络文学", "创作平台"],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "墨织 InkWeave",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${notoSans.variable} ${notoSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--font-sans)" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
