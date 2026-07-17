"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfileAction } from "@/lib/customer/action";
import type { CustomerProfile } from "@/lib/types";

export function ProfileForm({ profile }: { profile: CustomerProfile }) {
  const t = useTranslations("account");
  const [firstName, setFirstName] = useState(profile.firstName ?? "");
  const [lastName, setLastName] = useState(profile.lastName ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSaved(false);

    startTransition(async () => {
      const result = await updateProfileAction({ firstName, lastName });
      if (result.success) {
        setSaved(true);
      } else {
        setError(result.error ?? null);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid max-w-md gap-5 bg-white">
      <div className="grid gap-4 sm:grid-cols-2">
        {/* First Name Field */}
        <div className="grid gap-1.5">
          <Label
            htmlFor="firstName"
            className="text-xs font-black uppercase tracking-wider text-black"
          >
            {t("firstName")}
          </Label>
          <Input
            id="firstName"
            name="firstName"
            value={firstName}
            onChange={(event) => {
              setFirstName(event.target.value);
              setSaved(false);
            }}
            autoComplete="given-name"
            className="h-11 rounded-none border-neutral-200 bg-white px-3 text-sm focus-visible:ring-0 focus-visible:border-black transition-colors"
          />
        </div>

        {/* Last Name Field */}
        <div className="grid gap-1.5">
          <Label
            htmlFor="lastName"
            className="text-xs font-black uppercase tracking-wider text-black"
          >
            {t("lastName")}
          </Label>
          <Input
            id="lastName"
            name="lastName"
            value={lastName}
            onChange={(event) => {
              setLastName(event.target.value);
              setSaved(false);
            }}
            autoComplete="family-name"
            className="h-11 rounded-none border-neutral-200 bg-white px-3 text-sm focus-visible:ring-0 focus-visible:border-black transition-colors"
          />
        </div>
      </div>

      {/* Disabled Email Field */}
      <div className="grid gap-1.5">
        <Label htmlFor="email" className="text-xs font-black uppercase tracking-wider text-black">
          {t("email")}
        </Label>
        <Input
          id="email"
          type="email"
          value={profile.email}
          disabled
          autoComplete="email"
          className="h-11 rounded-none border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-400 cursor-not-allowed opacity-100"
        />
      </div>

      {/* High-Contrast Error Feedback */}
      {error ? (
        <p role="alert" className="text-xs font-bold uppercase tracking-wide text-red-600">
          {error}
        </p>
      ) : null}

      {/* Action Footnotes */}
      <div className="flex items-center gap-4 pt-2">
        <Button
          type="submit"
          disabled={isPending}
          className="h-auto inline-flex items-center justify-center bg-black text-white font-black px-8 py-3.5 rounded-none hover:bg-neutral-800 active:scale-[0.98] transition-all text-xs uppercase tracking-wider border-none shadow-md disabled:opacity-50 disabled:pointer-events-none"
        >
          {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : t("save")}
        </Button>
        {saved ? (
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 animate-fade-in">
            {t("profileUpdated")}
          </span>
        ) : null}
      </div>
    </form>
  );
}
