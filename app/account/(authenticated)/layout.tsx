import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { AccountMobileTabs } from "@/components/account/mobile-tabs";
import { AccountSidebar } from "@/components/account/sidebar";
import { SignOutButton } from "@/components/account/sign-out-button";
import { Container } from "@/components/ui/container";
import { Page } from "@/components/ui/page";
import { Sections } from "@/components/ui/sections";
import { Skeleton } from "@/components/ui/skeleton";
import { isAuthEnabled } from "@/lib/auth";
import { requireCustomerSession } from "@/lib/auth/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("seo");
  return {
    title: t("accountTitle"),
    robots: { index: false, follow: false },
  };
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <Page className="flex flex-1 flex-col bg-white">
      <Container className="flex flex-1 flex-col gap-8 md:flex-row md:gap-12 py-6 md:py-12 max-w-8xl mx-auto px-6 sm:px-8">
        <aside className="hidden w-56 shrink-0 md:block border-r border-neutral-100 pr-6">
          <div className="sticky top-28 flex flex-col gap-6">
            <Suspense fallback={<UserInfoSkeleton />}>
              <UserInfo />
            </Suspense>
            <Suspense fallback={<SidebarSkeleton />}>
              <AccountSidebar />
            </Suspense>
            <SignOutButton />
          </div>
        </aside>

        <div className="flex flex-1 flex-col min-w-0">
          <div className="mb-4 flex items-center justify-between md:hidden">
            <Suspense fallback={<UserInfoSkeleton />}>
              <UserInfo />
            </Suspense>
            <SignOutButton />
          </div>
          <Suspense>
            <AccountMobileTabs />
          </Suspense>
          <Sections className="gap-6 pt-6 md:pt-0">
            <Suspense>
              <AccountGate>{children}</AccountGate>
            </Suspense>
          </Sections>
        </div>
      </Container>
    </Page>
  );
}

async function AccountGate({ children }: { children: React.ReactNode }) {
  if (!isAuthEnabled) notFound();
  await requireCustomerSession();
  return <>{children}</>;
}

async function UserInfo() {
  if (!isAuthEnabled) notFound();
  const session = await requireCustomerSession();

  return (
    <div className="space-y-0.5">
      <p className="text-sm font-black uppercase tracking-wider text-black">
        {session.firstName || session.email}
      </p>
      <p className="text-xs font-medium text-neutral-500 normal-case">{session.email}</p>
    </div>
  );
}

function UserInfoSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-24 rounded-none bg-neutral-200" />
      <Skeleton className="h-3 w-32 rounded-none bg-neutral-100" />
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <div className="flex flex-col gap-1">
      <Skeleton className="h-10 w-full rounded-none bg-neutral-100" />
      <Skeleton className="h-10 w-full rounded-none bg-neutral-100" />
      <Skeleton className="h-10 w-full rounded-none bg-neutral-100" />
    </div>
  );
}
