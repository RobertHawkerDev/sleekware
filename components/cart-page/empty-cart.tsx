import { getTranslations } from "next-intl/server";
import Link from "next/link";

export async function Empty() {
  const t = await getTranslations("cart");

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20 px-6 max-w-md mx-auto text-center">
      <h2 className="text-xl font-black uppercase tracking-tighter text-black">{t("empty")}</h2>
      <Link
        href="/"
        className="w-full inline-flex items-center justify-center h-14 bg-black text-white font-black text-xs uppercase tracking-widest rounded-none hover:bg-neutral-800 transition-all shadow-md active:scale-[0.98]"
      >
        {t("continueShopping")}
      </Link>
    </div>
  );
}
