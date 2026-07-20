import Image from "next/image";
import Link from "next/link";

import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import type { CollectionWithThumbnail } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface CollectionCardProps {
  className?: string;
  collection: CollectionWithThumbnail;
  sizes?: string;
  viewCollectionLabel: string;
}

export function CollectionCard({
  className,
  collection,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  viewCollectionLabel,
}: CollectionCardProps) {
  const { handle, thumbnail, title } = collection;

  return (
    <Link
      aria-label={`${viewCollectionLabel}: ${title}`}
      className={cn(
        "flex flex-col h-full overflow-hidden rounded-none border border-neutral-200 bg-white transition-colors hover:border-neutral-400 group",
        className,
      )}
      href={`/collections/${handle}`}
    >
      {/* Square aspect ratio frame for clean alignment */}
      <div
        data-slot="collection-card-image"
        className="relative aspect-square overflow-hidden bg-white border-b border-neutral-200"
      >
        {thumbnail ? (
          <Image
            alt={thumbnail.altText || title}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.01]"
            fill
            sizes={sizes}
            src={thumbnail.url}
            priority
          />
        ) : (
          <ImagePlaceholder className="size-full rounded-none border-0" />
        )}
      </div>

      {/* Styled text layout matching the bold, tracking-heavy product detail bars */}
      <div className="p-3 bg-white">
        <h2
          data-slot="collection-card-title"
          className="text-[11px] font-black text-black uppercase tracking-wider line-clamp-1"
        >
          {title}
        </h2>
      </div>
    </Link>
  );
}
