"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";

import { useCart } from "@/components/cart/context";
import { Button } from "@/components/ui/button";
import { buyNowAction } from "@/lib/cart/action";
import { variantToOptimisticInfo } from "@/lib/product";
import type { Image, Money, SelectedOption } from "@/lib/types";
import { cn } from "@/lib/utils";

import { ShopLogo } from "./shop-logo";

export interface BuyButtonVariant {
  availableForSale: boolean;
  id: string;
  image: Image | null;
  price: Money;
  requiresBundleConfiguration: boolean;
  selectedOptions: SelectedOption[];
  title: string;
}

export function BuyButtons({
  selectedVariant,
  title,
  handle,
  featuredImage,
  availableForSale = true,
}: {
  selectedVariant: BuyButtonVariant | undefined;
  title: string;
  handle: string;
  featuredImage: Image | null;
  availableForSale?: boolean;
}) {
  const selectedVariantId = selectedVariant?.id;

  const t = useTranslations("product");
  const [, startBuyNowTransition] = useTransition();
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const { addToCartOptimistic, pendingQuantity, isAddingToCart } = useCart();

  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) setIsBuyingNow(false);
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const handleAddToCart = () => {
    if (selectedVariantId && selectedVariant) {
      addToCartOptimistic(
        selectedVariantId,
        1,
        variantToOptimisticInfo(selectedVariant, {
          title,
          handle,
          featuredImage,
        }),
      );
    }
  };

  const handleBuyNow = () => {
    if (!selectedVariantId) return;
    setIsBuyingNow(true);
    startBuyNowTransition(async () => {
      try {
        const { checkoutUrl } = await buyNowAction(selectedVariantId, 1);
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          setIsBuyingNow(false);
        }
      } catch {
        setIsBuyingNow(false);
      }
    });
  };

  if (!selectedVariant) {
    return null;
  }

  const requiresBundleConfiguration = selectedVariant.requiresBundleConfiguration;
  const isOutOfStock = !selectedVariant.availableForSale;

  const getButtonText = () => {
    if (pendingQuantity > 0) return t("addingQuantity", { quantity: String(pendingQuantity) });
    if (isAddingToCart) return t("addingToCart");
    if (requiresBundleConfiguration) return t("bundleConfigurationRequired");
    if (isOutOfStock) return t("outOfStock");
    return t("addToCart");
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        type="button"
        className={cn(
          "flex flex-1 items-center justify-center gap-1.5 rounded-none h-14 bg-[#5a31f4] text-white transition-colors hover:bg-[#4b28d4] disabled:pointer-events-none disabled:opacity-40 active:scale-[0.99]",
          !availableForSale && "invisible",
        )}
        disabled={isOutOfStock || isBuyingNow || requiresBundleConfiguration}
        onClick={handleBuyNow}
      >
        {isBuyingNow ? (
          <Loader2 className="size-4 animate-spin stroke-[2.5]" />
        ) : (
          <>
            <span className="text-xs font-black uppercase tracking-widest">{t("buyWithShop")}</span>
            <ShopLogo className="h-3.5 w-auto fill-current text-white" />
          </>
        )}
      </button>
      <Button
        type="button"
        disabled={isOutOfStock || requiresBundleConfiguration}
        onClick={handleAddToCart}
        className="flex-1 justify-center h-14 rounded-none bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-100 disabled:text-neutral-400 border border-transparent font-black text-xs uppercase tracking-widest active:scale-[0.99]"
      >
        {getButtonText()}
      </Button>
    </div>
  );
}
