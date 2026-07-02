import type { JSX } from "react";
import { Image, type ImageProps } from "@chakra-ui/react";

/** Build a Vercel Image Optimization URL for a raw backend image URL. */
export function buildOptimizedImageUrl(rawUrl: string, width: number, quality = 75): string {
  const params = new URLSearchParams({ url: rawUrl, w: String(width), q: String(quality) });
  return `/_vercel/image?${params.toString()}`;
}

type OptimizedImageProps = Omit<ImageProps, "src" | "loading" | "alt"> & {
  src: string;
  alt: string;
  width: number;
  /** Above-the-fold images should load eagerly instead of lazily. */
  eager?: boolean;
};

export function OptimizedImage({
  src,
  alt,
  width,
  eager = false,
  ...rest
}: OptimizedImageProps): JSX.Element {
  return (
    <Image
      src={buildOptimizedImageUrl(src, width)}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      {...rest}
    />
  );
}
