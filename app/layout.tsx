import { DM_Mono, Outfit, Syne } from "next/font/google"

import "./globals.css"
import { cn } from "@/lib/utils"
import { Metadata } from "next"
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { siteConfig } from "@/data/config"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { BackToTop } from "@/components/layout/back-to-top"
import { ThemeProvider } from "@/components/theme-provider"

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" })

const headingFont = Syne({
  subsets: ["latin"],
  variable: "--font-display",
})

const fontMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["300", "400", "500"],
})

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} - ${siteConfig.role}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.tagline,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  keywords: [
    "mobile developer",
    "iOS developer",
    "Android developer",
    "Flutter developer",
    "mobile app development",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: `${siteConfig.name} Portfolio`,
    title: `${siteConfig.name} - ${siteConfig.role}`,
    description: siteConfig.tagline,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - ${siteConfig.role}`,
    description: siteConfig.tagline,
    creator: siteConfig.twitterHandle,
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
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(fontMono.variable, outfit.variable, headingFont.variable)}
      data-scroll-behavior="smooth"
    >
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
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <BackToTop />
        </ThemeProvider>
        <Analytics/>
        <SpeedInsights/>
      </body>
    </html>
  )
}
