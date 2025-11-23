export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body style={{ margin: 0, background: '#1e293b', color: 'white', fontFamily: 'system-ui' }}>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (window.Telegram?.WebApp) {
                Telegram.WebApp.ready();
                Telegram.WebApp.expand();
                document.body.style.background = '#1e293b';
              }
            `
          }}
        />
      </body>
    </html>
  );
}