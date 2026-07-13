import Image from "next/image";

interface GridItem {
  imageSrc: string;
  imageAlt: string;
}

const ITEMS: GridItem[] = [
  {
    imageSrc: "/home-image-grid/2.jpg",
    imageAlt: "Campaign image 1",
  },
  {
    imageSrc: "/home-image-grid/1.jpg",
    imageAlt: "Campaign image 2",
  },
  {
    imageSrc: "/home-image-grid/3.jpg",
    imageAlt: "Campaign image 3",
  },
];

export function ImageGrid() {
  return (
    <section className="w-full overflow-hidden bg-black">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {ITEMS.map((item, index) => (
          <div key={index} className="w-full h-[450px] md:h-[85vh] overflow-hidden bg-neutral-900">
            {/* Removed 'fill' entirely. Rendered as an inline block element for stable painting */}
            <Image
              src={item.imageSrc}
              alt={item.imageAlt}
              width={800}
              height={1200}
              priority={index < 3}
              quality={70}
              className="w-full h-full object-cover object-center"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
