import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "NestJS Starter Kit — фронт",
  description: "Next.js + Apollo через BFF-прокси к NestJS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
