import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { AccountPageHeader } from "@/components/account/page-header";
import { ProfileForm } from "@/components/account/profile-form";
import { Skeleton } from "@/components/ui/skeleton";
import { getCustomerProfile } from "@/lib/shopify/operations/customer";

export default async function ProfilePage() {
  const t = await getTranslations("account");

  return (
    <>
      <AccountPageHeader title={t("profile")} description={t("profileDescription")} />
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent />
      </Suspense>
    </>
  );
}

async function ProfileContent() {
  const profile = await getCustomerProfile();
  if (!profile) return null;

  return <ProfileForm profile={profile} />;
}

function ProfileSkeleton() {
  return (
    <div className="grid max-w-md gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Skeleton className="h-4 w-16 rounded-none bg-neutral-200" />
          <Skeleton className="h-11 w-full rounded-none bg-neutral-100" />
        </div>
        <div className="grid gap-1.5">
          <Skeleton className="h-4 w-16 rounded-none bg-neutral-200" />
          <Skeleton className="h-11 w-full rounded-none bg-neutral-100" />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Skeleton className="h-4 w-16 rounded-none bg-neutral-200" />
        <Skeleton className="h-11 w-full rounded-none bg-neutral-100" />
      </div>
      {/* Replaces rounded-lg button skeleton with high-contrast sharp rectangle */}
      <Skeleton className="h-12 w-28 rounded-none bg-neutral-200" />
    </div>
  );
}
