import Link from "next/link";
import { Button } from "@/components/ui/button";

// components
import Nav from "../nav";
import MobileNav from "../nav/MobileNav";

const Header = () => {
  return (
    <>
      {/* <div className="w-full flex items-center justify-center py-2 bg-accent">
        <p className="text-black">This site is currently in progress</p>
      </div> */}
      <header className="py-8 xl:py-12 text-white">
        <div className="container mx-auto flex justify-between items-center">
          {/* logo */}
          <Link href="/">
            <h1 className="text-4xl font-semibold">
              Zayar<span className="text-accent">.</span>
            </h1>
          </Link>

          {/* desktop nav & hire me button */}
          <div className="hidden xl:flex items-center gap-8">
            <Nav />
            <Link href="/contact">
              <Button>Hire me</Button>
            </Link>
          </div>

          {/* mobile nav */}
          <div className="xl:hidden">
            <MobileNav />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
