import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { BundleComponents, BundleParents } from "@/components/product-detail/bundle-components";
import { BuyButtons, type BuyButtonVariant } from "@/components/product-detail/buy-buttons";
import { ComplementaryProducts } from "@/components/product-detail/complementary-products";
import { ProductOpenGraph } from "@/components/product-detail/open-graph";
import {
  ProductInfoDescription,
  ProductInfoOptions,
} from "@/components/product-detail/product-info";
import {
  ColorImageCarouselItems,
  ColorImageGrid,
  ProductMedia,
  ProductMediaSkeleton,
} from "@/components/product-detail/product-media";
import { ProductPrice } from "@/components/product-detail/product-price";
import { ProductSpecs } from "@/components/product-detail/product-specs";
import { ProductSchema } from "@/components/product-detail/schema";
import { ShopLogo } from "@/components/product-detail/shop-logo";
import { BreadcrumbSchema } from "@/components/schema/breadcrumb-schema";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/lib/config";
import type { Locale } from "@/lib/i18n";
import {
  defaultSelectedOptions,
  getSelectedColorImage,
  getSharedImages,
  hasColorImagePartitioning,
  type SelectedOptions,
} from "@/lib/product";
import { getAvailableOptionValues } from "@/lib/shopify/encoded-variants";
import type { ProductDetails, ProductVariant } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductDetailSection({
  product,
  selectedOptionsPromise,
  variantPromise,
  locale,
}: {
  product: ProductDetails;
  selectedOptionsPromise: Promise<SelectedOptions>;
  variantPromise: Promise<ProductVariant | undefined>;
  locale: Locale;
}) {
  return (
    <>
      <ProductSchema
        product={{
          id: product.id,
          handle: product.handle,
          title: product.title,
          description: product.description,
          images: product.images,
          manufacturerName: product.manufacturerName,
          currencyCode: product.currencyCode,
          priceRange: product.priceRange,
          offerCount: product.variantsCount,
          availableForSale: product.availableForSale,
        }}
      />
      <ProductOpenGraph
        availableForSale={product.availableForSale}
        price={product.priceRange.minVariantPrice}
      />
      <BreadcrumbSchema
        items={[
          { name: siteConfig.name, path: "/" },
          { name: product.title, path: `/products/${product.handle}` },
        ]}
      />
      <div className="grid gap-12 lg:grid-cols-10 lg:items-start lg:gap-8">
        <ProductMediaArea product={product} selectedOptionsPromise={selectedOptionsPromise} />
        <ProductInfoArea
          product={product}
          selectedOptionsPromise={selectedOptionsPromise}
          variantPromise={variantPromise}
          locale={locale}
        />
      </div>
    </>
  );
}

function ProductMediaArea({
  product,
  selectedOptionsPromise,
}: {
  product: ProductDetails;
  selectedOptionsPromise: Promise<SelectedOptions>;
}) {
  if (!hasColorImagePartitioning(product.options)) {
    return (
      <ProductMedia
        otherImages={product.images}
        videos={product.videos}
        title={product.title}
        className="lg:col-span-6 rounded-none"
      />
    );
  }

  return (
    <ProductMedia
      otherImages={getSharedImages(product.images, product.options)}
      videos={product.videos}
      title={product.title}
      className="lg:col-span-6 rounded-none"
      desktopSlot={
        <Suspense
          fallback={<Skeleton className="w-full rounded-none aspect-square bg-neutral-100" />}
        >
          <ResolvedColorImageGrid
            product={product}
            selectedOptionsPromise={selectedOptionsPromise}
          />
        </Suspense>
      }
      mobileSlot={
        <Suspense
          fallback={
            <div className="relative shrink-0 w-full snap-start snap-always overflow-hidden aspect-square">
              <Skeleton className="size-full rounded-none bg-neutral-100" />
            </div>
          }
        >
          <ResolvedColorImageCarousel
            product={product}
            selectedOptionsPromise={selectedOptionsPromise}
          />
        </Suspense>
      }
    />
  );
}

async function ResolvedColorImageGrid({
  product,
  selectedOptionsPromise,
}: {
  product: ProductDetails;
  selectedOptionsPromise: Promise<SelectedOptions>;
}) {
  const image = getSelectedColorImage(product, await selectedOptionsPromise);
  if (!image) return null;
  return <ColorImageGrid images={[image]} title={product.title} />;
}

async function ResolvedColorImageCarousel({
  product,
  selectedOptionsPromise,
}: {
  product: ProductDetails;
  selectedOptionsPromise: Promise<SelectedOptions>;
}) {
  const image = getSelectedColorImage(product, await selectedOptionsPromise);
  if (!image) return null;
  return <ColorImageCarouselItems images={[image]} title={product.title} />;
}

async function ProductInfoArea({
  product,
  selectedOptionsPromise,
  variantPromise,
  locale,
}: {
  product: ProductDetails;
  selectedOptionsPromise: Promise<SelectedOptions>;
  variantPromise: Promise<ProductVariant | undefined>;
  locale: Locale;
}) {
  const { options, handle, title, featuredImage, descriptionHtml, availableForSale } = product;
  const uniformPrice = product.hasUniformPricing;
  const uniformStock = product.allVariantsInStock;
  const singleVariant = product.variantsCount === 1;
  const availableValues = getAvailableOptionValues(options, product.encodedVariantAvailability);
  const eagerSelection = singleVariant
    ? { selectedOptions: defaultSelectedOptions(product), selectedVariant: product.defaultVariant }
    : null;
  const t = await getTranslations("product");
  const buyFallbackT = uniformStock && !singleVariant ? t : null;
  const allInStock = product.defaultVariant?.availableForSale ?? availableForSale;

  return (
    <div className="grid gap-8 lg:sticky lg:top-24 lg:col-span-4 border border-neutral-200 p-6 bg-white rounded-none">
      <div data-slot="product-info-header" className="space-y-2 border-b border-neutral-200 pb-4">
        <h1 className="font-black text-black uppercase tracking-wider text-2xl md:text-3xl leading-none">
          {title}
        </h1>
        {uniformPrice ? (
          <ProductPrice
            amount={product.priceRange.minVariantPrice.amount}
            currencyCode={product.priceRange.minVariantPrice.currencyCode}
            compareAtAmount={product.compareAtPriceRange?.minVariantPrice.amount}
            locale={locale}
          />
        ) : (
          <Suspense fallback={<div className="h-7" aria-hidden />}>
            <ResolvedProductPrice variantPromise={variantPromise} locale={locale} />
          </Suspense>
        )}
      </div>

      <div className="border-b border-neutral-100 pb-6">
        {eagerSelection ? (
          <ProductInfoOptions
            availableValues={availableValues}
            options={options}
            selectedOptions={eagerSelection.selectedOptions}
            handle={handle}
            t={t}
          />
        ) : (
          <Suspense
            fallback={
              <ProductInfoOptions
                availableValues={availableValues}
                options={options}
                selectedOptions={{}}
                handle={handle}
                t={t}
                hideImages
              />
            }
          >
            <ResolvedProductInfoOptions
              availableValues={availableValues}
              options={options}
              handle={handle}
              selectedOptionsPromise={selectedOptionsPromise}
              t={t}
            />
          </Suspense>
        )}
      </div>

      <div>
        {eagerSelection ? (
          <BuyButtons
            selectedVariant={toBuyButtonVariant(eagerSelection.selectedVariant)}
            title={title}
            handle={handle}
            featuredImage={featuredImage}
            availableForSale={availableForSale}
          />
        ) : (
          <Suspense fallback={<BuyButtonsFallback t={buyFallbackT} allInStock={allInStock} />}>
            <ResolvedBuyButtons
              title={title}
              handle={handle}
              featuredImage={featuredImage}
              availableForSale={availableForSale}
              variantPromise={variantPromise}
            />
          </Suspense>
        )}
      </div>

      <BundleRelationships variant={product.defaultVariant} t={t} />

      <ComplementaryProducts handle={handle} locale={locale} title={t("pairsWith")} />

      <div className="border-t border-neutral-200 pt-6">
        <ProductInfoDescription descriptionHtml={descriptionHtml} />
      </div>

      <div className="border-t border-neutral-200 pt-6">
        <ProductSpecs metafields={product.metafields ?? []} title={t("specifications")} />
      </div>
    </div>
  );
}

function BundleRelationships({
  variant,
  t,
}: {
  variant: ProductVariant | undefined;
  t: Awaited<ReturnType<typeof getTranslations<"product">>>;
}) {
  if (!variant) return null;
  if (variant.components.length === 0 && variant.bundleParents.length === 0) return null;
  return (
    <div className="grid gap-6 border-t border-neutral-200 pt-6">
      <BundleComponents components={variant.components} title={t("bundleIncludes")} />
      <BundleParents variants={variant.bundleParents} title={t("availableInBundles")} />
    </div>
  );
}

async function ResolvedProductPrice({
  variantPromise,
  locale,
}: {
  variantPromise: Promise<ProductVariant | undefined>;
  locale: Locale;
}) {
  const selectedVariant = await variantPromise;
  if (!selectedVariant) return null;
  return (
    <ProductPrice
      amount={selectedVariant.price.amount}
      currencyCode={selectedVariant.price.currencyCode}
      compareAtAmount={selectedVariant.compareAtPrice?.amount}
      locale={locale}
    />
  );
}

async function ResolvedProductInfoOptions({
  availableValues,
  options,
  handle,
  selectedOptionsPromise,
  t,
}: {
  availableValues: Map<string, Set<string>>;
  options: ProductDetails["options"];
  handle: string;
  selectedOptionsPromise: Promise<SelectedOptions>;
  t: Awaited<ReturnType<typeof getTranslations<"product">>>;
}) {
  const selectedOptions = await selectedOptionsPromise;
  return (
    <ProductInfoOptions
      availableValues={availableValues}
      options={options}
      selectedOptions={selectedOptions}
      handle={handle}
      t={t}
    />
  );
}

function toBuyButtonVariant(variant: ProductVariant | undefined): BuyButtonVariant | undefined {
  if (!variant) return undefined;
  return {
    availableForSale: variant.availableForSale,
    id: variant.id,
    image: variant.image,
    price: variant.price,
    requiresBundleConfiguration: variant.requiresComponents && variant.components.length === 0,
    selectedOptions: variant.selectedOptions,
    title: variant.title,
  };
}

async function ResolvedBuyButtons({
  title,
  handle,
  featuredImage,
  availableForSale,
  variantPromise,
}: {
  title: string;
  handle: string;
  featuredImage: ProductDetails["featuredImage"];
  availableForSale: boolean;
  variantPromise: Promise<ProductVariant | undefined>;
}) {
  const selectedVariant = await variantPromise;
  return (
    <BuyButtons
      selectedVariant={toBuyButtonVariant(selectedVariant)}
      title={title}
      handle={handle}
      featuredImage={featuredImage}
      availableForSale={availableForSale}
    />
  );
}

function BuyButtonsFallback({
  t,
  allInStock,
}: {
  t: Awaited<ReturnType<typeof getTranslations<"product">>> | null;
  allInStock: boolean;
}) {
  if (!t) {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="h-14 rounded-none bg-[#5a31f4]/40 animate-pulse" />
        <div className="h-14 rounded-none bg-neutral-200 animate-pulse" />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-4">
      <div
        className={cn(
          "flex items-center justify-center gap-1.5 rounded-none h-14 bg-[#5a31f4] text-white opacity-40 select-none",
          !allInStock && "invisible",
        )}
      >
        <span className="text-xs font-black uppercase tracking-widest">{t("buyWithShop")}</span>
        <ShopLogo className="h-3.5 w-auto fill-current text-white" />
      </div>
      <div className="flex items-center justify-center rounded-none h-14 bg-black text-white text-xs font-black uppercase tracking-widest opacity-40 select-none">
        {allInStock ? t("addToCart") : t("outOfStock")}
      </div>
    </div>
  );
}

export function ProductDetailSectionSkeleton() {
  return (
    <div className="grid gap-12 lg:grid-cols-10 lg:items-start lg:gap-8">
      <ProductMediaSkeleton className="lg:col-span-6 rounded-none" />
      <div className="grid gap-8 lg:sticky lg:top-24 lg:col-span-4 border border-neutral-200 p-6 bg-white rounded-none">
        <Skeleton className="h-24 w-full rounded-none bg-neutral-100" />
        <Skeleton className="h-32 w-full rounded-none bg-neutral-100" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-14 rounded-none bg-neutral-100" />
          <Skeleton className="h-14 rounded-none bg-neutral-100" />
        </div>
      </div>
    </div>
  );
}
