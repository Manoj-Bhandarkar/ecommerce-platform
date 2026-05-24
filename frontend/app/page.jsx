'use client';
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [clothings, setClothings] = useState([]);
  const [electronics, setElectronics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductByCategories = async () => {
      try {
        const [clothingsResponse, electronicsResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/product/search/?categories=clothings`),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/product/search/?categories=electronics`),
        ]);
        setClothings(clothingsResponse.data.items);
        setElectronics(electronicsResponse.data.items);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductByCategories();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="space-y-10">
      <Hero />
      <section className="text-2xl font-bold container mx-auto px-4"> Clothings Products </section>
      {
        clothings.length === 0 ? (
          <div className="text-center mt-10">No clothing products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 container mx-auto px-4">
            {
              clothings.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        )
      }
      <section className="text-2xl font-bold container mx-auto px-4"> Electronics Products </section>
      {
        electronics.length === 0 ? (
          <div className="text-center mt-10">No electronics products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 container mx-auto px-4">
            {
              electronics.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            }
          </div>
        )
      }


    </div>
  );
}