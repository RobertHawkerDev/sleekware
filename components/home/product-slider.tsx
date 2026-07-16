"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { CollectionProductsResult } from "@/lib/shopify/operations/products";

import { ProductCard, ProductCardSkeleton } from "./product-card";

interface ProductsSliderProps {
  title: string;
  viewAllHref?: string;
  collection?: CollectionProductsResult | null;
  isLoading?: boolean;
}

export function ProductsSlider({ title, viewAllHref, collection, isLoading }: ProductsSliderProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const products = collection?.products ?? [];
  const isSliderLoading = isLoading || !collection;

  const updateScrollState = () => {
    const node = scrollerRef.current;
    if (!node) return;
    setCanScrollPrev(node.scrollLeft > 1);
    setCanScrollNext(Math.ceil(node.scrollLeft + node.clientWidth) < node.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollState();
    const node = scrollerRef.current;
    if (!node) return;

    node.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      node.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [products.length, isSliderLoading]);

  const scrollByAmount = (direction: 1 | -1) => {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollBy({ left: direction * node.clientWidth * 0.8, behavior: "smooth" });
  };

  // Only collapse component out if loading is completely finished and data items are truly empty
  if (products.length === 0 && !isSliderLoading) return null;

  return (
    <section className="w-full max-w-8xl mx-auto py-3 md:py-6 px-6 sm:px-8 overflow-hidden">
      <div className="mb-4 flex items-end justify-between">
        <div className="flex items-baseline gap-4 sm:gap-6">
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-black">
            {title}
          </h2>
          {viewAllHref && !isSliderLoading && (
            <Link
              href={viewAllHref}
              className="text-xs sm:text-sm font-black uppercase tracking-wider text-neutral-500 hover:text-black underline underline-offset-4 transition-colors"
            >
              View All
            </Link>
          )}
        </div>

        <div className="flex gap-1.5">
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollByAmount(-1)}
            disabled={isSliderLoading || !canScrollPrev}
            className="flex h-9 w-9 items-center justify-center rounded-none bg-neutral-200/80 text-black transition hover:bg-neutral-300 disabled:opacity-30 disabled:hover:bg-neutral-200/80"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollByAmount(1)}
            disabled={isSliderLoading || !canScrollNext}
            className="flex h-9 w-9 items-center justify-center rounded-none bg-neutral-200/80 text-black transition hover:bg-neutral-300 disabled:opacity-30 disabled:hover:bg-neutral-200/80"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {isSliderLoading
          ? // Render a clean continuous array row of 4 skeleton cards while loading
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`slider-skeleton-${index}`}
                className="w-[260px] shrink-0 snap-start sm:w-[320px] md:w-[360px] lg:w-[400px]"
              >
                <ProductCardSkeleton />
              </div>
            ))
          : products.map((product, index) => (
              <div
                key={product?.id ?? product?.handle ?? index}
                className="w-[260px] shrink-0 snap-start sm:w-[320px] md:w-[360px] lg:w-[400px]"
              >
                <ProductCard product={product} />
              </div>
            ))}
      </div>
    </section>
  );
}
