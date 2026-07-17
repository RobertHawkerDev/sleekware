"use client";

import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  createAddressAction,
  deleteAddressAction,
  updateAddressAction,
} from "@/lib/customer/action";
import type { CustomerAddress, CustomerAddressInput } from "@/lib/types";

type FormState = { address: CustomerAddress; mode: "edit" } | { mode: "create" } | null;

const TEXT_FIELDS = [
  { autoComplete: "given-name", key: "firstName", labelKey: "addressFirstName", span: false },
  { autoComplete: "family-name", key: "lastName", labelKey: "addressLastName", span: false },
  { autoComplete: "organization", key: "company", labelKey: "addressCompany", span: true },
  { autoComplete: "address-line1", key: "address1", labelKey: "addressLine1", span: true },
  { autoComplete: "address-line2", key: "address2", labelKey: "addressLine2", span: true },
  { autoComplete: "address-level2", key: "city", labelKey: "addressCity", span: false },
  { autoComplete: "address-level1", key: "zoneCode", labelKey: "addressZone", span: false },
  { autoComplete: "postal-code", key: "zip", labelKey: "addressZip", span: false },
  { autoComplete: "country", key: "territoryCode", labelKey: "addressCountry", span: false },
  { autoComplete: "tel", key: "phoneNumber", labelKey: "addressPhone", span: true },
] as const satisfies readonly {
  autoComplete: string;
  key: keyof CustomerAddressInput;
  labelKey: string;
  span: boolean;
}[];

const REQUIRED_FIELDS = new Set<keyof CustomerAddressInput>(["address1", "city", "territoryCode"]);

export function AddressBook({ addresses }: { addresses: CustomerAddress[] }) {
  const t = useTranslations("account");
  const [formState, setFormState] = useState<FormState>(null);
  const [deleteTarget, setDeleteTarget] = useState<CustomerAddress | null>(null);

  return (
    <div className="grid gap-6">
      <div>
        <Button
          onClick={() => setFormState({ mode: "create" })}
          className="h-auto inline-flex items-center justify-center bg-black text-white font-black px-5 py-3 rounded-none hover:bg-neutral-800 active:scale-[0.98] transition-all text-xs uppercase tracking-wider gap-2 shadow-md"
        >
          <Plus className="size-3.5 stroke-[3]" aria-hidden="true" />
          {t("addAddress")}
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="rounded-none border border-neutral-200 p-8 text-center bg-neutral-50">
          <p className="text-sm font-medium text-neutral-500">{t("noAddresses")}</p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <li
              key={address.id}
              className="flex flex-col gap-4 rounded-none border border-neutral-200 p-5 bg-white"
            >
              <div className="flex items-start justify-between gap-3">
                <address className="text-sm font-medium text-neutral-700 leading-relaxed not-italic normal-case">
                  {address.formatted.map((line, index) => (
                    <span key={index} className="block">
                      {line}
                    </span>
                  ))}
                </address>
                {address.isDefault ? (
                  <span className="inline-flex items-center justify-center px-2 py-0.5 bg-neutral-100 border border-neutral-200 text-[10px] font-black uppercase tracking-wider text-neutral-600 rounded-none">
                    {t("defaultAddress")}
                  </span>
                ) : null}
              </div>
              <div className="mt-auto flex gap-2 pt-2 border-t border-neutral-50">
                <Button
                  onClick={() => setFormState({ address, mode: "edit" })}
                  className="h-auto inline-flex items-center justify-center bg-neutral-100 text-black font-bold px-4 py-2 rounded-none hover:bg-neutral-200 active:scale-[0.98] transition-all text-xs uppercase tracking-wider gap-1.5"
                >
                  <Pencil className="size-3 stroke-[2.5]" aria-hidden="true" />
                  {t("edit")}
                </Button>
                <Button
                  onClick={() => setDeleteTarget(address)}
                  className="h-auto inline-flex items-center justify-center bg-transparent text-neutral-500 font-bold px-3 py-2 rounded-none hover:bg-neutral-50 hover:text-red-600 active:scale-[0.98] transition-all text-xs uppercase tracking-wider gap-1.5"
                >
                  <Trash2 className="size-3 stroke-[2.5]" aria-hidden="true" />
                  {t("delete")}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={formState !== null} onOpenChange={(open) => !open && setFormState(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl rounded-none border border-neutral-200 bg-white p-6 shadow-xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg font-black uppercase tracking-tighter text-black">
              {formState?.mode === "edit" ? t("editAddress") : t("addAddress")}
            </DialogTitle>
          </DialogHeader>
          {formState !== null ? (
            <AddressForm
              address={formState.mode === "edit" ? formState.address : undefined}
              key={formState.mode === "edit" ? formState.address.id : "create"}
              onSuccess={() => setFormState(null)}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <DeleteDialog target={deleteTarget} onClose={() => setDeleteTarget(null)} />
    </div>
  );
}

function AddressForm({ address, onSuccess }: { address?: CustomerAddress; onSuccess: () => void }) {
  const t = useTranslations("account");
  const [values, setValues] = useState<CustomerAddressInput>(() => toFormValues(address));
  const [isDefault, setIsDefault] = useState(address?.isDefault ?? false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const isCurrentDefault = address?.isDefault ?? false;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setFieldErrors({});

    startTransition(async () => {
      const result = address
        ? await updateAddressAction(address.id, values, isDefault)
        : await createAddressAction(values, isDefault);

      if (result.success) {
        onSuccess();
      } else {
        setError(result.error ?? null);
        setFieldErrors(result.fieldErrors ?? {});
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {TEXT_FIELDS.map((field) => {
          const fieldError = fieldErrors[field.key];
          return (
            <div
              key={field.key}
              className={field.span ? "grid gap-1.5 sm:col-span-2" : "grid gap-1.5"}
            >
              <Label
                htmlFor={field.key}
                className="text-xs font-black uppercase tracking-wider text-black"
              >
                {t(field.labelKey)}
                {REQUIRED_FIELDS.has(field.key) ? (
                  <span className="text-red-600" aria-hidden="true">
                    {" "}
                    *
                  </span>
                ) : null}
              </Label>
              <Input
                id={field.key}
                name={field.key}
                value={values[field.key] ?? ""}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, [field.key]: event.target.value }))
                }
                autoComplete={field.autoComplete}
                required={REQUIRED_FIELDS.has(field.key)}
                aria-invalid={fieldError ? true : undefined}
                placeholder={
                  field.key === "territoryCode"
                    ? t("addressCountryPlaceholder")
                    : field.key === "zoneCode"
                      ? t("addressZonePlaceholder")
                      : undefined
                }
                className="h-11 rounded-none border-neutral-200 bg-white px-3 text-sm focus-visible:ring-0 focus-visible:border-black transition-colors placeholder:text-neutral-300"
              />
              {fieldError ? (
                <p role="alert" className="text-xs font-bold uppercase tracking-wide text-red-600">
                  {fieldError}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between rounded-none border border-neutral-200 p-4 bg-neutral-50">
        <Label
          htmlFor="isDefault"
          className="text-xs font-black uppercase tracking-wider text-black cursor-pointer"
        >
          {t("setAsDefault")}
        </Label>
        <Switch
          id="isDefault"
          checked={isDefault}
          disabled={isCurrentDefault}
          onCheckedChange={setIsDefault}
          className="data-[state=checked]:bg-black rounded-full"
        />
      </div>

      {error ? (
        <p role="alert" className="text-xs font-bold uppercase tracking-wide text-red-600">
          {error}
        </p>
      ) : null}

      <DialogFooter className="pt-2">
        <Button
          type="submit"
          disabled={isPending}
          className="h-auto w-full sm:w-auto inline-flex items-center justify-center bg-black text-white font-black px-8 py-3.5 rounded-none hover:bg-neutral-800 active:scale-[0.98] transition-all text-xs uppercase tracking-wider shadow-md disabled:opacity-50"
        >
          {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : t("save")}
        </Button>
      </DialogFooter>
    </form>
  );
}

function DeleteDialog({
  onClose,
  target,
}: {
  onClose: () => void;
  target: CustomerAddress | null;
}) {
  const t = useTranslations("account");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    if (!target) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteAddressAction(target.id);
      if (result.success) {
        onClose();
      } else {
        setError(result.error ?? null);
      }
    });
  };

  return (
    <Dialog open={target !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="rounded-none border border-neutral-200 bg-white p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-black uppercase tracking-tighter text-black">
            {t("deleteAddressTitle")}
          </DialogTitle>
          <DialogDescription className="text-sm font-medium text-neutral-500 mt-1">
            {t("deleteAddressConfirm")}
          </DialogDescription>
        </DialogHeader>
        {error ? (
          <p role="alert" className="text-xs font-bold uppercase tracking-wide text-red-600">
            {error}
          </p>
        ) : null}
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="h-auto inline-flex items-center justify-center bg-white border border-neutral-200 text-black font-black px-6 py-3 rounded-none hover:bg-neutral-50 active:scale-[0.98] transition-all text-xs uppercase tracking-wider"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isPending}
            className="h-auto inline-flex items-center justify-center bg-red-600 text-white font-black px-6 py-3 rounded-none hover:bg-red-700 active:scale-[0.98] transition-all text-xs uppercase tracking-wider shadow-md"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              t("delete")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function toFormValues(address?: CustomerAddress): CustomerAddressInput {
  return {
    address1: address?.address1 ?? "",
    address2: address?.address2 ?? "",
    city: address?.city ?? "",
    company: address?.company ?? "",
    firstName: address?.firstName ?? "",
    lastName: address?.lastName ?? "",
    phoneNumber: address?.phoneNumber ?? "",
    territoryCode: address?.territoryCode ?? "",
    zip: address?.zip ?? "",
    zoneCode: address?.zoneCode ?? "",
  };
}
