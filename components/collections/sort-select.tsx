"use client";

import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

const SORT_OPTIONS = [
  { value: "best-matches", key: "bestMatches" },
  { value: "best-selling", key: "bestSelling" },
  { value: "product-name-ascending", key: "nameAscending" },
  { value: "product-name-descending", key: "nameDescending" },
  { value: "price-low-to-high", key: "priceLowToHigh" },
  { value: "price-high-to-low", key: "priceHighToLow" },
  { value: "date-old-to-new", key: "dateOldToNew" },
  { value: "date-new-to-old", key: "dateNewToOld" },
] as const;

export function CollectionsSortSelect({ exclude }: { exclude?: string[] } = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tSort = useTranslations("search.sort");
  const tSearch = useTranslations("search");
  const [isPending, startTransition] = useTransition();

  const options = exclude ? SORT_OPTIONS.filter((o) => !exclude.includes(o.value)) : SORT_OPTIONS;
  const currentSort = searchParams.get("sort") || "best-matches";

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "best-matches") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const activeOption = options.find((o) => o.value === currentSort);

  return (
    <Select value={currentSort} onValueChange={handleSortChange} disabled={isPending}>
      <SelectTrigger className="flex h-fit w-fit items-center justify-between gap-2 border border-neutral-200 bg-white px-4 py-2.5 text-[11px] font-black uppercase tracking-wider text-black rounded-none shadow-none outline-none focus:ring-0 focus:border-black hover:border-black transition-colors cursor-pointer disabled:opacity-50">
        <span>
          {tSearch("sortBy")}
          {activeOption && currentSort !== "best-matches" && (
            <span className="text-neutral-400 font-mono tracking-normal ml-1">
              : {tSort(activeOption.key)}
            </span>
          )}
        </span>
      </SelectTrigger>
      <SelectContent className="rounded-none border-neutral-200 bg-white shadow-md p-1 min-w-[180px]">
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="text-[10px] font-black uppercase tracking-wider text-neutral-500 data-[selected]:text-black focus:bg-neutral-50 focus:text-black rounded-none transition-colors py-2 px-3 cursor-pointer"
          >
            {tSort(option.key)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
