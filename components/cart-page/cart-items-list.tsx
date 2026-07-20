"use client";

import { useTranslations } from "next-intl";

import { useCartRender } from "@/components/cart/context-sync";

import { CartPageItem } from "./cart-page-item";

interface CartItemsListProps {
  locale: string;
}

export function CartItemsList({ locale }: CartItemsListProps) {
  const cart = useCartRender();
  const t = useTranslations("cart");
  const lines = cart?.lines ?? [];

  return lines.length === 0 ? (
    <div className="text-center py-20 border border-neutral-200 bg-neutral-50 rounded-none">
      <p className="text-xs font-black uppercase tracking-widest text-neutral-400">{t("empty")}</p>
    </div>
  ) : (
    <ul
      className="flex flex-col border border-neutral-200 bg-white rounded-none"
      aria-label={t("cartItemsLabel")}
    >
      {lines.map((item) => (
        <CartPageItem key={item.id} item={item} locale={locale} />
      ))}
    </ul>
  );
}
