import { SlidersHorizontalIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Suspense } from "react";

import { FilterSidebarSheet } from "@/components/collections/filter-sidebar-sheet";
import { CollectionFilters } from "@/components/collections/filters";
import { CollectionResultsGrid } from "@/components/collections/results-grid";
import { CollectionsSortSelect } from "@/components/collections/sort-select";
import { SortSelectFallback } from "@/components/collections/sort-select-fallback";
import { CollectionToolbar } from "@/components/collections/toolbar";
import { BreadcrumbSchema } from "@/components/schema/breadcrumb-schema";
import { CollectionSchema } from "@/components/schema/collection-schema";
import { Container } from "@/components/ui/container";
import { Page } from "@/components/ui/page";
import { Sections } from "@/components/ui/sections";
import type { CollectionResultsData, CollectionSearchState } from "@/lib/collections/server";
import type { Locale } from "@/lib/i18n";
import type { Collection } from "@/lib/types";

import { FilterPendingScope, FilterTransitionProvider } from "./filter-pending-context";

export async function CollectionDetailPage({
  collection,
  collectionResultsDataPromise,
  handle,
  locale,
  searchStatePromise,
  sortExclude,
}: {
  collection: Collection;
  collectionResultsDataPromise: Promise<CollectionResultsData>;
  handle: string;
  locale: Locale;
  searchStatePromise: Promise<CollectionSearchState>;
  sortExclude?: string[];
}) {
  const [tSearch, tBreadcrumb] = await Promise.all([
    getTranslations("search"),
    getTranslations("collections.breadcrumb"),
  ]);
  const filtersLabel = tSearch("filters");
  const sortByLabel = tSearch("sortBy");

  return (
    <FilterTransitionProvider>
      <Page className="pt-6 md:pt-10">
        <Container>
          <Sections className="gap-6">
            <CollectionHeader
              collection={collection}
              handle={handle}
              homeLabel={tBreadcrumb("home")}
            />

            <CollectionToolbar
              filterSheet={
                <FilterSidebarSheet
                  label={filtersLabel}
                  trigger={
                    <button
                      type="button"
                      className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-black border border-neutral-200 px-4 py-2.5 bg-white hover:border-black transition-colors rounded-none cursor-pointer"
                    >
                      <SlidersHorizontalIcon className="size-3.5 stroke-[2.5]" />
                      <span>{filtersLabel}</span>
                      <Suspense fallback={null}>
                        <CollectionFilterCountBadge searchStatePromise={searchStatePromise} />
                      </Suspense>
                    </button>
                  }
                >
                  <FilterPendingScope>
                    <CollectionFilters
                      collectionResultsDataPromise={collectionResultsDataPromise}
                    />
                  </FilterPendingScope>
                </FilterSidebarSheet>
              }
              sortSelect={
                <Suspense fallback={<SortSelectFallback label={sortByLabel} />}>
                  <CollectionsSortSelect exclude={sortExclude} />
                </Suspense>
              }
            />

            <FilterPendingScope>
              <CollectionResultsGrid
                locale={locale}
                collectionResultsDataPromise={collectionResultsDataPromise}
              />
            </FilterPendingScope>
          </Sections>
        </Container>
      </Page>
    </FilterTransitionProvider>
  );
}

function CollectionHeader({
  collection,
  handle,
  homeLabel,
}: {
  collection: Collection;
  handle: string;
  homeLabel: string;
}) {
  const { title, description, updatedAt } = collection;

  const breadcrumbItems = [
    { name: homeLabel, path: "/" },
    { name: title, path: `/collections/${handle}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <CollectionSchema collection={{ handle, title, description, updatedAt }} />
      <div className="border-b border-neutral-200 pb-5">
        <h1 className="text-3xl md:text-4xl font-black text-black uppercase tracking-tight">
          <Link href={`/collections/${handle}`} className="hover:opacity-90 transition-opacity">
            {title}
          </Link>
        </h1>
        {description && (
          <p className="mt-2 text-xs font-mono font-medium tracking-wide text-neutral-500 max-w-3xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </>
  );
}

async function CollectionFilterCountBadge({
  searchStatePromise,
}: {
  searchStatePromise: Promise<CollectionSearchState>;
}) {
  const { activeFilters } = await searchStatePromise;
  const activeCount = Object.values(activeFilters).reduce((count, v) => {
    if (!v) return count;
    return count + (Array.isArray(v) ? v.length : 1);
  }, 0);

  if (activeCount === 0) return null;

  return (
    <span className="flex px-1.5 py-0.5 items-center justify-center rounded-none bg-black text-[9px] font-black font-mono tracking-normal text-white ml-0.5">
      {activeCount}
    </span>
  );
}
