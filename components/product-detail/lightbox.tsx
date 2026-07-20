"use client";

import { XIcon } from "lucide-react";
import Image from "next/image";
import { Dialog as DialogPrimitive } from "radix-ui";
import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";

import { AutoPlayVideo } from "@/components/ui/auto-play-video";
import type { Image as ImageType, Video } from "@/lib/types";

type MediaItem = { type: "video"; video: Video } | { type: "image"; image: ImageType };

const LightboxContext = createContext<((item: MediaItem) => void) | null>(null);

export function Lightbox({ label, children }: { label: string; children: ReactNode }) {
  const [activeItem, setActiveItem] = useState<MediaItem | null>(null);
  const close = useCallback(() => setActiveItem(null), []);

  return (
    <LightboxContext.Provider value={setActiveItem}>
      {children}

      <DialogPrimitive.Root open={activeItem !== null} onOpenChange={(open) => !open && close()}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-60 bg-white/90 backdrop-blur-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content
            className="fixed inset-0 z-60 flex items-center justify-center p-6 md:p-12 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            aria-describedby={undefined}
            onClick={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
            <DialogPrimitive.Title className="sr-only">{`${label} enlarged`}</DialogPrimitive.Title>

            <DialogPrimitive.Close className="pointer-events-auto absolute top-6 right-6 z-10 rounded-none border border-black bg-white p-2.5 text-black hover:bg-neutral-50 active:scale-95 transition-all focus:outline-none">
              <XIcon className="size-4 stroke-[2.5]" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>

            {activeItem?.type === "image" && (
              <div className="pointer-events-none relative h-full w-full">
                <Image
                  src={activeItem.image.url}
                  alt={activeItem.image.altText || `${label} enlarged`}
                  fill
                  className="object-contain rounded-none"
                  sizes="90vw"
                  priority
                />
              </div>
            )}

            {activeItem?.type === "video" && (
              <div className="pointer-events-none flex h-full w-full items-center justify-center">
                <AutoPlayVideo
                  src={activeItem.video.url}
                  previewImage={
                    activeItem.video.previewImage
                      ? {
                          src: activeItem.video.previewImage.url,
                          alt: activeItem.video.previewImage.altText || "",
                        }
                      : null
                  }
                  sizes="90vw"
                  priorityImage
                  className="pointer-events-auto max-h-full max-w-full object-contain rounded-none"
                />
              </div>
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </LightboxContext.Provider>
  );
}

export function LightboxTrigger({ item, children }: { item: MediaItem; children: ReactNode }) {
  const open = useContext(LightboxContext);
  return (
    <button
      type="button"
      onClick={() => open?.(item)}
      className="relative h-full w-full cursor-zoom-in block outline-none"
    >
      {children}
    </button>
  );
}
