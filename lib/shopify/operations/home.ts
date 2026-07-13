import { cacheLife, cacheTag } from "next/cache";

import { defaultLocale, getCountryCode, getLanguageCode } from "@/lib/i18n";
import type { BannerSection as BannerSectionType } from "@/lib/types";

import { assertStorefrontOk } from "../errors";
import { storefront } from "../storefront";

type MetaobjectField = {
  key: string;
  value: string;
  reference?: {
    image?: {
      url: string;
      altText: string | null;
    };
  } | null;
};

type HeroBannerResponse = {
  metaobjects: {
    edges: Array<{
      node: {
        id: string;
        fields: MetaobjectField[];
      };
    }>;
  };
};

// 1. Target the exact metaobject type from your Shopify configuration: "home_hero_banner"
const GET_HERO_BANNER_QUERY = `#graphql
  query getHeroBanner($country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
    metaobjects(type: "home_hero_banner", first: 1) {
      edges {
        node {
          id
          fields {
            key
            value
            reference {
              ... on MediaImage {
                image {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
` as const;

export async function getHomeHeroBanner({
  locale = defaultLocale,
}: { locale?: string } = {}): Promise<BannerSectionType | undefined> {
  "use cache";
  cacheLife("max");
  cacheTag("hero-banner");

  const country = getCountryCode(locale);
  const language = getLanguageCode(locale);

  const response = await storefront.request<HeroBannerResponse>(GET_HERO_BANNER_QUERY, {
    variables: { country, language },
  });

  assertStorefrontOk(response, "getHomeHeroBanner");
  const { data } = response;

  const edge = data.metaobjects.edges[0];
  if (!edge) return undefined;

  const node = edge.node;
  const fields = node.fields;
  const getField = (key: string) => fields.find((f) => f.key === key);

  const imageReference = getField("background_image")?.reference?.image;

  // 2. Maps Shopify snake_case handles directly to your UI Banner component structure
  return {
    id: node.id,
    headline: getField("headline")?.value || "Default Title",
    subheadline: getField("subheadline")?.value ?? null,
    ctaText: getField("cta_text")?.value ?? null,
    ctaLink: getField("cta_link")?.value ?? null,
    backgroundImage: imageReference
      ? {
          url: imageReference.url,
          alt: imageReference.altText || "",
        }
      : undefined,
  };
}
