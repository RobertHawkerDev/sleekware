import Image from "next/image";
import Link from "next/link";

import type { getCollections } from "@/lib/shopify/operations/collections";

// Dynamically extracts the type of a single item inside the collections array
type ShopifyCollection = Awaited<ReturnType<typeof getCollections>>[number];

interface CollectionsMenuProps {
  collections?: ShopifyCollection[] | null;
  isLoading?: boolean;
}

// Standalone skeleton that perfectly replicates the dimension profile of the grid items
export function CollectionCardSkeleton() {
  return (
    <div className="flex flex-col w-full pointer-events-none animate-pulse">
      {/* Box Image Canvas Container Match */}
      <div className="relative w-full aspect-square sm:aspect-4/5 bg-neutral-200 rounded-none" />

      {/* Typography Stack Layout Match */}
      <div className="mt-3 space-y-2">
        {/* Collection Title Block */}
        <div className="h-4 w-2/3 bg-neutral-200 rounded-none" />

        {/* Multi-line Description Blocks */}
        <div className="space-y-1">
          <div className="h-3 w-full bg-neutral-200 rounded-none" />
          <div className="h-3 w-5/6 bg-neutral-200 rounded-none" />
        </div>
      </div>
    </div>
  );
}

export default function CollectionsMenu({ collections, isLoading }: CollectionsMenuProps) {
  const isMenuLoading = isLoading || !collections;
  const items = collections ?? [];

  // Only collapse completely if loading is done and data returns completely empty
  if (items.length === 0 && !isMenuLoading) return null;

  return (
    <div className="w-full max-w-8xl mx-auto py-6 md:py-12 px-6 sm:px-8">
      {/* Section Title Heading — Matching heavy uppercase design tracker */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-black">
          Popular Right Now
        </h2>
      </div>

      {/* Responsive Grid Engine — Strict 2 columns on small viewports, 4 columns on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
        {isMenuLoading
          ? // Render 4 static, responsive grid skeleton blocks during load states
            Array.from({ length: 4 }).map((_, index) => (
              <CollectionCardSkeleton key={`collection-skeleton-${index}`} />
            ))
          : items.map((collection) => (
              <Link
                key={collection.handle}
                href={`/collections/${collection.handle}`}
                className="group flex flex-col w-full text-left select-none"
              >
                {/* Box Image Canvas Container — All shadow/dark layers removed */}
                <div className="relative w-full aspect-square sm:aspect-4/5 overflow-hidden bg-neutral-100 rounded-none">
                  {collection.image?.url ? (
                    <Image
                      src={collection.image.url}
                      alt={collection.image.altText || collection.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      quality={80}
                      className="object-cover object-center pointer-events-none transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-200 text-neutral-400 text-sm font-bold uppercase">
                      {collection.title.slice(0, 2)}
                    </div>
                  )}
                </div>

                {/* Content Display Below Card — Flat, sharp typography layout */}
                <div className="mt-3 space-y-1">
                  <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-black leading-tight">
                    {collection.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-500 font-medium normal-case leading-normal line-clamp-2">
                    {collection.description ||
                      `Explore our premium ${collection.title.toLowerCase()} line up built for daily training and comfort.`}
                  </p>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
}
