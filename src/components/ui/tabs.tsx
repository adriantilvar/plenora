"use client";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { createVariants, type VariantProps } from "@/lib/create-variants";
import { cn } from "@/lib/utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "flex rounded-lg bg-muted p-1 text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

const tabTriggerVariants = createVariants({
  base: "inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-md  px-2 py-1 transition-[color,box-shadow] focus-visible:outline-1 focus-visible:outline-ring focus-visible:ring-2 disabled:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 disabled:opacity-50",
  variant: {
    default:
      "border border-transparent text-foreground focus-visible:border-ring focus-visible:ring-ring/50 data-[state=active]:bg-background dark:text-muted-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground data-[state=active]:shadow-sm",
    ghost:
      "data-[state=active]:bg-stone-200/50 text-stone-500 data-[state=active]:text-stone-950",
  },
  size: {
    default: "text-base",
    sm: "text-sm",
    lg: "text-lg font-medium",
  },
});
type TabTriggerVariants = VariantProps<typeof tabTriggerVariants>;

function TabsTrigger({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & TabTriggerVariants) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(tabTriggerVariants({ variant, size }), className)}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
