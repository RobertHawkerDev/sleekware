import Image from "next/image";
import Link from "next/link";

import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import type { ProductVariantComponent, ProductVariantReference } from "@/lib/types";

interface BundleListItem {
  href: string;
  image: ProductVariantReference["image"];
  key: string;
  quantity?: number;
  title: string;
}

interface BundleComponentsProps {
  components: ProductVariantComponent[];
  title: string;
}

export function BundleComponents({ components, title }: BundleComponentsProps) {
  if (components.length === 0) return null;
  const items = components.map(
    ({ quantity, variant }): BundleListItem => ({
      href: `/products/${variant.product.handle}`,
      image: variant.image ?? variant.product.featuredImage,
      key: variant.id,
      quantity,
      title: variant.product.title,
    }),
  );
  return <BundleProductList items={items} title={title} />;
}

interface BundleParentsProps {
  title: string;
  variants: ProductVariantReference[];
}

export function BundleParents({ title, variants }: BundleParentsProps) {
  const byProduct = new Map<string, ProductVariantReference>();
  for (const variant of variants) {
    if (!byProduct.has(variant.product.handle)) byProduct.set(variant.product.handle, variant);
  }
  if (byProduct.size === 0) return null;
  const items = [...byProduct.values()].map(
    (variant): BundleListItem => ({
      href: `/products/${variant.product.handle}`,
      image: variant.product.featuredImage ?? variant.image,
      key: variant.product.handle,
      title: variant.product.title,
    }),
  );
  return <BundleProductList items={items} title={title} />;
}

interface BundleProductListProps {
  items: BundleListItem[];
  title: string;
}

function BundleProductList({ items, title }: BundleProductListProps) {
  return (
    <div className="space-y-3" data-slot="bundle-components">
      <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{title}</h2>
      <ul className="divide-y divide-neutral-200 border border-neutral-200 rounded-none bg-white">
        {items.map((item) => (
          <li key={item.key}>
            <Link
              href={item.href}
              className="flex cursor-pointer items-center gap-3 p-3 transition-colors hover:bg-neutral-50"
            >
              {item.image ? (
                <div className="relative size-10 shrink-0 border border-neutral-200 rounded-none overflow-hidden bg-neutral-100">
                  <Image
                    src={item.image.url}
                    alt={item.image.altText || item.title}
                    fill
                    className="object-cover object-center"
                    sizes="40px"
                  />
                </div>
              ) : (
                <ImagePlaceholder className="size-10 shrink-0 border border-neutral-200 rounded-none" />
              )}
              <span className="min-w-0 flex-1 truncate font-black text-xs uppercase tracking-wider text-black">
                {item.title}
              </span>
              {item.quantity && item.quantity > 1 ? (
                <span className="font-black text-neutral-400 text-xs tabular-nums">
                  ×{item.quantity}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
