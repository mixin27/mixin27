import type { Metadata } from "next";
import localFont from "next/font/local";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";

// components
import Header from "@/components/common/header";
// import StairTransition from "@/components/transitions/StairTransition";
import PageTransition from "@/components/transitions/PageTransition";

import "./globals.css";
import Footer from "@/components/common/footer";
import { siteMetadada } from "@/lib/siteMetadata";

// const jetBrainsMono = JetBrains_Mono({
//   subsets: ["latin"],
//   display: "swap",
//   weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
//   variable: "--font-jetbrainsMono",
// });

const jetBrainsMono = localFont({
  src: "./fonts/JetBrains_Mono/JetBrainsMono-VariableFont_wght.ttf",
  variable: "--font-jetbrainsMono",
  weight: "100 200 300 400 500 600 700 800 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadada.siteUrl),
  title: {
    template: `%s | ${siteMetadada.title}`,
    default: siteMetadada.title,
  },
  description: siteMetadada.description,
  openGraph: {
    title: siteMetadada.title,
    description: siteMetadada.description,
    url: siteMetadada.siteUrl,
    siteName: siteMetadada.title,
    images: [siteMetadada.socialBanner],
    locale: siteMetadada.locale,
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadada.title,
    description: siteMetadada.description,
    images: [siteMetadada.socialBanner],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
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
      <body className={`${jetBrainsMono.className} bg-primary text-white`}>
        <Header />
        {/* <StairTransition /> */}
        <PageTransition>{children}</PageTransition>
        <Footer />
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
