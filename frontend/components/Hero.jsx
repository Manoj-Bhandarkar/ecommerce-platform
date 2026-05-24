import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-rose-100 to-pink-100">
      <div className="container mx-auto flex flex-col items-center px-6 py-16 md:flex-row">
        
        {/* Left Content */}
        <div className="w-full md:w-1/2">
          <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">
            Welcome to{" "}
            <span className="text-rose-600">
              Manoj Cart
            </span>
          </h1>

          <p className="mb-6 text-gray-700 text-lg">
            Discover premium electronics, fashion, and lifestyle products at unbeatable prices.
          </p>

          <Link
            href="/products"
            className="inline-block rounded-lg bg-rose-600 px-6 py-3 text-white transition hover:bg-rose-700"
          >
            🛍️ Shop Now
          </Link>
        </div>

        {/* Right Image */}
        <div className="mt-10 w-full md:mt-0 md:w-1/2">
          <Image
            src="/hero-image.png"
            alt="Hero Banner"
            width={600}
            height={500}
            priority
            className="mx-auto rounded-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;