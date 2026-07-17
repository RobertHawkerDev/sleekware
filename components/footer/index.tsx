import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/config";

export async function Footer({ locale }: { locale: string }) {
  const { socialLinks } = siteConfig;
  const t = await getTranslations("footer");

  return (
    // Clean black background with deep vertical spacing (py-16) for room to breathe
    <footer className="mt-16 md:mt-24 bg-neutral-900 py-16">
      <Container>
        {/* FIXED: Elements stack vertically (flex-col) and center their rows globally */}
        <div className="flex flex-col items-center justify-center text-center gap-10">
          {/* Top Row: Social Links */}
          {socialLinks.length > 0 && (
            <div>
              <SocialLinks links={socialLinks} />
            </div>
          )}

          {/* Bottom Row: Copyright text & Payment Badges grouped vertically together */}
          <div className="flex flex-col items-center gap-6">
            <p className="text-sm text-neutral-400 leading-5">
              {t("copyright", { name: siteConfig.name })}
            </p>
            <PaymentBadges />
          </div>
        </div>
      </Container>
    </footer>
  );
}

import type { SocialLink } from "@/lib/config";

const PLATFORM_LABELS: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  x: "X",
  youtube: "YouTube",
  tiktok: "TikTok",
  pinterest: "Pinterest",
  linkedin: "LinkedIn",
  github: "GitHub",
};

export function SocialLinks({ links }: { links: readonly SocialLink[] }) {
  return (
    // Wide horizontal spacing (gap-8) between larger icons
    <div className="flex items-center gap-8 leading-5">
      {links.map((link) => (
        <a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:opacity-80 transition-opacity"
          aria-label={PLATFORM_LABELS[link.platform] ?? link.platform}
        >
          <SocialIcon platform={link.platform} />
        </a>
      ))}
    </div>
  );
}

function SocialIcon({ platform }: { platform: string }) {
  // Kept larger size-6 (24px) for prominent social presence
  const cls = "size-6 fill-current";

  switch (platform) {
    case "facebook":
      return (
        <svg className={cls} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.09.044 1.613.115v3.146a10 10 0 0 0-.916-.036c-1.3 0-1.8.49-1.8 1.778v2.555h3.6l-.477 3.667h-3.123v8.126a12 12 0 1 0-4.755-.146" />
        </svg>
      );
    case "instagram":
      return (
        <svg className={cls} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7.03.084c-1.277.06-2.149.264-2.91.563a5.9 5.9 0 0 0-2.124 1.388A5.9 5.9 0 0 0 .61 4.14C.315 4.907.115 5.78.06 7.057.004 8.337 0 8.745 0 12s.004 3.664.06 4.945c.056 1.275.26 2.15.558 2.913a5.9 5.9 0 0 0 1.388 2.123 5.9 5.9 0 0 0 2.123 1.384c.764.3 1.636.5 2.913.558 1.28.06 1.688.063(4.944.063s3.664-.004 4.945-.06c1.275-.056 2.15-.26 2.913-.558a6.15 6.15 0 0 0 3.507-3.507c.3-.764.5-1.636.558-2.913.06-1.28.063-1.688.063-4.944s-.004-3.664-.06-4.945c-.056-1.275-.26-2.15-.558-2.913a5.9 5.9 0 0 0-1.384-2.126A5.9 5.9 0 0 0 19.86.647C19.1.348 18.225.148 16.95.09 15.67.035 15.26.03 12.003.03s-3.664.004-4.944.06zm.44 21.642c-1.17-.054-1.805-.249-2.228-.413a3.7 3.7 0 0 1-1.382-.895 3.7 3.7 0 0 1-.895-1.382c-.164-.423-.36-1.058-.413-2.228-.06-1.265-.072-1.644-.072-4.848s.013-3.584.072-4.849c.054-1.17.249-1.805.413-2.228.218-.567.48-1.004.895-1.382a3.7 3.7 0 0 1 1.382-.895c.423-.164 1.058-.36 2.228-.413 1.265-.06 1.644-.072 4.848-.072s3.584.013 4.849.072c1.17.054 1.805.249 2.228.413.567.218 1.004.48 1.382.895.416.378.815.895 1.382.164.423.36 1.058.413 2.228.06 1.265.072 1.644.072 4.849s-.013 3.583-.072 4.848c-.054 1.17-.249 1.805-.413 2.228a3.96 3.96 0 0 1-2.277 2.277c-.423.164-1.058.36-2.228.413-1.265.06-1.644.072-4.849.072s-3.583-.013-4.848-.072m9.783-16.192a1.44 1.44 0 1 0 1.437-1.442 1.44 1.44 0 0 0-1.437 1.442M5.839 12.012a6.161 6.161 0 1 0 12.323-.024 6.161 6.161 0 0 0-12.323.024M8 12.008A4 4 0 1 1 12.008 16 4 4 0 0 1 8 12.008" />
        </svg>
      );
    case "x":
      return (
        <svg className={cls} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932zM17.61 20.644h2.039L6.486 3.24H4.298z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className={cls} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065m1.782 13.019H3.555V9h3.564zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
        </svg>
      );
    case "github":
      return (
        <svg className={cls} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      );
    default:
      return <span className="text-sm font-medium text-white">{platform}</span>;
  }
}

function PaymentBadges() {
  // Kept larger h-8 w-12 container and roomier gap-3 for horizontal layout space
  const badgeCls =
    "h-8 w-12 rounded-none bg-white border border-neutral-800 flex items-center justify-center p-1 shadow-sm";

  return (
    <div className="flex items-center gap-3 flex-wrap justify-center">
      {/* Visa */}
      <div className={badgeCls}>
        <span className="text-xs font-black text-[#1A1F71] italic tracking-wider">VISA</span>
      </div>
      {/* Mastercard */}
      <div className={badgeCls}>
        <div className="flex gap-0.5">
          <span className="w-3.5 h-3.5 rounded-full bg-[#EB001B] opacity-90" />
          <span className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] opacity-90 -ml-2.5" />
        </div>
      </div>
      {/* Klarna */}
      <div className={`${badgeCls} bg-[#FFB3C7] border-none`}>
        <span className="text-[11px] font-black text-black tracking-tight">klarna.</span>
      </div>
      {/* Shop Pay */}
      <div className={badgeCls}>
        <span className="text-[11px] font-black text-[#5A31F4] lowercase">shop</span>
      </div>
    </div>
  );
}
