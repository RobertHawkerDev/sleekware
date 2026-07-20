"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { AutoPlayVideo } from "@/components/ui/auto-play-video";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import type { Image as ImageType, Video } from "@/lib/types";
import { cn } from "@/lib/utils";

import { Lightbox, LightboxTrigger } from "./lightbox";

type MediaItem =
  | { type: "image"; image: ImageType }
  | { type: "placeholder" }
  | { type: "video"; video: Video };

function mediaKey(item: MediaItem) {
  if (item.type === "image") return item.image.url;
  if (item.type === "video") return item.video.url;
  return "placeholder";
}

function MediaImage({
  item,
  title,
  idx,
  sizes,
  priority,
  eager,
  className,
}: {
  item: Extract<MediaItem, { type: "image" }>;
  title: string;
  idx: number;
  sizes: string;
  priority: boolean;
  eager: boolean;
  className?: string;
}) {
  return (
    <Image
      src={item.image.url}
      alt={item.image.altText || `${title} image ${idx + 1}`}
      fill
      className={cn("object-cover rounded-none", className)}
      sizes={sizes}
      priority={priority}
      loading={priority || eager ? "eager" : "lazy"}
      draggable={false}
    />
  );
}

function MediaVideo({
  item,
  sizes,
  priority,
  className,
}: {
  item: Extract<MediaItem, { type: "video" }>;
  sizes: string;
  priority: boolean;
  className?: string;
}) {
  return (
    <AutoPlayVideo
      src={item.video.url}
      previewImage={
        item.video.previewImage
          ? {
              src: item.video.previewImage.url,
              alt: item.video.previewImage.altText || "",
            }
          : null
      }
      sizes={sizes}
      priorityImage={priority}
      className={cn("h-full w-full scale-[1.04] object-cover rounded-none", className)}
    />
  );
}

function Carousel({
  mediaItems,
  title,
  hasColorSlot,
  children,
}: {
  mediaItems: MediaItem[];
  title: string;
  hasColorSlot: boolean;
  children?: React.ReactNode;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [itemCount, setItemCount] = useState(mediaItems.length);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevMediaRef = useRef<string>("");
  const t = useTranslations("product");

  const joinedKey = mediaItems.map(mediaKey).join(",");
  if (prevMediaRef.current && prevMediaRef.current !== joinedKey) {
    scrollContainerRef.current?.scrollTo({ left: 0 });
    setSelectedIndex(0);
  }
  prevMediaRef.current = joinedKey;

  const scrollToImage = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollTo({
      left: index * container.offsetWidth,
      behavior: "smooth",
    });
    setSelectedIndex(index);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const sync = () => {
      const width = container.offsetWidth;
      if (width === 0) return;
      const total = Math.max(1, container.children.length);
      const newIndex = Math.min(Math.max(0, Math.round(container.scrollLeft / width)), total - 1);
      setItemCount(total);
      setSelectedIndex(newIndex);
    };

    sync();

    container.addEventListener("scroll", sync, { passive: true });
    const resizeObserver = new ResizeObserver(sync);
    resizeObserver.observe(container);
    const mutationObserver = new MutationObserver(sync);
    mutationObserver.observe(container, { childList: true });

    return () => {
      container.removeEventListener("scroll", sync);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <div className="space-y-4">
      <div
        ref={scrollContainerRef}
        className="relative overflow-x-auto flex snap-x snap-mandatory overscroll-x-contain scrollbar-hide -mx-4 w-[calc(100%+2rem)] border-b border-neutral-200"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
        {mediaItems.map((item, idx) => {
          const priority = !hasColorSlot && idx === 0;
          const eager = hasColorSlot ? idx === 0 : idx === 1;
          return (
            <div
              key={mediaKey(item)}
              className="relative shrink-0 w-full snap-start snap-always overflow-hidden aspect-square bg-neutral-50"
            >
              {item.type === "video" ? (
                <MediaVideo item={item} sizes="100vw" priority={priority || eager} />
              ) : item.type === "placeholder" ? (
                <ImagePlaceholder className="size-full border-0 rounded-none" />
              ) : (
                <MediaImage
                  item={item}
                  title={title}
                  idx={idx}
                  sizes="100vw"
                  priority={priority}
                  eager={eager}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Industrial Rectangle Segment Bar Indicators */}
      <div className={cn("flex justify-center gap-1", itemCount <= 1 && "invisible")}>
        {Array.from({ length: itemCount }, (_, idx) => (
          <button
            type="button"
            key={idx}
            onClick={() => scrollToImage(idx)}
            className={cn(
              "h-1 rounded-none transition-all cursor-pointer",
              idx === selectedIndex ? "bg-black w-6" : "bg-neutral-200 w-3 hover:bg-neutral-300",
            )}
            aria-label={t("goToImage", { number: String(idx + 1) })}
          />
        ))}
      </div>
    </div>
  );
}

function GridItem({
  item,
  title,
  idx,
  priority,
  eager,
}: {
  item: MediaItem;
  title: string;
  idx: number;
  priority: boolean;
  eager: boolean;
}) {
  return (
    <div className="relative w-full overflow-hidden aspect-square border border-neutral-200 bg-neutral-50 rounded-none">
      {item.type === "video" ? (
        <MediaVideo
          item={item}
          sizes="(min-width: 1024px) 25vw, 50vw"
          priority={priority || eager}
        />
      ) : item.type === "placeholder" ? (
        <ImagePlaceholder className="size-full rounded-none border-0" />
      ) : (
        <LightboxTrigger item={item}>
          <MediaImage
            item={item}
            title={title}
            idx={idx}
            sizes="(min-width: 1024px) 25vw, 50vw"
            priority={priority}
            eager={eager}
          />
        </LightboxTrigger>
      )}
    </div>
  );
}

function Grid({
  mediaItems,
  title,
  hasColorSlot,
  interactive = true,
  children,
}: {
  mediaItems: MediaItem[];
  title: string;
  hasColorSlot: boolean;
  interactive?: boolean;
  children?: React.ReactNode;
}) {
  const grid = (
    <div className="grid grid-cols-2 gap-4">
      {children}
      {mediaItems.map((item, idx) => {
        const priority = !hasColorSlot && idx === 0;
        return (
          <GridItem
            key={mediaKey(item)}
            item={item}
            title={title}
            idx={idx}
            priority={priority}
            eager
          />
        );
      })}
    </div>
  );

  return interactive ? <Lightbox label={title}>{grid}</Lightbox> : grid;
}

export function ColorImageGrid({ images, title }: { images: ImageType[]; title: string }) {
  return images.map((image, idx) => (
    <GridItem
      key={image.url}
      item={{ type: "image", image }}
      title={title}
      idx={idx}
      priority={idx === 0}
      eager
    />
  ));
}

export function ColorImageCarouselItems({ images, title }: { images: ImageType[]; title: string }) {
  return images.map((image, idx) => {
    const priority = idx === 0;
    const eager = idx === 1;
    return (
      <div
        key={image.url}
        className="relative shrink-0 w-full snap-start snap-always overflow-hidden aspect-square bg-neutral-50"
      >
        <Image
          src={image.url}
          alt={image.altText || `${title} image ${idx + 1}`}
          fill
          className="object-cover rounded-none"
          sizes="100vw"
          priority={priority}
          loading={priority || eager ? "eager" : "lazy"}
          draggable={false}
        />
      </div>
    );
  });
}

export function ProductMediaSkeleton({ className }: { className?: string }) {
  const tile =
    "aspect-square w-full animate-pulse bg-neutral-100 rounded-none border border-neutral-200";
  return (
    <div className={className}>
      <div className="grid gap-4 lg:hidden -mx-4">
        <div className={tile} />
      </div>
      <div className="hidden lg:grid grid-cols-2 gap-4">
        <div className={tile} />
        <div className={tile} />
        <div className={tile} />
        <div className={tile} />
      </div>
    </div>
  );
}

export function ProductMedia({
  otherImages,
  videos,
  title,
  className,
  desktopSlot,
  mobileSlot,
}: {
  otherImages: ImageType[];
  videos: Video[];
  title: string;
  className?: string;
  desktopSlot?: React.ReactNode;
  mobileSlot?: React.ReactNode;
}) {
  const sharedMediaItems: MediaItem[] = [
    ...videos.map((video): MediaItem => ({ type: "video", video })),
    ...otherImages.map((image): MediaItem => ({ type: "image", image })),
  ];

  const hasColorSlot = !!mobileSlot || !!desktopSlot;
  const isEmpty = sharedMediaItems.length === 0 && !hasColorSlot;
  const mediaItems: MediaItem[] = isEmpty ? [{ type: "placeholder" }] : sharedMediaItems;

  return (
    <div className={className}>
      <div className="lg:hidden">
        <Carousel mediaItems={mediaItems} title={title} hasColorSlot={hasColorSlot}>
          {mobileSlot}
        </Carousel>
      </div>
      <div className="hidden lg:block">
        <Grid
          mediaItems={mediaItems}
          title={title}
          hasColorSlot={hasColorSlot}
          interactive={!isEmpty}
        >
          {desktopSlot}
        </Grid>
      </div>
    </div>
  );
}
