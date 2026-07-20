import Image from "next/image";
import type * as React from "react";

import { Price } from "@/components/product/price";
import { cn } from "@/lib/utils";

interface ProductCardProps extends React.ComponentProps<"article"> {
  variant?: "default" | "featured";
}

function ProductCard({ variant = "default", className, children, ...props }: ProductCardProps) {
  return (
    <article
      data-slot="product-card"
      data-variant={variant}
      className={cn("group relative flex flex-col h-full rounded-none", className)}
      {...props}
    >
      {children}
    </article>
  );
}

function ProductCardBadge({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="product-card-badge" className={cn(className)} {...props}>
      {children}
    </div>
  );
}

interface ProductCardImageContainerProps extends React.ComponentProps<"div"> {
  variant?: "default" | "featured";
}

function ProductCardImageContainer({
  variant = "default",
  className,
  children,
  ...props
}: ProductCardImageContainerProps) {
  return (
    <div
      data-slot="product-card-image-container"
      data-variant={variant}
      className={cn("relative flex flex-col w-full rounded-none", className)}
      {...props}
    >
      {children}
    </div>
  );
}

type ProductCardAspectRatio = "landscape" | "portrait" | "square";

const aspectRatioClasses =
  "data-[aspect-ratio=landscape]:aspect-[4/3] data-[aspect-ratio=portrait]:aspect-[4/5] data-[aspect-ratio=square]:aspect-square";

interface ProductCardImageProps {
  src?: string | null;
  alt: string;
  sizes?: string;
  outOfStock?: boolean;
  outOfStockText?: string;
  aspectRatio?: ProductCardAspectRatio;
  className?: string;
}

function ProductCardImage({
  src,
  alt,
  sizes,
  outOfStock = false,
  outOfStockText = "Sold Out",
  aspectRatio = "portrait",
  className,
}: ProductCardImageProps) {
  return (
    <div
      data-slot="product-card-image"
      data-aspect-ratio={aspectRatio}
      className={cn(
        "relative w-full overflow-hidden bg-neutral-100 rounded-none",
        aspectRatioClasses,
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          quality={80}
          sizes={sizes}
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.01]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-neutral-200 text-xs text-neutral-400 font-bold uppercase">
          {alt.slice(0, 2)}
        </div>
      )}
      {outOfStock && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
          <span className="bg-black px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white rounded-none border border-white/20">
            {outOfStockText}
          </span>
        </div>
      )}
    </div>
  );
}

function ProductCardContent({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="product-card-content"
      className={cn("mt-3 space-y-1 text-left", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function ProductCardTitle({ className, children, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="product-card-title"
      className={cn(
        "text-sm sm:text-base font-black uppercase tracking-wider text-black leading-tight line-clamp-1",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

interface ProductCardPriceProps {
  amount: string;
  currencyCode: string;
  maxAmount?: string;
  compareAtAmount?: string;
  compareAtCurrencyCode?: string;
  locale: string;
  className?: string;
}

function ProductCardPrice({
  amount,
  currencyCode,
  maxAmount,
  compareAtAmount,
  locale,
  className,
}: ProductCardPriceProps) {
  const isRange = maxAmount != null && maxAmount !== amount;

  return (
    <div
      data-slot="product-card-price"
      className={cn(
        "pt-0.5 text-sm font-bold text-black flex flex-wrap items-baseline gap-x-2",
        className,
      )}
    >
      <Price
        amount={amount}
        currencyCode={currencyCode}
        locale={locale}
        className="text-sm font-bold text-black"
      />
      {isRange && (
        <>
          <span className="text-neutral-400 font-normal text-xs">–</span>
          <Price
            amount={maxAmount}
            currencyCode={currencyCode}
            locale={locale}
            className="text-sm font-bold text-black"
          />
        </>
      )}
      {compareAtAmount && parseFloat(compareAtAmount) > parseFloat(amount) && (
        <Price
          amount={compareAtAmount}
          currencyCode={currencyCode}
          locale={locale}
          className="text-xs font-mono font-medium text-neutral-400 line-through tracking-tight"
        />
      )}
    </div>
  );
}

function ProductCardSkeleton({
  aspectRatio = "portrait",
  className,
}: {
  aspectRatio?: ProductCardAspectRatio;
  className?: string;
}) {
  return (
    <div
      data-slot="product-card-skeleton"
      className={cn(
        "flex flex-col h-full w-full pointer-events-none animate-pulse rounded-none",
        className,
      )}
    >
      <div
        className={cn("w-full bg-neutral-200 rounded-none", aspectRatioClasses)}
        data-aspect-ratio={aspectRatio}
      />
      <div className="mt-3 space-y-2">
        <div className="h-4 w-3/4 bg-neutral-200 rounded-none" />
        <div className="h-3.5 w-1/2 bg-neutral-200 rounded-none" />
        <div className="h-4 w-1/5 bg-neutral-200 rounded-none pt-0.5" />
      </div>
    </div>
  );
}

export {
  ProductCard,
  type ProductCardAspectRatio,
  ProductCardBadge,
  ProductCardContent,
  ProductCardImage,
  ProductCardImageContainer,
  ProductCardPrice,
  ProductCardSkeleton,
  ProductCardTitle,
};
