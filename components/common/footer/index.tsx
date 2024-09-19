import Social from "@/components/social";

const Footer = () => {
  return (
    <footer className="bg-black p-10 mt-10 flex flex-col gap-2 lg:flex-row items-center justify-between">
      <p className="text-center">Copyright &copy; 2024 KYAW ZAYAR TUN.</p>
      {/* <a href="/" className="underline order-3 lg:order-none">
        sitemap.xml
      </a> */}
      <Social
        containerStyles="flex gap-4 lg:gap-6"
        iconStyles="w-9 h-9 border border-accent rounded-full flex justify-center items-center text-accent hover:bg-accent hover:text-primary hover:transition-all duration-500"
      />
    </footer>
  );
};

export default Footer;
