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
          <div
            key={index}
            // Replacing the unstable h-[50vh] on mobile with a static height (like h-[450px])
            // This prevents the address bar resize from triggering an image scale jump on scroll
            className="relative block w-full h-[450px] md:h-[85vh] overflow-hidden bg-neutral-900"
          >
            <Image
              src={item.imageSrc}
              alt={item.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              priority={index < 3}
              quality={70}
              className="object-cover object-center"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
