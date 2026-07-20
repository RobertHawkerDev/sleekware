import { ChevronDownIcon } from "lucide-react";

// Byte-identical Suspense fallback for <CollectionsSortSelect> matching the SLEEKWARE button hierarchy.
export function SortSelectFallback({ label }: { label: string }) {
  return (
    <div className="flex h-fit w-fit items-center justify-between gap-2 border border-neutral-200 bg-white px-4 py-2.5 text-[11px] font-black uppercase tracking-wider text-black rounded-none whitespace-nowrap select-none">
      <span>{label}</span>
      <ChevronDownIcon className="size-3.5 stroke-[2.5] text-black opacity-60" />
    </div>
  );
}
