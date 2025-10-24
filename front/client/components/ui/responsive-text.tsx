import * as React from "react";
import { cn } from "@/lib/utils";

interface ResponsiveTextProps extends React.HTMLAttributes<HTMLElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
  weight?: "normal" | "medium" | "semibold" | "bold";
  color?: "default" | "muted" | "primary" | "secondary" | "destructive";
  align?: "left" | "center" | "right" | "justify";
  responsive?: boolean;
}

export function ResponsiveText({
  as: Component = "p",
  size = "base",
  weight = "normal",
  color = "default",
  align = "left",
  responsive = true,
  className,
  children,
  ...props
}: ResponsiveTextProps) {
  const sizeClass = React.useMemo(() => {
    if (responsive) {
      switch (size) {
        case "xs":
          return "text-responsive-xs";
        case "sm":
          return "text-responsive-sm";
        case "base":
          return "text-responsive-base";
        case "lg":
          return "text-responsive-lg";
        case "xl":
          return "text-responsive-xl";
        case "2xl":
          return "text-responsive-2xl";
        case "3xl":
          return "text-responsive-3xl";
        case "4xl":
          return "text-responsive-4xl";
        case "5xl":
          return "text-4xl sm:text-5xl lg:text-6xl";
        case "6xl":
          return "text-5xl sm:text-6xl lg:text-7xl";
        default:
          return "text-responsive-base";
      }
    } else {
      return `text-${size}`;
    }
  }, [size, responsive]);

  const weightClass = React.useMemo(() => {
    switch (weight) {
      case "normal":
        return "font-normal";
      case "medium":
        return "font-medium";
      case "semibold":
        return "font-semibold";
      case "bold":
        return "font-bold";
      default:
        return "font-normal";
    }
  }, [weight]);

  const colorClass = React.useMemo(() => {
    switch (color) {
      case "default":
        return "text-foreground";
      case "muted":
        return "text-muted-foreground";
      case "primary":
        return "text-primary";
      case "secondary":
        return "text-secondary-foreground";
      case "destructive":
        return "text-destructive";
      default:
        return "text-foreground";
    }
  }, [color]);

  const alignClass = React.useMemo(() => {
    switch (align) {
      case "left":
        return "text-left";
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      case "justify":
        return "text-justify";
      default:
        return "text-left";
    }
  }, [align]);

  return (
    <Component
      className={cn(
        sizeClass,
        weightClass,
        colorClass,
        alignClass,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}