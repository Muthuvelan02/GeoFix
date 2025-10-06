import type React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ReactQueryProvider from "@/components/providers/react-query-provider";
import ErrorBoundary from "@/components/error-boundary";
import { locales } from "@/i18n";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "GeoFix - Report, Track, and Fix Civic Issues",
  description: "Connecting citizens, contractors, and municipal officers for a cleaner, safer city.",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as any)) notFound();

  // Set the locale for the request
  setRequestLocale(locale);

  const messages = await getMessages({ locale });

  const dir = locale === "ar" || locale === "he" || locale === "ur" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className={`${poppins.variable} antialiased`} suppressHydrationWarning>
      <body
        className="font-sans"
        style={{
          fontFamily:
            'var(--font-poppins), system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        }}
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <ReactQueryProvider>
            <NextIntlClientProvider messages={messages} locale={locale} timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                {children}
              </ThemeProvider>
            </NextIntlClientProvider>
          </ReactQueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
