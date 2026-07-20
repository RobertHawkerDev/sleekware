import { Container } from "@/components/ui/container";
import { Page } from "@/components/ui/page";
import { Sections } from "@/components/ui/sections";

export function ItemsSkeleton() {
  return (
    <div className="border border-neutral-200 bg-white divide-y divide-neutral-100">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 sm:p-5 flex gap-4 animate-pulse">
          <div className="w-16 h-16 bg-neutral-100 rounded-none shrink-0 border border-neutral-100" />

          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-3.5 bg-neutral-200 rounded-none w-2/3" />
            <div className="h-3 bg-neutral-100 rounded-none w-1/3" />
            <div className="h-6 bg-neutral-50 rounded-none w-20 mt-2" />
          </div>

          <div className="flex flex-col items-end shrink-0">
            <div className="h-4 bg-neutral-200 rounded-none w-14" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SummarySkeleton() {
  return (
    <div className="border border-neutral-200 p-5 bg-neutral-50/50 animate-pulse space-y-5">
      <div className="flex gap-2">
        <div className="h-11 bg-neutral-100 rounded-none flex-1" />
        <div className="h-11 bg-neutral-200 rounded-none w-20" />
      </div>

      <div className="border-t border-neutral-200 pt-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-3.5 bg-neutral-100 rounded-none w-1/3" />
          <div className="h-4 bg-neutral-200 rounded-none w-1/4" />
        </div>
        <div className="h-3 bg-neutral-100 rounded-none w-1/2" />
      </div>

      <div className="h-14 bg-neutral-200 rounded-none w-full" />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <Page>
      <Container>
        <Sections>
          <div className="h-8 bg-neutral-200 rounded-none w-48 animate-pulse border-b border-neutral-100 pb-5" />
          <div className="grid gap-5 lg:grid-cols-12">
            <div className="lg:col-span-8 xl:col-span-9">
              <ItemsSkeleton />
            </div>
            <div className="lg:col-span-4 xl:col-span-3">
              <SummarySkeleton />
            </div>
          </div>
        </Sections>
      </Container>
    </Page>
  );
}
