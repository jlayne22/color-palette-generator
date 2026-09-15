export const SITE_NAME = "Color Palette Generator";
export const SITE_TITLE = "Color Palette Generator | Create Beautiful Color Schemes";
export const SITE_DESCRIPTION =
  "Generate beautiful color palettes for websites, brands, apps, and creative projects. Copy HEX, RGB, HSL, CSS variables, Tailwind config, and more.";
export const SITE_TAGLINE =
  "Create beautiful, accessible color palettes for websites, brands, apps, and creative projects in seconds.";

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;

  return "http://localhost:3000";
}

export type FaqItem = {
  question: string;
  answer: string;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What is a color palette generator?",
    answer:
      "A color palette generator is a design tool that creates a coordinated set of colors you can use for websites, brands, apps, and creative projects. This generator builds five-color palettes instantly in your browser, with harmony modes, contrast guidance, and exports you can paste into code.",
  },
  {
    question: "Can I use these palettes for commercial projects?",
    answer:
      "Yes. You can use generated palettes for personal and commercial projects. Palettes are not exclusive intellectual property, and similar colors appear throughout design and nature. You are still responsible for checking trademarks, brand guidelines, and any legal requirements for your specific use.",
  },
  {
    question: "Are the generated palettes accessible?",
    answer:
      "The tool shows contrast ratios against black and white and labels colors as Good for text, Use carefully, or Decorative only. That guidance is a helpful starting point, not a full accessibility audit. Always test real text, charts, and UI components in context against WCAG requirements.",
  },
  {
    question: "What color formats does this tool support?",
    answer:
      "Each color is available as HEX, RGB, and HSL. You can also export CSS variables, a Tailwind config snippet, JSON, and an SVG swatch strip for design handoff or documentation.",
  },
  {
    question: "Can I save my palettes?",
    answer:
      "Yes. Saved palettes are stored in your browser with localStorage on this device, up to 24 recent palettes. They are not uploaded to a server. Clearing site data or using another device will remove those saves.",
  },
  {
    question: "Can I use this with Tailwind CSS?",
    answer:
      "Yes. Open Export your palette and copy the Tailwind config snippet. It maps the five colors to palette.1 through palette.5 so you can use classes like bg-palette-1 in a Tailwind project.",
  },
  {
    question: "Does this tool store my palettes online?",
    answer:
      "No. Palette generation and favorites stay in your browser. If you share a link, the colors are placed in the URL query string so anyone with the link can view that palette. Nothing is saved to an account or database.",
  },
  {
    question: "How many colors are in each palette?",
    answer:
      "Each palette contains exactly five colors. You can lock any of them before generating again so only unlocked swatches change.",
  },
];

export function getJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: SITE_NAME,
        url: siteUrl,
        description: SITE_DESCRIPTION,
        applicationCategory: "DesignApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };
}
