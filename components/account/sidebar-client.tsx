"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface AccountSidebarLink {
  href: string;
  label: string;
}

export function SidebarClient({ links }: { links: AccountSidebarLink[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "rounded-none px-3 py-2.5 text-xs font-black uppercase tracking-wider transition-all",
            pathname.startsWith(link.href)
              ? "bg-neutral-100 text-black font-black"
              : "text-neutral-500 hover:bg-neutral-50 hover:text-black",
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
