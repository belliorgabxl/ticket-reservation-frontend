import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/nav/header";
import { AuthProvider } from "@/lib/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ticket Reservation App",
  description: "By Gabel-Patara",
};

// Applies the persisted (or OS-preferred) theme before first paint, so
// there's no flash of the wrong theme while React hydrates. Runs as an
// inline script because it must execute synchronously, before body content
// paints — a useEffect would run too late.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var theme = stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    if (theme === "dark") document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      // The theme-init script below adds/removes "dark" on this element
      // synchronously, before hydration, so its class list will always
      // legitimately differ from the server-rendered markup — that's
      // expected, not a bug, so React shouldn't warn about it.
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
