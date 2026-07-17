"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface AccountTab {
  href: string;
  label: string;
}

export function MobileTabsClient({ tabs }: { tabs: AccountTab[] }) {
  const pathname = usePathname();

  return (
    <div className="flex gap-0 border-b border-neutral-200 md:hidden">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            "flex-1 px-2 py-3 text-center text-xs font-black uppercase tracking-wider transition-all",
            pathname.startsWith(tab.href)
              ? "border-b-2 border-black text-black"
              : "text-neutral-400 border-b-2 border-transparent hover:text-black",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
