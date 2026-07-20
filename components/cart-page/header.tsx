"use client";

import { useTranslations } from "next-intl";

import { useCartRender } from "@/components/cart/context-sync";

export function Header() {
  const t = useTranslations("cart");
  const cart = useCartRender();
  const count = cart?.totalQuantity ?? 0;

  return (
    <div className="flex items-baseline gap-3 border-b border-neutral-100 pb-5 md:pb-6">
      <h1 className="text-2xl sm:text-4xl xl:text-5xl font-black uppercase tracking-tighter text-black leading-none">
        {t("shoppingCart")}
      </h1>
      {count > 0 && (
        <span className="text-sm sm:text-lg font-black tracking-tight text-neutral-400 tabular-nums">
          ({count})
        </span>
      )}
    </div>
  );
}
