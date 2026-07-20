import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetailSection } from "@/components/product-detail/product-detail-section";
import { RelatedProductsSection } from "@/components/product/related-products-section";
import { Container } from "@/components/ui/container";
import { Page } from "@/components/ui/page";
import { getLocale } from "@/lib/params";
import {
  defaultSelectedOptions,
  parseSelectedOptions,
  type SelectedOptions,
  toSelectedOptionList,
} from "@/lib/product";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import {
  getCatalogProducts,
  getProduct,
  getProductVariant,
} from "@/lib/shopify/operations/products";
import type { ProductVariant } from "@/lib/types";

const PLACEHOLDER_HANDLE = "__placeholder__";

// Helper type for Next.js 15+ Page Component parameters
interface PageProps<T extends string> {
  params: Promise<{ handle: string; locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function buildProductMetadata(
  handle: string,
  locale: string,
  canonicalPath: string,
): Promise<Metadata> {
  const product = await getProduct({ handle, locale });
  if (!product) notFound();
  const images = product.featuredImage
    ? [
        {
          url: product.featuredImage.url,
          width: product.featuredImage.width,
          height: product.featuredImage.height,
          alt: product.featuredImage.altText,
        },
      ]
    : ["/og-default.png"];

  return {
    title: product.seo.title,
    description: product.seo.description,
    alternates: buildAlternates({
      pathname: canonicalPath,
    }),
    openGraph: buildOpenGraph({
      title: product.seo.title,
      description: product.seo.description,
      url: canonicalPath,
      images,
    }),
    twitter: {
      card: "summary_large_image",
      title: product.seo.title,
      description: product.seo.description,
      images,
    },
  };
}

export async function generateStaticParams() {
  try {
    const { products } = await getCatalogProducts({ limit: 1 });
    const first = products[0];
    return [{ handle: first ? first.handle : PLACEHOLDER_HANDLE }];
  } catch {
    return [{ handle: PLACEHOLDER_HANDLE }];
  }
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[handle]">): Promise<Metadata> {
  const [{ handle }, locale] = await Promise.all([params, getLocale()]);

  if (handle === PLACEHOLDER_HANDLE) return {};

  return buildProductMetadata(handle, locale, `/products/${handle}`);
}

export default async function ProductPage({
  params,
  searchParams,
}: PageProps<"/products/[handle]">) {
  const [{ handle }, locale] = await Promise.all([params, getLocale()]);
  if (handle === PLACEHOLDER_HANDLE) notFound();

  const product = await getProduct({ handle, locale });
  if (!product) notFound();

  const selectedOptionsPromise: Promise<SelectedOptions> = searchParams.then((sp) => ({
    ...defaultSelectedOptions(product),
    ...parseSelectedOptions(product.options, sp ?? {}),
  }));

  const variantPromise: Promise<ProductVariant | undefined> = searchParams.then(async (sp) => {
    const fromUrl = parseSelectedOptions(product.options, sp ?? {});
    if (Object.keys(fromUrl).length === 0) return product.defaultVariant;
    return getProductVariant({
      handle,
      locale,
      selectedOptions: toSelectedOptionList({ ...defaultSelectedOptions(product), ...fromUrl }),
    });
  });

  return (
    <Page className="py-8 md:py-12">
      <Container className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
        <div className="space-y-16 md:space-y-24">
          <ProductDetailSection
            product={product}
            selectedOptionsPromise={selectedOptionsPromise}
            variantPromise={variantPromise}
            locale={locale}
          />
          <div className="border-t border-neutral-200 pt-16">
            <RelatedProductsSection handle={handle} locale={locale} />
          </div>
        </div>
      </Container>
    </Page>
  );
}
