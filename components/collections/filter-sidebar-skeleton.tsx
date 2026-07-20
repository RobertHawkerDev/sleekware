import { Skeleton } from "@/components/ui/skeleton";

const FILTER_SECTION_SKELETON_KEYS = Array.from(
  { length: 3 },
  (_, index) => `collection-filter-section-skeleton-${index}`,
);
const FILTER_OPTION_SKELETON_KEYS = Array.from(
  { length: 4 },
  (_, index) => `collection-filter-option-skeleton-${index}`,
);

export function CollectionFilterSidebarSkeleton() {
  return (
    <div className="flex flex-col gap-6 rounded-none">
      {FILTER_SECTION_SKELETON_KEYS.map((sectionKey) => (
        <div
          key={sectionKey}
          className="space-y-3 pb-4 border-b border-neutral-100 last:border-b-0"
        >
          {/* Section Title Header Skeleton */}
          <Skeleton className="h-3 w-20 rounded-none bg-neutral-100" />

          {/* Options List Skeleton Container */}
          <div className="space-y-2.5 pt-1">
            {FILTER_OPTION_SKELETON_KEYS.map((optionKey) => (
              <div key={`${sectionKey}-${optionKey}`} className="flex justify-between items-center">
                {/* Left side label placeholder */}
                <Skeleton className="h-3 w-28 rounded-none bg-neutral-100" />
                {/* Right side numeric counts placeholder */}
                <Skeleton className="h-3 w-6 rounded-none bg-neutral-100/60" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
