"use client";

import { LoaderCircleIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  ProductCardContent,
  ProductCardImage,
  ProductCardImageContainer,
  ProductCardPrice,
  ProductCardTitle,
  ProductCard as ProductCardRoot,
} from "@/components/product-card/components";
import type { PageInfo, ProductCard } from "@/lib/types";

interface InfiniteProductGridProps<TParams> {
  initialProducts: ProductCard[];
  initialPageInfo: PageInfo;
  locale: string;
  outOfStockText: string;
  loadMore: (
    params: TParams & { cursor: string },
  ) => Promise<{ products: ProductCard[]; pageInfo: PageInfo }>;
  loadMoreParams: TParams;
  children: React.ReactNode;
}

export function InfiniteProductGrid<TParams>({
  initialProducts,
  initialPageInfo,
  locale,
  outOfStockText,
  loadMore,
  loadMoreParams,
  children,
}: InfiniteProductGridProps<TParams>) {
  const [additionalProducts, setAdditionalProducts] = useState<ProductCard[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>(initialPageInfo);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const seenIdsRef = useRef<Set<string>>(new Set(initialProducts.map((product) => product.id)));

  useEffect(() => {
    setAdditionalProducts([]);
    setPageInfo(initialPageInfo);
    setIsLoading(false);
    loadingRef.current = false;
    seenIdsRef.current = new Set(initialProducts.map((product) => product.id));
  }, [initialProducts, initialPageInfo]);

  const handleLoadMore = useCallback(async () => {
    if (loadingRef.current || !pageInfo.hasNextPage || !pageInfo.endCursor) return;
    loadingRef.current = true;
    setIsLoading(true);

    try {
      const result = await loadMore({ ...loadMoreParams, cursor: pageInfo.endCursor });
      const fresh = result.products.filter((product) => !seenIdsRef.current.has(product.id));
      for (const product of fresh) seenIdsRef.current.add(product.id);
      setAdditionalProducts((prev) => [...prev, ...fresh]);
      setPageInfo(result.pageInfo);
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [pageInfo, loadMore, loadMoreParams]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          handleLoadMore();
        }
      },
      { rootMargin: "400px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleLoadMore]);

  return (
    <>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {children}
        {additionalProducts.map((product) => (
          <ClientProductCard
            key={product.id}
            product={product}
            locale={locale}
            outOfStockText={outOfStockText}
          />
        ))}
      </div>

      {pageInfo.hasNextPage && (
        <div ref={sentinelRef} className="flex justify-center py-10">
          {isLoading && <LoaderCircleIcon className="size-6 animate-spin text-neutral-400" />}
        </div>
      )}
    </>
  );
}

function ClientProductCard({
  product,
  locale,
  outOfStockText,
}: {
  product: ProductCard;
  locale: string;
  outOfStockText: string;
}) {
  const href = product.defaultVariantNumericId
    ? `/products/${product.handle}?variant=${product.defaultVariantNumericId}`
    : `/products/${product.handle}`;

  // Safe checks for size selections matching original code
  const productWithVariants = product as ProductCard & {
    options?: Array<{ name: string; values: Array<{ name: string }> }>;
  };
  const sizeOption = productWithVariants.options?.find((o) => o?.name === "Size");
  const sizeValues = sizeOption?.values ?? [];

  return (
    <Link href={href} className="group relative flex flex-col h-full rounded-none outline-none">
      <ProductCardRoot>
        <ProductCardImageContainer>
          <ProductCardImage
            src={product.featuredImage?.url}
            alt={product.featuredImage?.altText || product.title}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            outOfStock={!product.availableForSale}
            outOfStockText={outOfStockText}
          />
          <ProductCardContent className="mt-3 space-y-1">
            <ProductCardTitle className="text-sm sm:text-base font-black uppercase tracking-wider text-black leading-tight line-clamp-1">
              {product.title}
            </ProductCardTitle>

            <ProductCardPrice
              amount={product.price.amount}
              currencyCode={product.price.currencyCode}
              maxAmount={product.maxPrice.amount}
              compareAtAmount={product.compareAtPrice?.amount}
              compareAtCurrencyCode={product.compareAtPrice?.currencyCode}
              locale={locale}
              className="pt-0.5 text-sm font-bold text-black"
            />

            {sizeValues.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1.5 pointer-events-none">
                {sizeValues.map((value, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center justify-center px-2 py-0.5 bg-neutral-100 border border-neutral-200 text-[10px] font-bold uppercase text-neutral-600 rounded-none"
                  >
                    {value?.name ?? "—"}
                  </span>
                ))}
              </div>
            )}
          </ProductCardContent>
        </ProductCardImageContainer>
      </ProductCardRoot>
    </Link>
  );
}
