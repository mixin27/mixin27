import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SITE_CONFIG } from "@/lib/constants"
import { getOGImageUrl } from "@/lib/og"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || SITE_CONFIG.url

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.author}`,
  },
  description:
    "Passionate mobile developer creating seamless, user-friendly applications for iOS and Android.",
  keywords: [
    "mobile developer",
    "iOS developer",
    "Android developer",
    "Flutter developer",
    "mobile app development",
  ],
  authors: [{ name: SITE_CONFIG.author }],
  creator: SITE_CONFIG.author,
  metadataBase: new URL(baseUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.title,
    description:
      "Passionate mobile developer creating seamless, user-friendly applications.",
    siteName: "Kyaw Zayar Tun Portfolio",
    images: [
      {
        url: getOGImageUrl({
          title: "Kyaw Zayar Tun",
          description: "Mobile Developer",
          type: "default",
        }),
        width: 1200,
        height: 630,
        alt: "Kyaw Zayar Tun - Mobile Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.title,
    description:
      "Passionate mobile developer creating seamless, user-friendly applications.",
    creator: "@kyawzayartun98",
    images: [
      getOGImageUrl({
        title: "Kyaw Zayar Tun",
        description: "Mobile Developer",
        type: "default",
      }),
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* RSS Feed Autodiscovery */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS Feed for Kyaw Zayar Tun's Blog"
          href="/feed.xml"
        />
        <link
          rel="alternate"
          type="application/atom+xml"
          title="Atom Feed for Kyaw Zayar Tun's Blog"
          href="/atom.xml"
        />
        <link
          rel="alternate"
          type="application/json"
          title="JSON Feed for Kyaw Zayar Tun's Blog"
          href="/feed.json"
        />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
