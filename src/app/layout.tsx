import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Futbol Lineup Builder - Create Your Dream Team Formation",
  description: "Professional football lineup builder with drag-and-drop functionality. Create, customize, and share your dream team formations with real player data.",
  keywords: ["football", "soccer", "lineup", "formation", "team builder", "tactics"],
  authors: [{ name: "Futbol Lineup Builder" }],
  creator: "Futbol Lineup Builder",
  publisher: "Futbol Lineup Builder",
  openGraph: {
    title: "Futbol Lineup Builder",
    description: "Create Your Dream Team Formation",
    type: "website",
    url: "https://lineup-builder.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Futbol Lineup Builder",
    description: "Create Your Dream Team Formation",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#065f46",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900 text-white antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900">
          {children}
        </div>
      </body>
    </html>
  );
}
