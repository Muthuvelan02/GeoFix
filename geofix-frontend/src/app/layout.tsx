import type React from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GeoFix - Report, Track, and Fix Civic Issues",
  description: "Connecting citizens, contractors, and municipal officers for a cleaner, safer city.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // The actual HTML structure and i18n setup is handled in app/[locale]/layout.tsx
  return children;
}