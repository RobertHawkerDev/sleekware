import Link from "next/link";
import type * as React from "react";

import { buildOptionUrl, type SelectedOptions } from "@/lib/product";
import type { ProductOption } from "@/lib/types";
import { cn } from "@/lib/utils";

interface OptionPickerProps extends React.ComponentProps<"div"> {
  option: ProductOption;
  selectedValue: string;
  available: Set<string> | undefined;
  handle: string;
  selectedOptions: SelectedOptions;
}

export function OptionPicker({
  option,
  selectedValue,
  available,
  handle,
  selectedOptions,
  className,
  ...props
}: OptionPickerProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <p className="text-[11px] font-black uppercase tracking-widest text-neutral-400">
        {option.name}
      </p>
      <div className="flex flex-wrap gap-2">
        {option.values.map((value) => {
          const isSelected = selectedValue === value.name;
          const isAvailable = !available || available.has(value.name);
          const href = buildOptionUrl(handle, selectedOptions, option.name, value.name);

          const classes = cn(
            "grid px-4 py-2.5 text-center text-xs uppercase tracking-wider font-black rounded-none border transition-all cursor-pointer select-none",
            isSelected
              ? "bg-black text-white border-black"
              : "bg-white text-black border-neutral-200 hover:border-black",
            !isAvailable && "opacity-20 cursor-not-allowed line-through border-neutral-200",
          );

          const label = (
            <>
              <span className="col-start-1 row-start-1">{value.name}</span>
              <span aria-hidden="true" className="invisible col-start-1 row-start-1 font-black">
                {value.name}
              </span>
            </>
          );

          if (!isAvailable) {
            return (
              <span key={value.id} className={classes}>
                {label}
              </span>
            );
          }

          return (
            <Link key={value.id} href={href} scroll={false} className={classes}>
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
