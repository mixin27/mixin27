import Link from "next/link";
import Image from "next/legacy/image";
import { Fragment } from "react";

import { Popover, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { navigation } from "./navigation";
import { ContentSearch } from "@components/search";
import homeIcon from "../../../public/home.png";

const Navbar = () => {
  return (
    <>
      <svg
        className="absolute inset-y-0 right-0 hidden h-full w-48 translate-x-1/2 transform text-white lg:block"
        fill="currentColor"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polygon points="50,0 100,0 50,100 0,100" />
      </svg>

      {/* NAVIGATION START */}
      <Popover>
        <div className="relative px-4 pt-6 sm:px-6 lg:px-8">
          <nav
            className="relative flex items-center justify-between sm:h-10 lg:justify-start"
            aria-label="Global"
          >
            <div className="flex flex-shrink-0 flex-grow items-center lg:flex-grow-0">
              <div className="flex w-full items-center justify-between md:w-auto">
                <Link legacyBehavior href="/">
                  <a>
                    <span className="sr-only">Home</span>
                    <Image
                      width={24}
                      height={24}
                      alt="Picture of author"
                      className="h-8 w-auto sm:h-10"
                      src={homeIcon}
                    />
                  </a>
                </Link>
                <div className="-mr-2 flex items-center md:hidden">
                  <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500">
                    <span className="sr-only">Open main menu</span>
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
            </div>
            <div className="hidden md:ml-10 md:block md:space-x-8 md:pr-4">
              {navigation.map((item) => (
                <Link legacyBehavior key={item.name} href={item.href}>
                  <a className="font-medium text-gray-500 hover:text-gray-900">
                    {item.name}
                  </a>
                </Link>
              ))}
            </div>
            <div className="hidden md:block">
              <ContentSearch />
            </div>
          </nav>
        </div>

        <Transition
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            focus
            className="absolute inset-x-0 top-0 z-10 origin-top-right transform p-2 transition md:hidden"
          >
            <div className="rounded-lg bg-white shadow-md ring-1 ring-black ring-opacity-5">
              <div className="flex items-center justify-between px-5 pt-4">
                <div>
                  <Image
                    height={20}
                    width={20}
                    className="h-8 w-auto"
                    src="https://res.cloudinary.com/ds6vu9ry4/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1721476442/2x2_2349_moqc1k.jpg"
                    alt=""
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  />
                </div>
                <div className="-mr-2">
                  <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500">
                    <span className="sr-only">Close main menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
              <div className="space-y-1 px-2 pt-2 pb-3">
                {navigation.map((item) => (
                  <Link legacyBehavior key={item.name} href={item.href}>
                    <a className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                      {item.name}
                    </a>
                  </Link>
                ))}
              </div>
              <div className="px-4">
                <ContentSearch />
              </div>
              <div className="py-5"></div>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
      {/* NAVIGATION END */}
    </>
  );
};

export default Navbar;
