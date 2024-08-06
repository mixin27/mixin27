const Header = () => {
  return (
    <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
      <div className="sm:text-center lg:text-left">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block xl:inline">Welcome to my</span>{" "}
          <span className="block text-teal-600 xl:inline">portfolio!</span>
        </h1>
        <p className="mt-3 text-base text-gray-600 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">
          I'm a passionate and experienced mobile developer dedicated to
          creating seamless, user-friendly applications. With a strong
          background in both iOS and Android development, I combine technical
          experties with a keen eye for design to deliver apps that not only
          function flawlessly but also provide an exceptional user experience.
          Explore my work and see how I bring ideas to life through innovative
          mobile solutions.
        </p>
        <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
          <div>
            <a
              href="https://drive.google.com/file/d/1lQyT-zi0XbdCBS7_3ULXZrmcvnWJyRal/view?usp=sharing"
              className="flex w-full items-center justify-center rounded-md border border-transparent bg-teal-600 px-8 py-3 text-base font-medium text-white hover:bg-teal-700 md:py-4 md:px-10 md:text-lg btn"
            >
              Download CV
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Header;
