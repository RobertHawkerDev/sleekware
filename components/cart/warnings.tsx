"use client";

import { AlertTriangle, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { useCart } from "@/components/cart/context";

export function CartWarnings() {
  const { lastWarnings, clearWarnings } = useCart();
  const t = useTranslations("cart");

  if (lastWarnings.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="border border-black bg-white rounded-none p-4 text-xs"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          className="size-4 stroke-[2.5] mt-0.5 shrink-0 text-black"
          aria-hidden="true"
        />

        <div className="flex-1 space-y-1">
          <p className="font-black uppercase tracking-wider text-black">{t("warningsTitle")}</p>
          <ul className="space-y-0.5 font-medium uppercase tracking-wide text-neutral-500 text-[10px]">
            {lastWarnings.map((w) => (
              <li key={`${w.code}:${w.target}`} className="list-none normal-case">
                — {w.message}
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={clearWarnings}
          aria-label={t("dismissWarnings")}
          className="shrink-0 size-6 inline-flex items-center justify-center rounded-none border border-neutral-200 text-black hover:bg-neutral-50 cursor-pointer active:scale-95 transition-all"
        >
          <X className="size-3.5 stroke-[2.5]" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
