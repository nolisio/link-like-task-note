import type { Metadata, Viewport } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/auth";

import ThemeProvider from "../lib/theme";

const mPlusRounded = M_PLUS_Rounded_1c({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const viewport: Viewport = {
  themeColor: "#b08cff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Link Task",
  description: "A pastel glassmorphism task manager",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Link Task",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${mPlusRounded.variable} font-sans antialiased transition-colors duration-300`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
