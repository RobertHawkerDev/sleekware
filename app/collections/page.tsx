import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { CollectionCard } from "@/components/collections/collection-card";
import { Container } from "@/components/ui/container";
import { Page } from "@/components/ui/page";
import { Sections } from "@/components/ui/sections";
import { getLocale } from "@/lib/params";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import { getCollectionsListing } from "@/lib/shopify/operations/collections";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("collections");
  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    alternates: buildAlternates({ pathname: "/collections" }),
    openGraph: buildOpenGraph({ title, description, url: "/collections", type: "website" }),
    twitter: { card: "summary_large_image", title, description, images: ["/og-default.png"] },
  };
}

export default async function CollectionsPage() {
  const [locale, t] = await Promise.all([getLocale(), getTranslations("collections")]);
  const collections = await getCollectionsListing({ locale });
  const viewCollectionLabel = t("viewCollection");

  return (
    <Page className="pt-6 md:pt-10">
      <Container>
        <Sections className="gap-6">
          {/* Matches the clean edge-to-edge border line beneath main headers */}
          <div className="border-b border-neutral-200 pb-5">
            <h1 className="text-3xl md:text-4xl font-black text-black uppercase tracking-tight">
              {t("title")}
            </h1>
          </div>

          {collections.length > 0 ? (
            /* Perfectly aligned 4-column product/collection layout grid */
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {collections.map((collection) => (
                <CollectionCard
                  key={collection.handle}
                  collection={collection}
                  viewCollectionLabel={viewCollectionLabel}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm font-medium text-neutral-500">{t("empty")}</p>
          )}
        </Sections>
      </Container>
    </Page>
  );
}
