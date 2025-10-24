import * as React from "react";
import { cn } from "@/lib/utils";

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatio?: "square" | "portrait" | "landscape" | "video" | string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  priority?: boolean;
}

export function ResponsiveImage({
  src,
  alt,
  aspectRatio = "square",
  objectFit = "cover",
  priority = false,
  className,
  ...props
}: ResponsiveImageProps) {
  const aspectRatioClass = React.useMemo(() => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square";
      case "portrait":
        return "aspect-[3/4]";
      case "landscape":
        return "aspect-[4/3]";
      case "video":
        return "aspect-video";
      default:
        return aspectRatio.startsWith("aspect-") ? aspectRatio : `aspect-[${aspectRatio}]`;
    }
  }, [aspectRatio]);

  const objectFitClass = `object-${objectFit}`;

  return (
    <div className={cn("overflow-hidden", aspectRatioClass, className)}>
      <img
        src={src}
        alt={alt}
        className={cn("responsive-img", objectFitClass, "transition-transform duration-300")}
        loading={priority ? "eager" : "lazy"}
        {...props}
      />
    </div>
  );
}