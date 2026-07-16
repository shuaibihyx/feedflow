import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FeedFlow - RSS 阅读器",
  description: "极简信息聚合阅读器",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
