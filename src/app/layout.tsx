import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PathPilot AI — Personalized Learning Roadmaps",
    template: "%s · PathPilot AI",
  },
  description:
    "PathPilot AI turns your current skills, career goal, and available time into a clear, project-based learning roadmap.",
  keywords: [
    "personalized learning",
    "AI learning roadmap",
    "student career planning",
    "Gemini AI",
    "PathPilot AI",
  ],
  openGraph: {
    type: "website",
    siteName: "PathPilot AI",
    title: "PathPilot AI — Personalized Learning Roadmaps",
    description:
      "Your goals. Your skills. Your personalized learning journey. Generate a stage-by-stage roadmap with projects and resources.",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "PathPilot AI — Personalized Learning Roadmaps",
    description:
      "Generate a personalized, project-based learning roadmap from your skills, goals, and available time.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f7f5",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-dvh bg-canvas font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
