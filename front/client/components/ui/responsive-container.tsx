import * as React from "react";
import { cn } from "@/lib/utils";

interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  center?: boolean;
}

export function ResponsiveContainer({
  maxWidth = "xl",
  padding = "md",
  center = true,
  className,
  children,
  ...props
}: ResponsiveContainerProps) {
  const maxWidthClass = React.useMemo(() => {
    switch (maxWidth) {
      case "sm":
        return "max-w-screen-sm";
      case "md":
        return "max-w-screen-md";
      case "lg":
        return "max-w-screen-lg";
      case "xl":
        return "max-w-screen-xl";
      case "2xl":
        return "max-w-screen-2xl";
      case "full":
        return "max-w-full";
      default:
        return "max-w-screen-xl";
    }
  }, [maxWidth]);

  const paddingClass = React.useMemo(() => {
    switch (padding) {
      case "none":
        return "";
      case "sm":
        return "px-4 sm:px-6";
      case "md":
        return "px-4 sm:px-6 lg:px-8";
      case "lg":
        return "px-6 sm:px-8 lg:px-12";
      case "xl":
        return "px-8 sm:px-12 lg:px-16";
      default:
        return "px-4 sm:px-6 lg:px-8";
    }
  }, [padding]);

  return (
    <div
      className={cn(
        "w-full",
        maxWidthClass,
        paddingClass,
        center && "mx-auto",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}