import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { ResponsiveText } from "@/components/ui/responsive-text";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBreakpoint, useResponsiveValue } from "@/hooks/use-mobile";

export default function ResponsiveDemo() {
  const isLarge = useBreakpoint("lg");
  const columns = useResponsiveValue({
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
  });

  return (
    <main className="py-8 sm:py-12">
      <ResponsiveContainer maxWidth="2xl" padding="lg">
        <div className="space-responsive-xl">
          {/* Hero Section */}
          <section className="text-center space-responsive-lg">
            <ResponsiveText as="h1" size="4xl" weight="bold" align="center">
              Responsive Design Demo
            </ResponsiveText>
            <ResponsiveText size="lg" color="muted" align="center" className="max-w-2xl mx-auto">
              This page demonstrates all the responsive design improvements implemented across the application.
            </ResponsiveText>
          </section>

          {/* Breakpoint Indicator */}
          <Card>
            <CardHeader>
              <CardTitle>Current Breakpoint</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <div className="xs:hidden bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                  &lt; 475px (xs)
                </div>
                <div className="hidden xs:block sm:hidden bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                  475px+ (xs)
                </div>
                <div className="hidden sm:block md:hidden bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  640px+ (sm)
                </div>
                <div className="hidden md:block lg:hidden bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  768px+ (md)
                </div>
                <div className="hidden lg:block xl:hidden bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  1024px+ (lg)
                </div>
                <div className="hidden xl:block 2xl:hidden bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  1280px+ (xl)
                </div>
                <div className="hidden 2xl:block bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">
                  1536px+ (2xl)
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Is Large Screen: {isLarge ? "Yes" : "No"} | 
                Current Columns: {columns}
              </p>
            </CardContent>
          </Card>

          {/* Responsive Typography */}
          <section className="space-responsive-md">
            <ResponsiveText as="h2" size="3xl" weight="semibold">
              Responsive Typography
            </ResponsiveText>
            <div className="space-responsive-sm">
              <ResponsiveText as="h1" size="4xl" weight="bold">
                Heading 1 - Scales with viewport
              </ResponsiveText>
              <ResponsiveText as="h2" size="3xl" weight="semibold">
                Heading 2 - Fluid sizing
              </ResponsiveText>
              <ResponsiveText as="h3" size="2xl" weight="medium">
                Heading 3 - Responsive text
              </ResponsiveText>
              <ResponsiveText size="base">
                Body text that adapts to screen size using clamp() for optimal readability across all devices.
              </ResponsiveText>
              <ResponsiveText size="sm" color="muted">
                Small text that remains legible on mobile devices.
              </ResponsiveText>
            </div>
          </section>

          {/* Responsive Grid */}
          <section className="space-responsive-md">
            <ResponsiveText as="h2" size="3xl" weight="semibold">
              Responsive Grid System
            </ResponsiveText>
            <ResponsiveGrid 
              cols={{ default: 1, sm: 2, lg: 3, xl: 4 }}
              gap="md"
            >
              {Array.from({ length: 8 }, (_, i) => (
                <Card key={i}>
                  <CardContent className="p-responsive-sm">
                    <ResponsiveText weight="semibold">Card {i + 1}</ResponsiveText>
                    <ResponsiveText size="sm" color="muted">
                      This grid adapts from 1 column on mobile to 4 columns on desktop.
                    </ResponsiveText>
                  </CardContent>
                </Card>
              ))}
            </ResponsiveGrid>
          </section>

          {/* Auto-fit Grid */}
          <section className="space-responsive-md">
            <ResponsiveText as="h2" size="3xl" weight="semibold">
              Auto-fit Grid
            </ResponsiveText>
            <ResponsiveGrid autoFit minItemWidth="200px" gap="md">
              {Array.from({ length: 6 }, (_, i) => (
                <Card key={i}>
                  <CardContent className="p-responsive-sm">
                    <ResponsiveText weight="semibold">Auto Item {i + 1}</ResponsiveText>
                    <ResponsiveText size="sm" color="muted">
                      Automatically fits based on available space.
                    </ResponsiveText>
                  </CardContent>
                </Card>
              ))}
            </ResponsiveGrid>
          </section>

          {/* Responsive Images */}
          <section className="space-responsive-md">
            <ResponsiveText as="h2" size="3xl" weight="semibold">
              Responsive Images
            </ResponsiveText>
            <ResponsiveGrid cols={{ default: 1, sm: 2, lg: 3 }} gap="md">
              <div>
                <ResponsiveText weight="semibold" className="mb-2">Square Aspect</ResponsiveText>
                <ResponsiveImage
                  src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=400&auto=format&fit=crop"
                  alt="Square image"
                  aspectRatio="square"
                  className="rounded-lg"
                />
              </div>
              <div>
                <ResponsiveText weight="semibold" className="mb-2">Portrait Aspect</ResponsiveText>
                <ResponsiveImage
                  src="https://images.unsplash.com/photo-1601688246360-68d1bb27b3f7?q=80&w=400&auto=format&fit=crop"
                  alt="Portrait image"
                  aspectRatio="portrait"
                  className="rounded-lg"
                />
              </div>
              <div>
                <ResponsiveText weight="semibold" className="mb-2">Landscape Aspect</ResponsiveText>
                <ResponsiveImage
                  src="https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=400&auto=format&fit=crop"
                  alt="Landscape image"
                  aspectRatio="landscape"
                  className="rounded-lg"
                />
              </div>
            </ResponsiveGrid>
          </section>

          {/* Responsive Buttons */}
          <section className="space-responsive-md">
            <ResponsiveText as="h2" size="3xl" weight="semibold">
              Responsive Buttons
            </ResponsiveText>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="w-full sm:w-auto">
                Primary Action
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Secondary Action
              </Button>
              <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                Tertiary Action
              </Button>
            </div>
          </section>

          {/* Mobile-specific Features */}
          <section className="space-responsive-md">
            <ResponsiveText as="h2" size="3xl" weight="semibold">
              Mobile-specific Features
            </ResponsiveText>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Touch Targets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button className="touch-target w-full">
                      44px minimum height
                    </Button>
                    <Button variant="outline" className="touch-target w-full">
                      Touch-friendly button
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Responsive Spacing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-responsive-sm">
                    <div className="bg-primary/10 p-responsive-sm rounded">
                      Responsive padding
                    </div>
                    <div className="bg-secondary/50 p-responsive-md rounded">
                      Scales with screen size
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Text Clamping */}
          <section className="space-responsive-md">
            <ResponsiveText as="h2" size="3xl" weight="semibold">
              Text Clamping
            </ResponsiveText>
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="p-responsive-sm">
                  <ResponsiveText weight="semibold" className="line-clamp-1">
                    This is a very long title that will be clamped to one line only
                  </ResponsiveText>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-responsive-sm">
                  <ResponsiveText className="line-clamp-2">
                    This is a longer description that will be clamped to exactly two lines and will show ellipsis when it overflows beyond that limit.
                  </ResponsiveText>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-responsive-sm">
                  <ResponsiveText className="line-clamp-3">
                    This is an even longer description that will be clamped to exactly three lines. It demonstrates how text can be truncated gracefully while maintaining readability and visual consistency across different card sizes and screen dimensions.
                  </ResponsiveText>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </ResponsiveContainer>
    </main>
  );
}