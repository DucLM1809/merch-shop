import { useState, type JSX } from "react";
import { Box, Flex, Image, type ImageProps } from "@chakra-ui/react";
import { ImageOff } from "lucide-react";

import { EmptyState } from "./EmptyState";

/**
 * `/_vercel/image` exists only inside Vercel's own edge runtime. Anywhere else — `vite dev`,
 * `vite preview`, a static Storybook build — the path falls through to the locale redirect and
 * resolves to the SPA HTML shell with a 200, so the `<img>` gets markup instead of image bytes
 * and fails to decode. Gate the rewrite so every non-Vercel environment renders the raw URL.
 */
const OPTIMIZATION_ENABLED = import.meta.env.PROD;

/** Build a Vercel Image Optimization URL for a raw backend image URL. */
export function buildVercelImageUrl(rawUrl: string, width: number, quality = 75): string {
  const params = new URLSearchParams({ url: rawUrl, w: String(width), q: String(quality) });
  return `/_vercel/image?${params.toString()}`;
}

/** The `src` to actually render: optimized on Vercel, the untouched URL everywhere else. */
export function buildOptimizedImageUrl(rawUrl: string, width: number, quality = 75): string {
  return OPTIMIZATION_ENABLED ? buildVercelImageUrl(rawUrl, width, quality) : rawUrl;
}

type OptimizedImageProps = Omit<ImageProps, "src" | "loading" | "alt"> & {
  src: string;
  alt: string;
  width: number;
  /** Above-the-fold images should load eagerly instead of lazily. */
  eager?: boolean;
  /**
   * Shown in place of the image if it fails to load (a dead URL, a network hiccup, or —
   * in local dev — `/_vercel/image` simply not existing outside Vercel's own runtime).
   * Pass the same copy a caller already uses for its "no image at all" case so both
   * look identical; omit for an icon-only fallback.
   */
  fallbackLabel?: string;
};

export function OptimizedImage({
  src,
  alt,
  width,
  eager = false,
  fallbackLabel,
  h,
  w,
  ...rest
}: OptimizedImageProps): JSX.Element {
  const [failed, setFailed] = useState(false);
  const handleError = () => setFailed(true);

  if (failed) {
    return (
      <Flex h={h} w={w} align="center" justify="center" bg="bg.muted">
        {fallbackLabel ? (
          <EmptyState title={fallbackLabel} icon={<ImageOff size={22} strokeWidth={1.5} />} />
        ) : (
          <Box role="img" aria-label={alt} color="fg.subtle">
            <ImageOff size={22} strokeWidth={1.5} />
          </Box>
        )}
      </Flex>
    );
  }

  return (
    <Image
      src={buildOptimizedImageUrl(src, width)}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      onError={handleError}
      h={h}
      w={w}
      {...rest}
    />
  );
}
