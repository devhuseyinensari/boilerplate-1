import { cn } from "@/lib/utils";
import type { LabelHTMLAttributes } from "react";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  // biome-ignore lint/a11y/noLabelWithoutControl: htmlFor is passed in via ...props at call sites
  return <label className={cn("text-sm font-medium leading-none", className)} {...props} />;
}
