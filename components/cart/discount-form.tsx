"use client";

import { Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import { useCart } from "@/components/cart/context";
import { Price } from "@/components/product/price";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cartDiscountAmount } from "@/lib/cart";
import { applyDiscountCodeAction, removeDiscountCodeAction } from "@/lib/cart/action";
import type { Cart, Money } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DiscountFormProps {
  cart: Cart;
  locale: string;
}

function discountTotal(cart: Cart): Money | null {
  const amount = cartDiscountAmount(cart);
  if (amount === 0) return null;
  return {
    amount: amount.toString(),
    currencyCode: cart.discountAllocations[0].discountedAmount.currencyCode,
  };
}

export function DiscountForm({ cart, locale }: DiscountFormProps) {
  const t = useTranslations("cart");
  const { setCart, setWarnings } = useCart();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = code.trim();
    if (!trimmed) {
      setError(t("discountInvalidCode"));
      return;
    }

    startTransition(async () => {
      const result = await applyDiscountCodeAction(trimmed);
      if (result.cart) setCart(result.cart);
      if (result.success) {
        setWarnings(result.warnings ?? []);
        setCode("");
      } else {
        setError(result.error ?? t("discountInvalidCode"));
      }
    });
  };

  const handleRemove = (target: string) => {
    setError(null);
    startTransition(async () => {
      const result = await removeDiscountCodeAction(target);
      if (result.success && result.cart) {
        setCart(result.cart);
        setWarnings(result.warnings ?? []);
      } else if (result.error) {
        setError(result.error);
      }
    });
  };

  const totalDiscount = discountTotal(cart);

  return (
    <div className="space-y-2.5">
      <form onSubmit={handleApply} className="flex gap-2">
        <Input
          type="text"
          name="discountCode"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (error) setError(null);
          }}
          placeholder={t("discountCode")}
          aria-label={t("discountCode")}
          aria-invalid={error ? true : undefined}
          disabled={isPending}
          autoComplete="off"
          spellCheck={false}
          className="flex-1 h-11 border-neutral-200 focus-visible:ring-black placeholder:text-neutral-400 rounded-none bg-white text-xs font-medium uppercase tracking-wider px-3"
        />
        <Button
          type="submit"
          disabled={isPending || code.trim() === ""}
          className="h-11 px-5 rounded-none bg-neutral-200 text-black hover:bg-neutral-300 font-black text-xs uppercase tracking-widest disabled:opacity-40 transition-colors"
        >
          {isPending ? (
            <Loader2 className="size-3.5 animate-spin stroke-[2.5]" aria-hidden="true" />
          ) : (
            t("applyDiscount")
          )}
        </Button>
      </form>

      {error ? (
        <p role="alert" className="text-[10px] font-bold uppercase tracking-wide text-red-600">
          {error}
        </p>
      ) : null}

      {cart.discountCodes.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5" aria-label={t("discount")}>
          {cart.discountCodes.map((d) => (
            <li key={d.code} className="w-full">
              <span
                className={cn(
                  "flex items-center justify-between border p-2.5 text-xs font-black uppercase tracking-wider rounded-none",
                  d.applicable
                    ? "bg-black text-white border-black"
                    : "bg-neutral-100 text-neutral-400 border-neutral-200 line-through",
                )}
              >
                <span className="flex items-center gap-2">
                  <span>{d.code}</span>
                  {!d.applicable && (
                    <span className="text-[9px] font-medium tracking-normal border border-neutral-300 px-1 no-underline">
                      {t("discountNotApplicable")}
                    </span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(d.code)}
                  aria-label={`${t("removeDiscount")}: ${d.code}`}
                  disabled={isPending}
                  className="size-5 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed hover:opacity-70 transition-opacity"
                >
                  <X className="size-3.5 stroke-[2.5]" aria-hidden="true" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {totalDiscount ? (
        <div className="flex items-baseline justify-between text-xs border-t border-neutral-200/60 pt-2.5">
          <span className="font-bold text-neutral-500 uppercase tracking-wider">
            {t("discount")}
          </span>
          <span className="tabular-nums font-black text-black">
            <span aria-hidden="true" className="mr-0.5">
              −
            </span>
            <Price
              amount={totalDiscount.amount}
              currencyCode={totalDiscount.currencyCode}
              locale={locale}
              className="inline text-xs font-black"
            />
          </span>
        </div>
      ) : null}
    </div>
  );
}
