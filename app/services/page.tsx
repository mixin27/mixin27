import React from "react";
import Services from "./services";

export async function generateMetadata() {
  return {
    title: "Services - Kyaw Zayar Tun",
  };
}

const Page = () => {
  return (
    <>
      <Services />
    </>
  );
};

export default Page;
