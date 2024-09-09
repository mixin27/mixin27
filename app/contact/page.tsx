import React from "react";
import Contact from "./contact";

export async function generateMetadata() {
  return {
    title: "Contact - Kyaw Zayar Tun",
  };
}

const Page = () => {
  return (
    <>
      <Contact />
    </>
  );
};

export default Page;
