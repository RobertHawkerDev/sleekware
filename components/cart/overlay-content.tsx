"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { prepareCheckoutAction } from "@/lib/cart/action";

import { useCart } from "./context";
import { OverlayItem } from "./overlay-item";
import { OverlaySummary } from "./overlay-summary";
import { CartWarnings } from "./warnings";

interface OverlayContentProps {
  locale: string;
}

function CheckoutButtonContent({
  isCheckingOut,
  isUpdatingCart,
}: {
  isCheckingOut: boolean;
  isUpdatingCart: boolean;
}) {
  const t = useTranslations("cart");
  if (isCheckingOut) {
    return (
      <span className="flex items-center gap-2">
        <Loader2 className="h-3.5 w-3.5 animate-spin stroke-[2.5]" aria-hidden="true" />
        <span>{t("redirecting")}</span>
      </span>
    );
  }

  if (isUpdatingCart) {
    return (
      <span className="flex items-center gap-2">
        <Loader2 className="h-3.5 w-3.5 animate-spin stroke-[2.5]" aria-hidden="true" />
        <span>{t("updatingCart")}</span>
      </span>
    );
  }

  return <span>{t("completeCheckout")}</span>;
}

export function OverlayContent({ locale }: OverlayContentProps) {
  const router = useRouter();
  const { cart, cartWithPending, setOverlayOpen, isUpdatingCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const t = useTranslations("cart");

  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) setIsCheckingOut(false);
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const handleCheckout = async () => {
    if (!cart?.checkoutUrl && !displayCart?.checkoutUrl) return;
    setIsCheckingOut(true);

    const { checkoutUrl } = await prepareCheckoutAction();
    window.location.href = checkoutUrl || cart?.checkoutUrl || displayCart?.checkoutUrl || "";
  };

  const displayCart = cartWithPending;

  if (!displayCart || displayCart.lines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center max-w-sm mx-auto">
        <h3 className="text-xl font-black uppercase tracking-tighter text-black mb-6">
          {t("empty")}
        </h3>
        <Button
          onClick={() => {
            setOverlayOpen(false);
            router.push("/");
          }}
          className="w-full h-14 bg-black text-white text-xs font-black uppercase tracking-widest rounded-none hover:bg-neutral-800 transition-all shadow-md"
        >
          {t("continueShopping")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Scrollable Items Wrapper */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <CartWarnings />
        <ul
          className="divide-y divide-neutral-100 border border-neutral-200 bg-white rounded-none"
          aria-label={t("cartItemsLabel")}
        >
          {displayCart.lines.map((item) => (
            <OverlayItem key={item.id} item={item} locale={locale} />
          ))}
        </ul>
      </div>

      {/* Structural Summary Footer */}
      <footer className="border-t border-neutral-200 p-6 bg-neutral-50/50 space-y-5">
        <OverlaySummary cart={displayCart} locale={locale} />

        <Button
          onClick={handleCheckout}
          className="w-full h-14 justify-center bg-black text-white text-xs font-black uppercase tracking-widest rounded-none hover:bg-neutral-800 transition-all shadow-md active:scale-[0.98]"
          disabled={isCheckingOut || isUpdatingCart}
          aria-label={t("proceedToCheckout")}
        >
          <CheckoutButtonContent isCheckingOut={isCheckingOut} isUpdatingCart={isUpdatingCart} />
        </Button>
      </footer>
    </div>
  );
}
