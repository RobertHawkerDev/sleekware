import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Page } from "@/components/ui/page";

export default async function NotFoundError() {
  const t = await getTranslations("common");

  return (
    <Page className="flex flex-1 flex-col bg-white">
      <Container className="flex flex-1 flex-col items-center justify-center text-center py-12 md:py-24">
        <div className="flex flex-col items-center text-center gap-4 max-w-xl mx-auto px-6 sm:px-8">
          {/* Brand-consistent Heavy Typography */}
          <h1 className="text-2xl sm:text-4xl xl:text-5xl font-black uppercase tracking-tighter leading-[1.2] text-black">
            {t("notFound")}
          </h1>

          {/* Flat Descriptive Body Copy */}
          <p className="text-sm sm:text-base font-medium text-neutral-500 max-w-sm md:max-w-md leading-relaxed normal-case">
            {t("notFoundDesc")}
          </p>

          {/* Replicated Hero Action Button Styling */}
          <div className="pt-2 md:pt-4">
            <Link
              href="/search"
              className="h-auto inline-flex items-center justify-center bg-black text-white font-black px-6 py-3 md:px-8 md:py-3.5 rounded-none hover:bg-neutral-800 active:scale-[0.98] transition-all text-xs md:text-sm uppercase tracking-wider border-none shadow-md"
            >
              {t("continueShopping")}
            </Link>
          </div>
        </div>
      </Container>
    </Page>
  );
}
