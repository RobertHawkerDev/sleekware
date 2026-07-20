"use client";

import { useTranslations } from "next-intl";

import { DiscountForm } from "@/components/cart/discount-form";
import { Price } from "@/components/product/price";
import { cartDiscountAmount } from "@/lib/cart";
import type { Cart } from "@/lib/types";

interface OverlaySummaryProps {
  cart: Cart;
  locale: string;
}

export function OverlaySummary({ cart, locale }: OverlaySummaryProps) {
  const t = useTranslations("cart");
  const currencyCode = cart.cost.subtotalAmount.currencyCode;

  const lineSubtotal = cart.lines.reduce(
    (sum, line) => sum + parseFloat(line.cost.totalAmount.amount),
    0,
  );
  const estimatedTotal = Math.max(0, lineSubtotal - cartDiscountAmount(cart));

  return (
    <div className="space-y-4">
      <DiscountForm cart={cart} locale={locale} />

      <div className="border-t border-neutral-200 pt-3" aria-label={t("estimatedTotal")}>
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-neutral-500">
            {t("estimatedTotal")}
          </span>
          <Price
            amount={estimatedTotal.toString()}
            currencyCode={currencyCode}
            locale={locale}
            className="text-lg font-black text-black tracking-tight tabular-nums"
          />
        </div>
        <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider mt-1 normal-case leading-normal">
          {t("taxesAndShippingNote")}
        </p>
      </div>
    </div>
  );
}
