"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import type { CollectionProductsResult } from "@/lib/shopify/operations/products";

type ShopifyProduct = CollectionProductsResult["products"][number];
type ShopifyProductImage = NonNullable<ShopifyProduct["images"]>[number];

interface ProductCardProps {
  product?: ShopifyProduct | null;
  isLoading?: boolean;
}

function formatPrice(price: ShopifyProduct["price"] | null | undefined) {
  const amount = price?.amount;
  const currencyCode = price?.currencyCode;

  if (amount === undefined || amount === null || amount === "") return null;
  const numericAmount = typeof amount === "string" ? Number(amount) : amount;
  if (Number.isNaN(numericAmount)) return null;

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode || "USD",
      currencyDisplay: "narrowSymbol",
    }).format(numericAmount);
  } catch {
    return `${numericAmount}${currencyCode ? ` ${currencyCode}` : ""}`;
  }
}

function getTag(product: ShopifyProduct | null | undefined, tag: string) {
  const withTags = product as (ShopifyProduct & { tags?: string[] | null }) | null | undefined;
  return withTags?.tags?.some((t) => t?.toLowerCase() === tag.toLowerCase()) ?? false;
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col h-full w-full pointer-events-none animate-pulse">
      <div className="aspect-[4/5] w-full bg-neutral-200 rounded-none" />
      <div className="mt-3 space-y-2">
        <div className="h-4 w-3/4 bg-neutral-200 rounded-none" />
        <div className="h-3.5 w-1/2 bg-neutral-200 rounded-none" />
        <div className="h-4 w-1/5 bg-neutral-200 rounded-none pt-0.5" />
        <div className="flex flex-wrap gap-1 pt-1.5">
          <div className="h-5 w-7 bg-neutral-200 rounded-none" />
          <div className="h-5 w-7 bg-neutral-200 rounded-none" />
          <div className="h-5 w-7 bg-neutral-200 rounded-none" />
        </div>
      </div>
    </div>
  );
}

export function ProductCard({ product, isLoading }: ProductCardProps) {
  if (isLoading || !product) {
    return <ProductCardSkeleton />;
  }

  const images: ShopifyProductImage[] = product?.images ?? [];
  const primaryImage = images[0];
  const secondaryImage = images[1];
  const hasSecondaryImage = Boolean(secondaryImage?.url);

  const title = product?.title?.trim() || "Untitled product";
  const href = product?.handle ? `/products/${product.handle}` : undefined;

  const options = product?.options ?? [];
  const colorOption = options.find((option) => option?.name === "Color");
  const sizeOption = options.find((option) => option?.name === "Size");

  const colorValues = colorOption?.values ?? [];
  const sizeValues = sizeOption?.values ?? [];
  const colorName = colorValues[0]?.name;

  const priceLabel = useMemo(() => formatPrice(product?.price), [product?.price]);
  const isNew = getTag(product, "new");

  const cardBody = (
    <>
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100 rounded-none">
        {isNew && (
          <span className="absolute bottom-3 left-3 z-20 bg-black px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white rounded-none">
            New
          </span>
        )}

        <div className="w-full h-full">
          {primaryImage?.url ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.altText || title}
              // Removed absolute positioning and 'fill'. Now renders stably inside the aspect-ratio wrapper.
              width={600}
              height={750}
              quality={80}
              priority={false}
              className={`w-full h-full object-cover object-center transition-opacity duration-500 ${
                hasSecondaryImage ? "group-hover:opacity-0" : ""
              }`}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-neutral-200 text-xs text-neutral-400 font-bold uppercase">
              {title.slice(0, 2)}
            </div>
          )}

          {hasSecondaryImage && (
            <Image
              src={secondaryImage!.url}
              alt={secondaryImage!.altText || title}
              width={600}
              height={750}
              quality={80}
              className="absolute inset-0 w-full h-full object-cover object-center opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-sm sm:text-base font-black uppercase tracking-wider text-black leading-tight line-clamp-1">
          {title}
        </p>

        {colorName && (
          <p className="text-xs sm:text-sm font-medium text-neutral-700 normal-case">{colorName}</p>
        )}

        <p className="pt-0.5 text-sm font-bold text-black">{priceLabel ?? "—"}</p>

        {sizeValues.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1.5 pointer-events-none">
            {sizeValues.map((value, index) => (
              <span
                key={value?.id ?? value?.name ?? index}
                className="inline-flex items-center justify-center px-2 py-0.5 bg-neutral-100 border border-neutral-200 text-[10px] font-bold uppercase text-neutral-600 rounded-none"
              >
                {value?.name ?? "—"}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="group relative flex flex-col h-full">
      {href ? (
        <Link href={href} className="block w-full h-full">
          {cardBody}
        </Link>
      ) : (
        <div className="w-full h-full">{cardBody}</div>
      )}
    </div>
  );
}
