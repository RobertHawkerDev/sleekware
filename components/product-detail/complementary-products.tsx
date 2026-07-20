import Image from "next/image";
import Link from "next/link";

import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { getProductRecommendationSets } from "@/lib/shopify/operations/products";
import type { ProductCard } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

const COMPLEMENTARY_LIMIT = 4;

export async function ComplementaryProducts({
  handle,
  locale,
  title,
}: {
  handle: string;
  locale: string;
  title: string;
}) {
  const { complementary } = await getProductRecommendationSets({ handle, locale });
  if (complementary.length === 0) return null;

  return (
    <div className="space-y-3" data-slot="complementary-products">
      <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{title}</h2>
      <ul className="divide-y divide-neutral-200 border border-neutral-200 rounded-none bg-white">
        {complementary.slice(0, COMPLEMENTARY_LIMIT).map((product: ProductCard) => (
          <li key={product.id}>
            <Link
              href={`/products/${product.handle}`}
              className="flex cursor-pointer items-center gap-4 p-3 transition-colors hover:bg-neutral-50"
            >
              {product.featuredImage ? (
                <div className="relative size-12 shrink-0 border border-neutral-200 rounded-none overflow-hidden bg-neutral-100">
                  <Image
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText || product.title}
                    fill
                    className="object-cover object-center"
                    sizes="48px"
                  />
                </div>
              ) : (
                <ImagePlaceholder className="size-12 shrink-0 border border-neutral-200 rounded-none" />
              )}

              <span className="min-w-0 flex-1 truncate font-black text-xs uppercase tracking-wider text-black">
                {product.title}
              </span>

              <span className="shrink-0 font-black text-neutral-400 text-xs tracking-wide tabular-nums">
                {formatPrice(Number(product.price.amount), product.price.currencyCode, locale)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
