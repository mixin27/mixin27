import React from "react";
import Resume from "./resume";

export async function generateMetadata() {
  return {
    title: "Resume - Kyaw Zayar Tun",
  };
}

const Page = () => {
  return (
    <>
      <Resume />
    </>
  );
};

export default Page;
