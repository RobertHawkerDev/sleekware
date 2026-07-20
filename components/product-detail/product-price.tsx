import type * as React from "react";

import { DiscountBadge } from "@/components/product/discount-badge";
import { Price } from "@/components/product/price";
import { cn } from "@/lib/utils";

interface ProductPriceProps extends React.ComponentProps<"div"> {
  amount: string;
  currencyCode: string;
  compareAtAmount?: string;
  locale?: string;
}

export function ProductPrice({
  amount,
  currencyCode,
  compareAtAmount,
  locale,
  className,
  ...props
}: ProductPriceProps) {
  const discountPercent =
    compareAtAmount && Number(compareAtAmount) > Number(amount)
      ? Math.round(((Number(compareAtAmount) - Number(amount)) / Number(compareAtAmount)) * 100)
      : null;

  return (
    <div className={cn("flex items-baseline gap-3 flex-wrap", className)} {...props}>
      <Price
        amount={amount}
        currencyCode={currencyCode}
        locale={locale}
        className="text-xl font-black text-black"
      />
      {compareAtAmount && Number(compareAtAmount) > Number(amount) && (
        <Price
          amount={compareAtAmount}
          currencyCode={currencyCode}
          locale={locale}
          className="text-sm font-black line-through text-neutral-300"
        />
      )}
      {discountPercent && <DiscountBadge percent={discountPercent} />}
    </div>
  );
}
