import type * as React from "react";

import { cn } from "@/lib/utils";

interface AboutItemProps extends React.ComponentProps<"div"> {
  descriptionHtml: string;
}

export function AboutItem({ descriptionHtml, className, ...props }: AboutItemProps) {
  if (!descriptionHtml) return null;

  return (
    <div
      className={cn(
        "prose prose-sm max-w-none text-neutral-600 uppercase tracking-wide text-[11px] leading-relaxed prose-p:mb-3 prose-strong:font-black prose-strong:text-black",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: descriptionHtml }}
      {...props}
    />
  );
}
