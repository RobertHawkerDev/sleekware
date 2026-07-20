import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type * as React from "react";

import { Swatch } from "@/components/ui/swatch";
import { buildOptionUrl, type SelectedOptions } from "@/lib/product";
import type { ProductOption } from "@/lib/types";
import { cn } from "@/lib/utils";

export type ProductTranslator = Awaited<ReturnType<typeof getTranslations<"product">>>;

interface ColorPickerProps extends React.ComponentProps<"div"> {
  option: ProductOption;
  selectedValue: string;
  available: Set<string> | undefined;
  handle: string;
  selectedOptions: SelectedOptions;
  t: ProductTranslator;
  hideImages?: boolean;
}

export function ColorPicker({
  option,
  selectedValue,
  available,
  handle,
  selectedOptions,
  t,
  hideImages,
  className,
  ...props
}: ColorPickerProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <p className="text-[11px] font-black uppercase tracking-widest text-neutral-400">
        {option.name}:{" "}
        <span className="text-black font-black underline decoration-2 underline-offset-4 ml-1">
          {selectedValue}
        </span>
      </p>

      <div className="flex flex-wrap gap-2">
        {option.values.map((value) => {
          const isSelected = selectedValue === value.name;
          const isAvailable = !available || available.has(value.name);
          const imageUrl = hideImages ? undefined : value.swatch?.image || value.image;
          const href = buildOptionUrl(handle, selectedOptions, option.name, value.name);

          {
            /* Explicitly verify your <Swatch /> component uses squared edges (rounded-none) inside */
          }
          const swatch = (
            <Swatch
              color={value.swatch?.color}
              image={imageUrl}
              label={value.name}
              selected={isSelected}
            />
          );

          if (!isAvailable) {
            return (
              <span
                key={value.id}
                className="block cursor-not-allowed opacity-30 relative after:absolute after:inset-0 after:bg-[linear-gradient(to_top_right,transparent_calc(50%-1px),#000_50%,transparent_calc(50%+1px))] after:pointer-events-none"
                aria-label={t("unavailableVariantLabel", { name: option.name, value: value.name })}
              >
                {swatch}
              </span>
            );
          }

          return (
            <Link
              key={value.id}
              href={href}
              scroll={false}
              className="block cursor-pointer active:scale-95 transition-transform"
              aria-label={t("selectVariantLabel", { name: option.name, value: value.name })}
            >
              {swatch}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
