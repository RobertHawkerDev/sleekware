"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useCart } from "@/components/cart/context";
import { useCartRender } from "@/components/cart/context-sync";
import { DiscountForm } from "@/components/cart/discount-form";
import { cartDiscountAmount } from "@/lib/cart";
import { prepareCheckoutAction } from "@/lib/cart/action";
import { cn, formatPrice } from "@/lib/utils";

function CheckoutLink({
  checkoutUrl,
  isUpdatingCart,
  updatingText,
  checkoutText,
}: {
  checkoutUrl: string;
  isUpdatingCart: boolean;
  updatingText: string;
  checkoutText: string;
}) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) setIsCheckingOut(false);
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const baseClassName =
    "flex items-center justify-center w-full h-14 rounded-none text-xs font-black uppercase tracking-widest transition-all shadow-md";

  if (isUpdatingCart || isCheckingOut) {
    return (
      <span
        className={cn(baseClassName, "bg-black text-white opacity-40 cursor-not-allowed")}
        aria-disabled="true"
      >
        <span className="flex items-center gap-2">
          <Loader2 className="h-3.5 w-3.5 animate-spin stroke-[2.5]" aria-hidden="true" />
          <span>{isCheckingOut ? checkoutText : updatingText}</span>
        </span>
      </span>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        baseClassName,
        "bg-black text-white hover:bg-neutral-800 cursor-pointer active:scale-[0.98]",
      )}
      onClick={async () => {
        setIsCheckingOut(true);
        const { checkoutUrl: url } = await prepareCheckoutAction();
        window.location.href = url || checkoutUrl;
      }}
    >
      <span>{checkoutText}</span>
    </button>
  );
}

interface SummaryProps {
  locale: string;
}

export function Summary({ locale }: SummaryProps) {
  const t = useTranslations("cart");
  const { isUpdatingCart } = useCart();
  const cart = useCartRender();

  if (!cart) return null;

  const lineSubtotal = cart.lines.reduce(
    (sum, line) => sum + parseFloat(line.cost.totalAmount.amount),
    0,
  );
  const estimatedTotal = Math.max(0, lineSubtotal - cartDiscountAmount(cart));
  const currencyCode = cart.cost.subtotalAmount.currencyCode;

  return (
    <div className="border border-neutral-200 p-5 bg-neutral-50/50 space-y-5">
      <DiscountForm cart={cart} locale={locale} />

      <div className="border-t border-neutral-200 pt-4" aria-label={t("estimatedTotal")}>
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-neutral-500">
            {t("estimatedTotal")}
          </span>
          <span className="text-xl font-black text-black tracking-tight tabular-nums">
            {formatPrice(estimatedTotal, currencyCode, locale)}
          </span>
        </div>
        <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider mt-1.5 normal-case leading-normal">
          {t("taxesAndShippingNote")}
        </p>
      </div>

      <CheckoutLink
        checkoutUrl={cart.checkoutUrl}
        isUpdatingCart={isUpdatingCart}
        updatingText={t("updatingCart")}
        checkoutText={t("completeCheckout")}
      />
    </div>
  );
}
