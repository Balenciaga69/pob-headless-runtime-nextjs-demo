import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const sansFont = Space_Grotesk({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-geist-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PoB Headless Desktop",
  description: "Desktop-first control panel for Path of Building headless runtime",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sansFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            classNames: {
              toast:
                "!border-panel-border !bg-panel-strong !text-foreground !shadow-2xl",
              description: "!text-muted",
            },
          }}
        />
      </body>
    </html>
  );
}
