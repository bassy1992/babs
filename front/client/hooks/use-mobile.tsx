import * as React from "react";

const BREAKPOINTS = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BREAKPOINTS.md - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.md);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < BREAKPOINTS.md);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

export function useBreakpoint(breakpoint: Breakpoint) {
  const [matches, setMatches] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${BREAKPOINTS[breakpoint]}px)`);
    const onChange = () => {
      setMatches(window.innerWidth >= BREAKPOINTS[breakpoint]);
    };
    mql.addEventListener("change", onChange);
    setMatches(window.innerWidth >= BREAKPOINTS[breakpoint]);
    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);

  return !!matches;
}

export function useResponsiveValue<T>(values: Partial<Record<Breakpoint, T>>) {
  const [currentValue, setCurrentValue] = React.useState<T | undefined>(undefined);

  React.useEffect(() => {
    const updateValue = () => {
      const width = window.innerWidth;
      let value: T | undefined;

      // Find the largest breakpoint that matches
      const sortedBreakpoints = Object.entries(BREAKPOINTS)
        .sort(([, a], [, b]) => b - a) as [Breakpoint, number][];

      for (const [bp, minWidth] of sortedBreakpoints) {
        if (width >= minWidth && values[bp] !== undefined) {
          value = values[bp];
          break;
        }
      }

      // Fallback to smallest available value
      if (value === undefined) {
        const availableBreakpoints = Object.keys(values) as Breakpoint[];
        const smallestBp = availableBreakpoints.sort((a, b) => BREAKPOINTS[a] - BREAKPOINTS[b])[0];
        value = values[smallestBp];
      }

      setCurrentValue(value);
    };

    updateValue();
    window.addEventListener("resize", updateValue);
    return () => window.removeEventListener("resize", updateValue);
  }, [values]);

  return currentValue;
}
