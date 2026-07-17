"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/client";

export function SignOutButton() {
  const t = useTranslations("account");

  return (
    <Button
      variant="outline"
      onClick={() => signOut()}
      className="h-auto w-full inline-flex items-center justify-center bg-white border border-neutral-200 text-black font-black px-4 py-2.5 rounded-none hover:bg-neutral-50 active:scale-[0.98] transition-all text-xs uppercase tracking-wider"
    >
      {t("signOut")}
    </Button>
  );
}
