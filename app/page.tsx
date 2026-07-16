import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { BannerSection } from "@/components/home/banner-section";
import CollectionsMenu from "@/components/home/collections-menu";
import { ImageGrid } from "@/components/home/image-grid";
import { ProductsSlider } from "@/components/home/product-slider";
import { Page } from "@/components/ui/page";
import { Sections } from "@/components/ui/sections";
import { siteConfig } from "@/lib/config";
import { getLocale } from "@/lib/params";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import { getCollections } from "@/lib/shopify/operations/collections";
import { getHomeHeroBanner } from "@/lib/shopify/operations/home";
import { getCollectionProducts } from "@/lib/shopify/operations/products";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("seo");
  const title = t("homeTitle");
  const description = t("homeDescription");

  return {
    title: `${siteConfig.name} Official Store | Mens Fashion and Apparel`,
    description:
      "Discover premium-designed men's contemporary fashion. Shop our curated collection of modern shirts, jackets, trousers, and shoes crafted for effortless everyday style.",
    alternates: buildAlternates({ pathname: "/" }),
    openGraph: buildOpenGraph({
      title,
      description,
      url: "/",
      type: "website",
    }),
  };
}

export default async function HomePage() {
  // 1. Fetch baseline parameters and store elements concurrently
  const [locale, heroData, collections] = await Promise.all([
    getLocale(),
    getHomeHeroBanner(),
    getCollections(),
  ]);

  // 2. Concurrently fetch all product collections needed for the storefront sliders
  const [shoesResponse, trousersResponse, shirtsResponse, jacketsResponse] = await Promise.all([
    getCollectionProducts({ collection: "shoes", limit: 12, locale }),
    getCollectionProducts({ collection: "trousers", limit: 12, locale }),
    getCollectionProducts({ collection: "shirts", limit: 12, locale }),
    getCollectionProducts({ collection: "jackets", limit: 12, locale }),
  ]);

  return (
    <Page className="pt-0 overflow-x-hidden bg-neutral-50">
      <Sections>
        {/* Hero Section - logic handled internally via safe default properties */}
        <BannerSection hero={heroData} headingLevel="h1" />

        {/* Categories Menu Navigation */}
        <div className="w-full overflow-hidden">
          <CollectionsMenu collections={collections} />
        </div>

        {/* Product Sliders */}
        {shirtsResponse?.products && shirtsResponse.products.length > 0 && (
          <ProductsSlider
            title="Shirts"
            viewAllHref="/collections/shirts"
            collection={shirtsResponse}
          />
        )}

        {jacketsResponse?.products && jacketsResponse.products.length > 0 && (
          <ProductsSlider
            title="Jackets"
            viewAllHref="/collections/jackets"
            collection={jacketsResponse}
          />
        )}

        <ImageGrid />

        {trousersResponse?.products && trousersResponse.products.length > 0 && (
          <ProductsSlider
            title="Trousers"
            viewAllHref="/collections/trousers"
            collection={trousersResponse}
          />
        )}

        {shoesResponse?.products && shoesResponse.products.length > 0 && (
          <ProductsSlider
            title="Shoes"
            viewAllHref="/collections/shoes"
            collection={shoesResponse}
          />
        )}
      </Sections>
    </Page>
  );
}
