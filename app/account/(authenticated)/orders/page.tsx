import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Suspense } from "react";

import { formatOrderDate, OrderStatusBadge } from "@/components/account/order-display";
import { AccountPageHeader } from "@/components/account/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { defaultLocale } from "@/lib/i18n";
import { getCustomerOrders } from "@/lib/shopify/operations/customer";
import { encodeOrderId } from "@/lib/shopify/utils";
import { formatPrice } from "@/lib/utils";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ after?: string; before?: string }>;
}) {
  const t = await getTranslations("account");

  return (
    <>
      <AccountPageHeader title={t("orders")} description={t("ordersDescription")} />
      <Suspense fallback={<OrdersSkeleton />}>
        <OrdersContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function OrdersContent({
  searchParams,
}: {
  searchParams: Promise<{ after?: string; before?: string }>;
}) {
  const [params, t] = await Promise.all([searchParams, getTranslations("account")]);
  const { orders, pageInfo } = await getCustomerOrders({
    after: params.after,
    before: params.before,
  });

  if (orders.length === 0) {
    return (
      <div className="rounded-none border border-neutral-200 p-8 text-center bg-neutral-50">
        <p className="text-sm font-medium text-neutral-500">{t("noOrders")}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <ul className="grid gap-3">
        {orders.map((order) => {
          const numericId = encodeOrderId(order.id);

          return (
            <li key={order.id}>
              <Link
                href={`/account/orders/${numericId}`}
                className="group flex items-center justify-between gap-4 rounded-none border border-neutral-200 p-4 transition-all bg-white hover:border-black"
              >
                <div className="grid gap-0.5">
                  <span className="text-sm font-black uppercase tracking-wider text-black group-hover:text-neutral-700 transition-colors">
                    {order.name}
                  </span>
                  <span className="text-xs font-medium text-neutral-500 normal-case">
                    {formatOrderDate(order.processedAt)}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <OrderStatusBadge status={order.fulfillmentStatus} />
                  <span className="text-sm font-bold text-black tabular-nums">
                    {formatPrice(
                      Number(order.totalPrice.amount),
                      order.totalPrice.currencyCode,
                      defaultLocale,
                    )}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {pageInfo.hasNextPage || pageInfo.hasPreviousPage ? (
        <div className="flex items-center justify-between pt-2">
          {pageInfo.hasPreviousPage && pageInfo.startCursor ? (
            <Button asChild>
              <Link
                href={`/account/orders?before=${encodeURIComponent(pageInfo.startCursor)}`}
                className="h-auto inline-flex items-center justify-center bg-white border border-neutral-200 text-black font-black px-5 py-2.5 rounded-none hover:bg-neutral-50 active:scale-[0.98] transition-all text-xs uppercase tracking-wider shadow-sm"
              >
                {t("newerOrders")}
              </Link>
            </Button>
          ) : (
            <span />
          )}
          {pageInfo.hasNextPage && pageInfo.endCursor ? (
            <Button asChild>
              <Link
                href={`/account/orders?after=${encodeURIComponent(pageInfo.endCursor)}`}
                className="h-auto inline-flex items-center justify-center bg-white border border-neutral-200 text-black font-black px-5 py-2.5 rounded-none hover:bg-neutral-50 active:scale-[0.98] transition-all text-xs uppercase tracking-wider shadow-sm"
              >
                {t("olderOrders")}
              </Link>
            </Button>
          ) : (
            <span />
          )}
        </div>
      ) : null}
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="grid gap-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-20 w-full rounded-none bg-neutral-100" />
      ))}
    </div>
  );
}
