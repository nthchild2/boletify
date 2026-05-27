import "../styles/global.css";
import { TRPCProvider } from "../lib/trpc-provider";
import { ThemeProvider, ThemeNoFlashScript } from "../lib/theme";
import { AuthSessionProvider } from "../lib/session-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-MX" suppressHydrationWarning>
      <head>
        {/* Apply theme synchronously, before paint, to avoid flash. */}
        <ThemeNoFlashScript />
      </head>
      <body>
        <ThemeProvider>
          <AuthSessionProvider>
            <TRPCProvider>{children}</TRPCProvider>
          </AuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
