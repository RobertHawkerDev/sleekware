import type { StaticImageData } from "next/image";
import Image from "next/image";
import Link from "next/link";

import { AutoPlayVideo } from "@/components/ui/auto-play-video";
import { Button } from "@/components/ui/button";
import type { BannerSection as BannerSectionType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BannerSectionProps {
  hero: Partial<BannerSectionType> | null | undefined;
  headingLevel?: "h1" | "h2";
}

export function BannerSection({ hero, headingLevel = "h1" }: BannerSectionProps) {
  const Heading = headingLevel;

  const headline = hero?.headline ?? "OUR NEW CATALOGUE\nJUST GOT EVEN BETTER";
  const subheadline =
    hero?.subheadline ??
    "Premium cashmere knitwear, relaxed-fit slack jeans, and Italian-crafted footwear.";
  const ctaText = hero?.ctaText ?? "SHOP NOW";
  const ctaLink = hero?.ctaLink ?? "/collections/all";

  const video = hero?.backgroundVideo;
  const image = hero?.backgroundImage ?? {
    url: "/hero.jpg",
    alt: "New Season Collection",
  };

  const isStatic = image && typeof image === "object" && "src" in image;
  const hasMedia = Boolean(video || image);

  return (
    <section
      className={cn(
        // Set a fixed physical height on mobile (e.g., 500px) instead of vh to stop layout shifting
        "relative w-full h-[500px] sm:h-[600px] md:h-[80vh] overflow-hidden bg-neutral-900 flex items-end pb-12 sm:pb-16 md:pb-20 lg:pb-24",
      )}
    >
      {/* Background Media Container - Standard block display to prevent floating layout shifts */}
      <div className="absolute inset-0 w-full h-full z-0 select-none pointer-events-none">
        {video ? (
          <AutoPlayVideo
            src={video.url}
            previewImage={
              video.previewImage
                ? {
                    src: video.previewImage.url,
                    alt: video.previewImage.alt,
                  }
                : null
            }
            className="w-full h-full object-cover object-[70%_center] md:object-[75%_center]"
            priorityImage
            sizes="100vw"
          />
        ) : isStatic ? (
          <Image
            src={image as StaticImageData}
            alt={headline || "Hero background"}
            width={1200}
            height={800}
            className="w-full h-full object-cover object-[70%_center] md:object-[75%_center]"
            placeholder="blur"
            priority
          />
        ) : image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={(image as { url: string }).url}
            alt={(image as { alt: string }).alt || headline}
            className="w-full h-full object-cover object-[70%_center] md:object-[75%_center]"
          />
        ) : null}
      </div>

      {/* Static overlays */}
      {hasMedia && (
        <>
          <div className="absolute inset-0 bg-black/20 z-0 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-0 pointer-events-none" />
          <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-black/40 via-transparent to-transparent z-0 pointer-events-none" />
        </>
      )}

      {/* Content Layout Container */}
      <div className="relative w-full max-w-8xl mx-auto px-6 sm:px-8 z-10 pointer-events-none">
        <div className="max-w-xs sm:max-w-md md:max-w-xl space-y-4 md:space-y-5 pointer-events-auto text-left text-white">
          <Heading className="text-2xl sm:text-4xl xl:text-5xl font-black uppercase tracking-tighter leading-[1.2] whitespace-pre-line">
            {headline}
          </Heading>

          {subheadline && (
            <p className="text-sm sm:text-base md:text-lg font-medium text-neutral-200 max-w-sm md:max-w-md leading-relaxed drop-shadow-sm">
              {subheadline}
            </p>
          )}

          {ctaText && ctaLink && (
            <div className="pt-1 md:pt-2">
              <Button
                asChild
                className="h-auto inline-flex items-center justify-center bg-white text-black font-black px-6 py-3 md:px-8 md:py-3.5 rounded-none hover:bg-neutral-200 active:scale-[0.98] transition-all text-xs md:text-sm uppercase tracking-wider border-none shadow-md"
              >
                <Link href={ctaLink}>{ctaText}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
