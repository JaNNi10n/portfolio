import Image from "next/image";
import type { ImageData } from "@/lib/content";

type Props = {
  img: ImageData;
  sizes: string;
  plateTone?: "light" | "dark";
  priority?: boolean;
  /** Extra classes on the plate, e.g. a crop wrapper. */
  plateClassName?: string;
  /** Image to open in the lightbox, when it differs from the shown one. */
  full?: ImageData;
  caption?: React.ReactNode;
  className?: string;
  /** Hide the inline image and show only the trigger text (used for wide strips on small screens). */
  imgClassName?: string;
};

/**
 * A real project image on a square plate, caption below. The plate is a link to the image file,
 * which the Lightbox upgrades to an in-page dialog when JS is available.
 */
export function Figure({
  img,
  sizes,
  plateTone = "light",
  priority = false,
  plateClassName = "",
  full,
  caption,
  className = "",
  imgClassName = "",
}: Props) {
  const target = full ?? img;
  return (
    <figure className={className}>
      <a
        href={target.src}
        className={`plate ${plateTone === "dark" ? "plate-dark" : ""} ${plateClassName}`}
        aria-label={`Open full size: ${target.alt}`}
        aria-haspopup="dialog"
        data-lightbox=""
        data-src={target.src}
        data-alt={target.alt}
        data-caption={target.caption}
        data-width={target.width}
        data-height={target.height}
      >
        <Image
          src={img.src}
          alt={img.alt}
          width={img.width}
          height={img.height}
          sizes={sizes}
          quality={80}
          preload={priority}
          fetchPriority={priority ? "high" : undefined}
          loading={priority ? undefined : "lazy"}
          className={`block h-auto w-full ${imgClassName}`}
        />
      </a>
      <figcaption className="caption">{caption ?? img.caption}</figcaption>
    </figure>
  );
}
