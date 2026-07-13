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

  // Consolidate fallback states inside the component layout context
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
        "relative w-full h-[70vh] sm:h-[75vh] md:h-[90vh] overflow-hidden bg-neutral-900 flex items-end pb-12 sm:pb-16 md:pb-20 lg:pb-24",
      )}
    >
      {/* Background Media - Fluid responsive scaling keeps right-side subject nicely cropped */}
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
          className="absolute inset-0 h-full w-full object-cover object-[70%_center] md:object-[75%_center] scale-125 md:scale-[1.45] transform transition-transform duration-500"
          priorityImage
          sizes="100vw"
        />
      ) : isStatic ? (
        <Image
          src={image as StaticImageData}
          alt={headline || "Hero background"}
          fill
          className="object-cover object-[70%_center] md:object-[75%_center] scale-125 md:scale-[1.25] transform transition-transform duration-500"
          placeholder="blur"
          priority
          sizes="100vw"
        />
      ) : image ? (
        <Image
          src={(image as { url: string }).url}
          alt={(image as { alt: string }).alt || headline}
          fill
          className="object-cover object-[70%_center] md:object-[75%_center] scale-125 md:scale-[1.25] transform transition-transform duration-500"
          priority
          sizes="100vw"
        />
      ) : null}

      {/* Cross-device legibility overlays (mixes uniform darkening with a bottom-to-top gradient) */}
      {hasMedia && (
        <>
          <div className="absolute inset-0 bg-black/20 z-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-0" />
          <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-black/40 via-transparent to-transparent z-0" />
        </>
      )}

      {/* Content Layout Container - Aligned precisely with header structural bounds */}
      <div className="relative w-full max-w-8xl mx-auto px-6 sm:px-8 z-10 pointer-events-none">
        <div className="max-w-xs sm:max-w-md md:max-w-xl space-y-4 md:space-y-5 pointer-events-auto text-left text-white">
          {/* Main Title - Tightened text leading block lines */}
          <Heading className="text-2xl sm:text-4xl xl:text-5xl font-black uppercase tracking-tighter leading-[1.2] whitespace-pre-line">
            {headline}
          </Heading>

          {/* Subheadline Copy */}
          {subheadline && (
            <p className="text-sm sm:text-base md:text-lg font-medium text-neutral-200 max-w-sm md:max-w-md leading-relaxed drop-shadow-sm">
              {subheadline}
            </p>
          )}

          {/* Call to Action Button - Standardized, clean size profile */}
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
