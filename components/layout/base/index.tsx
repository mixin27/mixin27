import { FunctionComponent, PropsWithChildren } from "react";
import Head from "next/head";
import Image from "next/image";

import { Navbar, Header, Footer } from "../../common";

const BaseLayout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 space-y-8 sm:px-6 lg:px-8">
        <Head>
          <title>Kyaw Zayar Tun - Software Developer</title>
          <meta
            name="description"
            content="Portfolio page of Kyaw Zayar Tun."
          />
          <link rel="icon" href="/favicon.ico" />
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
        </Head>

        <div className="relative">
          <div className="relative z-10 bg-white pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
            <Navbar />
            <Header />
          </div>
          <div className="relative lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <Image
              priority
              alt=""
              className="h-56 w-full object-cover sm:h-72 md:h-96 lg:h-full lg:w-full"
              src="https://res.cloudinary.com/ds6vu9ry4/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1721476442/2x2_2349_moqc1k.jpg"
              fill
              sizes="100vw"
            />
          </div>
        </div>

        <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          {children}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BaseLayout;
