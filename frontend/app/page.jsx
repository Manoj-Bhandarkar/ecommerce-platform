import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  return (
    <div className="space-y-10">
      <Hero />
      <section className="text-2xl font-bold container mx-auto px-4"> Clothings Products </section>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 container mx-auto px-4">
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>
      <section className="text-2xl font-bold container mx-auto px-4"> Electronics Products </section>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 container mx-auto px-4">
        <ProductCard />
        <ProductCard />
        <ProductCard /> 
        <ProductCard />
      </div>
    </div>
  );
}