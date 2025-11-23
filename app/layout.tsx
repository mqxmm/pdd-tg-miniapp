import type { Metadata } from "next";
import "./globals.css";
import { useEffect } from "react";

export const metadata: Metadata = {
  title: "ПДД Россия 2025",
  description: "Подготовка к экзамену ПДД",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-gray-900 text-white min-h-screen">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (window.Telegram?.WebApp) {
                window.Telegram.WebApp.ready();
                window.Telegram.WebApp.expand();
              }
            `,
          }}
        />
      </body>
    </html>
  );
}