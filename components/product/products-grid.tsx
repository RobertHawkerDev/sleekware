import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Suspense } from "react";

import { ProductCard, ProductCardSkeleton } from "@/components/product-card/product-card";
import type { Locale } from "@/lib/i18n";
import { searchIndexProducts } from "@/lib/shopify/operations/products";
import { cn } from "@/lib/utils";

interface ProductsGridSkeletonProps {
  count: number;
  className?: string;
}

export function ProductsGridSkeleton({ count, className }: ProductsGridSkeletonProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-6 lg:grid-cols-4", className)}>
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

interface ProductsGridProps {
  collectionUrl?: string;
  limit: number;
  locale: Locale;
  title: string;
}

export async function ProductsGrid({ collectionUrl, limit, locale, title }: ProductsGridProps) {
  const t = await getTranslations("product");

  return (
    <div className="space-y-8">
      <div className="flex items-baseline justify-between border-b border-neutral-200 pb-4">
        <h2 className="text-sm font-black uppercase tracking-widest text-black">{title}</h2>
        {collectionUrl && (
          <Link
            href={collectionUrl}
            className="text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-black transition-colors"
          >
            {t("viewAll")} —
          </Link>
        )}
      </div>
      <Suspense fallback={<ProductsGridSkeleton count={limit} />}>
        <ProductsGridContent limit={limit} locale={locale} outOfStockText={t("outOfStock")} />
      </Suspense>
    </div>
  );
}

async function ProductsGridContent({
  limit,
  locale,
  outOfStockText,
}: {
  limit: number;
  locale: Locale;
  outOfStockText: string;
}) {
  const { products } = await searchIndexProducts({ limit, locale });

  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-6 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          locale={locale}
          outOfStockText={outOfStockText}
        />
      ))}
    </div>
  );
}
