"use client";

import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/components/cart/context";
import { Button } from "@/components/ui/button";
import type { CartLine } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface CartPageItemProps {
  item: CartLine;
  locale: string;
}

export function CartPageItem({ item, locale }: CartPageItemProps) {
  const { cartWithPending, updateItemOptimistic } = useCart();
  const t = useTranslations("cart");

  const currentLine = cartWithPending?.lines.find((l) => l.id === item.id);
  const quantity = currentLine?.quantity ?? item.quantity;

  const currencyCode = item.cost.totalAmount.currencyCode;
  const unitPrice = item.merchandise.price
    ? parseFloat(item.merchandise.price.amount)
    : parseFloat(item.cost.totalAmount.amount) / item.quantity;

  return (
    <li
      className="flex flex-col sm:flex-row gap-6 p-6 items-start sm:items-center bg-white border-b border-neutral-200 last:border-b-0"
      aria-label={`${item.merchandise.product.title}`}
    >
      {/* 1. Sharp Image Thumbnail */}
      <Link
        href={`/products/${item.merchandise.product.handle}`}
        className="shrink-0 relative w-20 h-20 bg-neutral-100 border border-neutral-200 rounded-none overflow-hidden hover:opacity-90 transition-opacity"
      >
        <Image
          src={item.merchandise.image?.url || item.merchandise.product.featuredImage.url}
          alt={item.merchandise.image?.altText || item.merchandise.product.featuredImage.altText}
          fill
          className="object-cover object-center"
          sizes="80px"
        />
      </Link>

      {/* 2. Text Meta Block */}
      <div className="flex-1 min-w-0 space-y-1">
        <Link href={`/products/${item.merchandise.product.handle}`}>
          <h3 className="font-black text-sm uppercase tracking-wider text-black hover:text-neutral-600 transition-colors">
            {item.merchandise.product.title}
          </h3>
        </Link>

        {item.merchandise.selectedOptions.length > 0 && (
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
            {item.merchandise.selectedOptions.map((option) => option.value).join(" / ")}
          </p>
        )}
      </div>

      {/* 3. Pure Geometric Stepper Block */}
      <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-center border border-neutral-200 bg-white rounded-none h-10">
          <button
            type="button"
            onClick={() => updateItemOptimistic(item.id || "", quantity - 1)}
            disabled={!item.canUpdateQuantity || quantity === 1}
            aria-label={t("decreaseQuantity")}
            className="size-10 flex items-center justify-center text-black disabled:text-neutral-200 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
          >
            <MinusIcon className="size-3.5 stroke-[2.5]" />
          </button>

          <span className="inline-flex items-center justify-center min-w-10 text-center text-xs font-black text-black tabular-nums">
            {quantity}
          </span>

          <button
            type="button"
            onClick={() => updateItemOptimistic(item.id || "", quantity + 1)}
            disabled={!item.canUpdateQuantity || quantity === 99}
            aria-label={t("increaseQuantity")}
            className="size-10 flex items-center justify-center text-black disabled:text-neutral-200 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
          >
            <PlusIcon className="size-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Inline Trash Button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => updateItemOptimistic(item.id || "", 0)}
          disabled={!item.canRemove}
          aria-label={t("removeItem")}
          className="size-10 rounded-none border border-neutral-200 text-neutral-400 hover:text-red-600 hover:border-red-200 transition-colors"
        >
          <Trash2Icon className="size-4 stroke-[2.5]" />
        </Button>
      </div>

      {/* 4. Price Readout Block */}
      <div className="text-base font-black text-black tabular-nums shrink-0 self-start sm:self-center sm:text-right sm:min-w-[100px] mt-2 sm:mt-0">
        {formatPrice(unitPrice * quantity, currencyCode, locale)}
      </div>
    </li>
  );
}
