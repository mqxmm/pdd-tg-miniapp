export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-slate-800 text-white min-h-screen">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (window.Telegram?.WebApp) {
                Telegram.WebApp.ready();
                Telegram.WebApp.expand();
              }
            `,
          }}
        />
      </body>
    </html>
  );
}