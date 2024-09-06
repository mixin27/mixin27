"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationLinks } from "./navigation";

const Nav = () => {
  const pathname = usePathname();

  return (
    <nav className="flex gap-8">
      {navigationLinks.map((item, index) => {
        return (
          <Link
            key={index}
            href={item.path}
            className={`${
              item.path == pathname && "text-accent border-b-2 border-accent"
            } capitalize font-medium hover:text-accent transition-all`}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default Nav;
