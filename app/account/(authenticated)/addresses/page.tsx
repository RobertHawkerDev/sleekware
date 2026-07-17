import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { AddressBook } from "@/components/account/address-book";
import { AccountPageHeader } from "@/components/account/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { getCustomerAddresses } from "@/lib/shopify/operations/customer";

export default async function AddressesPage() {
  const t = await getTranslations("account");

  return (
    <>
      <AccountPageHeader title={t("addresses")} description={t("addressesDescription")} />
      <Suspense fallback={<AddressesSkeleton />}>
        <AddressesContent />
      </Suspense>
    </>
  );
}

async function AddressesContent() {
  const addresses = await getCustomerAddresses();
  return <AddressBook addresses={addresses} />;
}

function AddressesSkeleton() {
  return (
    <div className="grid gap-4">
      <Skeleton className="h-11 w-32 rounded-none bg-neutral-200" />
      <Skeleton className="h-32 w-full rounded-none bg-neutral-100" />
      <Skeleton className="h-32 w-full rounded-none bg-neutral-100" />
    </div>
  );
}
