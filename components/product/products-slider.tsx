import { getTranslations } from "next-intl/server";

import type { ProductCardAspectRatio } from "@/components/product-card/components";
import { ProductCard } from "@/components/product-card/product-card";
import {
  Slider,
  SliderContent,
  SliderHeader,
  SliderItem,
  SliderNav,
  SliderTitle,
} from "@/components/ui/slider";
import type { Locale } from "@/lib/i18n";
import type { ProductCard as ProductCardType } from "@/lib/types";

interface ProductsSliderProps {
  title: string;
  products: ProductCardType[];
  locale: Locale;
  aspectRatio?: ProductCardAspectRatio;
}

export async function ProductsSlider({
  title,
  products,
  locale,
  aspectRatio = "square",
}: ProductsSliderProps) {
  const t = await getTranslations("product");
  return (
    <Slider className="space-y-6">
      <SliderHeader className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <SliderTitle className="text-sm font-black uppercase tracking-widest text-black">
          {title}
        </SliderTitle>
        {/* Make sure your custom SliderNav items are styled as sharp squares with no border-radius */}
        <SliderNav />
      </SliderHeader>
      <SliderContent>
        {products.map((product) => (
          <SliderItem key={product.id} className="rounded-none">
            <ProductCard
              product={product}
              locale={locale}
              outOfStockText={t("outOfStock")}
              aspectRatio={aspectRatio}
            />
          </SliderItem>
        ))}
      </SliderContent>
    </Slider>
  );
}
