"use client";

import { useTranslations } from "next-intl";

import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";

import { useCart } from "./context";
import { OverlayContent } from "./overlay-content";

function CartCountBadge() {
  const { cartWithPending } = useCart();
  const count = cartWithPending?.totalQuantity ?? 0;
  if (count === 0) return null;
  return (
    <span className="text-sm font-black text-neutral-400 tracking-tight tabular-nums self-baseline">
      ({count})
    </span>
  );
}

interface CartOverlayProps {
  locale: string;
}

export function CartOverlay({ locale }: CartOverlayProps) {
  const { isOverlayOpen, setOverlayOpen } = useCart();
  const t = useTranslations("cart");

  return (
    <Sheet open={isOverlayOpen} onOpenChange={setOverlayOpen}>
      <SheetContent
        side="right"
        className="p-0 gap-0 rounded-none border-l border-neutral-200 bg-white"
      >
        {/* Fixed Title Header Block with Padding */}
        <div className="flex h-16 w-full items-center gap-2 px-6 pt-5 pb-4 border-b border-neutral-200 bg-white">
          <SheetTitle className="text-sm font-black uppercase tracking-widest text-black leading-none">
            {t("shoppingCart")}
          </SheetTitle>
          <CartCountBadge />
        </div>

        <SheetDescription className="sr-only">{t("reviewCartDescription")}</SheetDescription>

        {/* Content Section */}
        <div className="h-[calc(100%-4rem)] overflow-hidden">
          <OverlayContent locale={locale} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
