import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ПДД 2025",
  description: "Подготовка к экзамену ПДД A/B"
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
                Telegram.WebApp.ready();
                Telegram.WebApp.expand();
              }
            `
          }}
        />
      </body>
    </html>
  );
}