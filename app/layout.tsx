import type { Metadata } from "next";
import { Geist_Mono, VT323 } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const vt323 = VT323({
  variable: "--font-vt323",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dataset Analyzer",
  description: "Evalúa la viabilidad de tu dataset para tu proyecto de bootcamp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistMono.variable} ${vt323.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        {/* CRT scanline overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.025]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 4px)',
          }}
        />
        {children}
      </body>
    </html>
  );
}
