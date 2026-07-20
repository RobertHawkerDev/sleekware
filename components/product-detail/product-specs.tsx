import type { Metafield } from "@/lib/types";

interface ProductSpecsProps {
  metafields: Metafield[];
  title: string;
}

export function ProductSpecs({ metafields, title }: ProductSpecsProps) {
  if (metafields.length === 0) return null;
  return (
    <div className="space-y-4" data-slot="product-specs">
      <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{title}</h2>
      <dl className="divide-y divide-neutral-100 border-t border-b border-neutral-100 font-mono text-[11px]">
        {metafields.map((metafield) => (
          <div key={metafield.key} className="flex items-baseline justify-between gap-4 py-2.5">
            <dt className="font-bold uppercase tracking-wider text-neutral-400">
              {metafield.label}
            </dt>
            <dd className="text-right font-black uppercase tracking-wide text-black">
              {metafield.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
