export const revalidate = 3600;

import Link from "next/link";
import { Suspense } from "react";

import { Container } from "@/components/ui/container";
import { isAuthEnabled } from "@/lib/auth";
import { navItems, siteConfig } from "@/lib/config";
import { getMenu } from "@/lib/shopify/operations/menu";

import { NavAccount, NavAccountFallback } from "./account";
import AnnouncementBar from "./announcement-bar";
import { CartIcon, CartIconFallback } from "./cart";
import { MobileMenu } from "./mobile-menu";
import { QuickLinks } from "./quick-links";
import { SearchModal } from "./search-modal";

export async function Nav({ locale }: { locale: string }) {
  const menuData = await getMenu({ handle: "main-menu" });
  const items = menuData?.items ?? navItems;

  return (
    <>
      <AnnouncementBar />

      <nav
        className="sticky top-0 z-30 w-full bg-background  transition-shadow duration-250"
        id="nav-outer"
      >
        {/* Added standard side padding to prevent elements from hugging screen edges */}
        <Container className="relative flex h-18 items-center justify-between px-6">
          {/* LEFT SIDE: Mobile Menu + Mobile Search / Desktop QuickLinks */}
          <div className="flex items-center gap-2 sm:gap-4 z-10">
            {/* Mobile Only: Burger Menu & Search Icon */}
            <div className="flex items-center gap-3 lg:hidden">
              <MobileMenu items={items} />
              <SearchModal />
            </div>

            {/* Desktop Only: Navigation Links */}
            <div className="hidden lg:block">
              <QuickLinks items={items} />
            </div>
          </div>

          {/* CENTER: Logo (Permanently absolute-centered on all screen sizes) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <Link className="flex items-center shrink-0 pointer-events-auto" href="/">
              <span className="text-base font-black uppercase tracking-[0.2em] text-black">
                {siteConfig.name}
              </span>
            </Link>
          </div>

          {/* RIGHT SIDE: Action Icons */}
          <div className="flex items-center gap-5 md:gap-8 z-10">
            {/* Desktop Only Search */}
            <div className="hidden lg:block">
              <SearchModal />
            </div>

            {/* Account & Cart remain on the right across all screen sizes */}
            {isAuthEnabled && (
              <Suspense fallback={<NavAccountFallback />}>
                <NavAccount />
              </Suspense>
            )}
            <Suspense fallback={<CartIconFallback />}>
              <CartIcon />
            </Suspense>
          </div>
        </Container>
      </nav>
    </>
  );
}
