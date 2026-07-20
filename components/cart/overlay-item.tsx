"use client";

import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { CartLine } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

import { useCart } from "./context";

interface OverlayItemProps {
  item: CartLine;
  locale: string;
}

export function OverlayItem({ item, locale }: OverlayItemProps) {
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
      className="flex gap-4 p-4 bg-white border-b border-neutral-100 last:border-b-0"
      aria-label={`${item.merchandise.product.title} - ${formatPrice(unitPrice * quantity, currencyCode, locale)}`}
    >
      {/* Rigid Frame Image */}
      <Link
        href={`/products/${item.merchandise.product.handle}`}
        className="shrink-0 relative w-16 h-16 bg-neutral-100 border border-neutral-200 rounded-none overflow-hidden hover:opacity-90 transition-opacity"
      >
        <Image
          src={item.merchandise.image?.url || item.merchandise.product.featuredImage.url}
          alt={item.merchandise.image?.altText || item.merchandise.product.featuredImage.altText}
          fill
          className="object-cover object-center"
          sizes="64px"
        />
      </Link>

      {/* Meta + Action Block */}
      <div className="flex-1 min-w-0 flex flex-col gap-3 justify-between">
        <div className="space-y-0.5">
          <Link href={`/products/${item.merchandise.product.handle}`}>
            <h3 className="font-black text-xs uppercase tracking-wider text-black hover:text-neutral-600 transition-colors line-clamp-1">
              {item.merchandise.product.title}
            </h3>
          </Link>

          {item.merchandise.selectedOptions.length > 0 && (
            <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wide">
              {item.merchandise.selectedOptions.map((option) => option.value).join(" / ")}
            </p>
          )}

          {item.components.length > 0 && (
            <div className="mt-2 border-l border-neutral-200 pl-2 space-y-1">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                {t("bundleIncludes")}
              </p>
              <ul className="space-y-0.5">
                {item.components.map((component) => (
                  <li
                    key={component.id}
                    className="text-[10px] text-neutral-500 uppercase tracking-wide truncate"
                  >
                    {component.merchandise.product.title}{" "}
                    {component.quantity > 1 ? `(×${component.quantity})` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Industrial Counter Grid */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-neutral-200 bg-white h-8 rounded-none">
            <button
              type="button"
              onClick={() => updateItemOptimistic(item.id || "", quantity - 1)}
              disabled={!item.canUpdateQuantity || quantity === 1}
              aria-label={t("decreaseQuantity")}
              className="size-8 flex items-center justify-center text-black disabled:text-neutral-200 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
            >
              <MinusIcon className="size-3 stroke-[2.5]" />
            </button>

            <span className="inline-flex items-center justify-center min-w-8 text-center text-xs font-black text-black tabular-nums">
              {quantity}
            </span>

            <button
              type="button"
              onClick={() => updateItemOptimistic(item.id || "", quantity + 1)}
              disabled={!item.canUpdateQuantity || quantity === 99}
              aria-label={t("increaseQuantity")}
              className="size-8 flex items-center justify-center text-black disabled:text-neutral-200 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
            >
              <PlusIcon className="size-3 stroke-[2.5]" />
            </button>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 rounded-none border border-neutral-200 text-neutral-400 hover:text-red-600 hover:border-red-200 transition-colors"
            onClick={() => updateItemOptimistic(item.id || "", 0)}
            disabled={!item.canRemove}
            aria-label={t("removeItem")}
          >
            <Trash2Icon className="size-3.5 stroke-[2.5]" />
          </Button>
        </div>
      </div>

      {/* Item Total Price */}
      <div className="text-sm font-black text-black tabular-nums py-0.5">
        {formatPrice(unitPrice * quantity, currencyCode, locale)}
      </div>
    </li>
  );
}
