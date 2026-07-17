import { defaultLocale } from "@/lib/i18n";

export function humanizeStatus(status: string): string {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatOrderDate(iso: string, locale: string = defaultLocale): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(iso));
}

export function OrderStatusBadge({ status }: { status: string }) {
  const isFulfilled = status === "FULFILLED";
  return (
    <span
      className={`inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-none ${
        isFulfilled
          ? "bg-black text-white"
          : "bg-neutral-100 text-neutral-600 border border-neutral-200"
      }`}
    >
      {humanizeStatus(status)}
    </span>
  );
}
