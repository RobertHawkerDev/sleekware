import { getTranslations } from "next-intl/server";
import Link from "next/link";

import type { Locale } from "@/lib/i18n";
import type { ProductCard as ProductCardType } from "@/lib/types";

import {
  type ProductCardAspectRatio,
  ProductCardBadge,
  ProductCardContent,
  ProductCardImage,
  ProductCardImageContainer,
  ProductCardPrice,
  ProductCard as ProductCardRoot,
  ProductCardSkeleton,
  ProductCardTitle,
} from "./components";

export interface ProductCardProps {
  product: ProductCardType;
  locale: Locale;
  aspectRatio?: ProductCardAspectRatio;
  variant?: "default" | "featured";
  outOfStockText?: string;
  sizes?: string;
  className?: string;
}

export async function ProductCard({
  product,
  locale,
  aspectRatio = "portrait",
  variant = "default",
  outOfStockText,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw",
  className,
}: ProductCardProps) {
  const isFeatured = variant === "featured";
  const t = isFeatured ? await getTranslations("product") : null;

  // Safely check for "new" tag via an optional type cast to prevent TS compilation errors
  const productWithTags = product as ProductCardType & { tags?: string[] };
  const isNew = productWithTags.tags?.some((tag) => tag?.toLowerCase() === "new") ?? false;

  return (
    <Link href={`/products/${product.handle}`} className={className}>
      <ProductCardRoot variant={variant}>
        <ProductCardImageContainer variant={variant}>
          {isFeatured && t && (
            <ProductCardBadge className="absolute bottom-3 left-3 z-20">
              <span className="bg-black px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white rounded-none">
                {t("featuredBadge")}
              </span>
            </ProductCardBadge>
          )}
          {!isFeatured && isNew && (
            <ProductCardBadge className="absolute bottom-3 left-3 z-20">
              <span className="bg-black px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white rounded-none">
                New
              </span>
            </ProductCardBadge>
          )}

          <ProductCardImage
            src={product.featuredImage?.url}
            alt={product.featuredImage?.altText || product.title}
            sizes={sizes}
            outOfStock={!product.availableForSale}
            outOfStockText={outOfStockText}
            aspectRatio={aspectRatio}
          />
          <ProductCardContent>
            <ProductCardTitle>{product.title}</ProductCardTitle>
            <ProductCardPrice
              amount={product.price.amount}
              currencyCode={product.price.currencyCode}
              maxAmount={product.maxPrice.amount}
              compareAtAmount={product.compareAtPrice?.amount}
              compareAtCurrencyCode={product.compareAtPrice?.currencyCode}
              locale={locale}
            />
          </ProductCardContent>
        </ProductCardImageContainer>
      </ProductCardRoot>
    </Link>
  );
}

export { ProductCardSkeleton };
