import * as React from "react";
import { cn } from "@/lib/utils";

interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: {
    default?: number;
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    "2xl"?: number;
  };
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  autoFit?: boolean;
  minItemWidth?: string;
}

export function ResponsiveGrid({
  cols = { default: 1, sm: 2, lg: 3, xl: 4 },
  gap = "md",
  autoFit = false,
  minItemWidth = "250px",
  className,
  children,
  ...props
}: ResponsiveGridProps) {
  const gridColsClasses = React.useMemo(() => {
    const classes: string[] = [];
    
    if (autoFit) {
      return [`grid-cols-[repeat(auto-fit,minmax(${minItemWidth},1fr))]`];
    }

    if (cols.default) classes.push(`grid-cols-${cols.default}`);
    if (cols.xs) classes.push(`xs:grid-cols-${cols.xs}`);
    if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`);
    if (cols.md) classes.push(`md:grid-cols-${cols.md}`);
    if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`);
    if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`);
    if (cols["2xl"]) classes.push(`2xl:grid-cols-${cols["2xl"]}`);

    return classes;
  }, [cols, autoFit, minItemWidth]);

  const gapClass = React.useMemo(() => {
    switch (gap) {
      case "none":
        return "gap-0";
      case "xs":
        return "gap-2";
      case "sm":
        return "gap-3 sm:gap-4";
      case "md":
        return "gap-4 sm:gap-6";
      case "lg":
        return "gap-6 sm:gap-8";
      case "xl":
        return "gap-8 sm:gap-10";
      default:
        return "gap-4 sm:gap-6";
    }
  }, [gap]);

  return (
    <div
      className={cn(
        "grid",
        ...gridColsClasses,
        gapClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}