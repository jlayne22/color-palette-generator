import { getJsonLd, getSiteUrl } from "@/lib/seo";

export function JsonLd() {
  const jsonLd = getJsonLd(getSiteUrl());

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
