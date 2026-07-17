import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import {
  formatOrderDate,
  humanizeStatus,
  OrderStatusBadge,
} from "@/components/account/order-display";
import { AccountPageHeader } from "@/components/account/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { defaultLocale } from "@/lib/i18n";
import { getCustomerOrder } from "@/lib/shopify/operations/customer";
import { decodeOrderId } from "@/lib/shopify/utils";
import type { Money, OrderLineItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<OrderDetailSkeleton />}>
      <OrderDetailContent params={params} />
    </Suspense>
  );
}

async function OrderDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, t] = await Promise.all([params, getTranslations("account")]);

  if (!id) notFound();

  const decoded = decodeOrderId(id);
  if (!decoded) notFound();

  const orderGid = decoded.startsWith("gid://") ? decoded : `gid://shopify/Order/${decoded}`;

  let order;
  try {
    order = await getCustomerOrder(orderGid);
  } catch {
    notFound();
  }
  if (!order) notFound();

  return (
    <>
      <AccountPageHeader title={order.name} description={formatOrderDate(order.processedAt)} />

      <div className="flex flex-wrap items-center gap-2 mt-4 mb-6">
        <OrderStatusBadge status={order.fulfillmentStatus} />
        {order.financialStatus ? (
          <span className="inline-flex items-center justify-center px-2 py-0.5 border border-neutral-200 bg-white text-[10px] font-bold uppercase tracking-wider text-neutral-600 rounded-none">
            {humanizeStatus(order.financialStatus)}
          </span>
        ) : null}
      </div>

      <ul className="grid divide-y divide-neutral-100 border border-neutral-200 rounded-none mb-6 bg-white">
        {order.lineItems.map((item, index) => (
          <OrderLineItemRow key={index} item={item} />
        ))}
      </ul>

      <dl className="grid gap-2.5 rounded-none border border-neutral-200 p-5 text-sm mb-6 bg-neutral-50/50">
        <SummaryRow label={t("subtotal")} money={order.subtotal} />
        <SummaryRow label={t("shipping")} money={order.totalShipping} />
        <SummaryRow label={t("tax")} money={order.totalTax} />
        <div className="flex items-center justify-between border-t border-neutral-200 pt-3 font-black uppercase text-xs tracking-wider text-black">
          <dt>{t("total")}</dt>
          <dd className="font-bold text-sm tabular-nums text-black">
            {formatPrice(
              Number(order.totalPrice.amount),
              order.totalPrice.currencyCode,
              defaultLocale,
            )}
          </dd>
        </div>
      </dl>

      {order.shippingAddress && order.shippingAddress.formatted.length > 0 ? (
        <div className="grid gap-2 rounded-none border border-neutral-200 p-5 mb-6 bg-white">
          <h2 className="text-xs font-black uppercase tracking-wider text-black">
            {t("shippingAddress")}
          </h2>
          <address className="text-sm font-medium text-neutral-500 not-italic normal-case leading-relaxed">
            {order.shippingAddress.formatted.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </address>
        </div>
      ) : null}

      <div className="flex gap-2">
        <Button asChild>
          <a
            href={order.statusPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-auto inline-flex items-center justify-center bg-black text-white font-black px-6 py-3.5 rounded-none hover:bg-neutral-800 active:scale-[0.98] transition-all text-xs uppercase tracking-wider border-none shadow-md"
          >
            {t("viewOrderStatus")}
          </a>
        </Button>
      </div>
    </>
  );
}

function OrderLineItemRow({ item }: { item: OrderLineItem }) {
  return (
    <li className="flex items-center gap-4 p-4">
      <div className="relative size-16 shrink-0 overflow-hidden bg-neutral-100 rounded-none border border-neutral-100">
        {item.image ? (
          <Image
            src={item.image.url}
            alt={item.image.altText || item.title}
            fill
            className="object-cover object-center pointer-events-none"
            sizes="64px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-neutral-400 uppercase bg-neutral-200">
            {item.title.slice(0, 2)}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="truncate text-sm font-black uppercase tracking-wider text-black leading-tight">
          {item.title}
        </p>
        {item.variantTitle && (
          <p className="truncate text-xs font-medium text-neutral-600 normal-case">
            {item.variantTitle}
          </p>
        )}
        <p className="text-xs font-bold text-neutral-400">× {item.quantity}</p>
      </div>
      {item.totalPrice ? (
        <span className="text-sm font-bold text-black tabular-nums">
          {formatPrice(Number(item.totalPrice.amount), item.totalPrice.currencyCode, defaultLocale)}
        </span>
      ) : null}
    </li>
  );
}

function SummaryRow({ label, money }: { label: string; money: Money | null }) {
  if (!money) return null;
  return (
    <div className="flex items-center justify-between text-xs font-medium normal-case">
      <dt className="text-neutral-500">{label}</dt>
      <dd className="font-bold text-neutral-900 tabular-nums">
        {formatPrice(Number(money.amount), money.currencyCode, defaultLocale)}
      </dd>
    </div>
  );
}

function OrderDetailSkeleton() {
  return (
    <div className="grid gap-4">
      <Skeleton className="h-10 w-44 rounded-none bg-neutral-200" />
      <Skeleton className="h-28 w-full rounded-none bg-neutral-100" />
      <Skeleton className="h-36 w-full rounded-none bg-neutral-100" />
    </div>
  );
}
