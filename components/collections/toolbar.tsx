import type * as React from "react";

interface CollectionToolbarProps {
  filterSheet: React.ReactNode;
  sortSelect: React.ReactNode;
  // Omit on pages without a count so the slot doesn't reserve space.
  resultCount?: React.ReactNode;
}

export function CollectionToolbar({
  filterSheet,
  sortSelect,
  resultCount,
}: CollectionToolbarProps) {
  return (
    <div className="flex w-full items-center justify-between border-b border-neutral-200 py-3 rounded-none bg-white">
      {/* Action triggers container */}
      <div className="flex items-center gap-4">{filterSheet}</div>

      {/* Context info and sort options */}
      <div className="flex items-center gap-4">
        {resultCount !== undefined && (
          <div className="hidden items-center text-[10px] font-mono uppercase tracking-wider text-neutral-400 sm:flex tabular-nums">
            {resultCount}
          </div>
        )}
        {sortSelect}
      </div>
    </div>
  );
}
