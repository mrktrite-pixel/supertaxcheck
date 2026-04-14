import { MetadataRoute } from "next";

// Update lastModified when content changes — Perplexity weights freshness
const NOW = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://supertaxcheck.com.au";

  return [
    {
      url: base,
      lastModified: NOW,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${base}/check/div296-wealth-eraser`,
      lastModified: NOW,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${base}/check/death-benefit-tax-wall`,
      lastModified: NOW,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/check/super-to-trust-exit`,
      lastModified: NOW,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/about`,
      lastModified: NOW,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/api/rules/div296.json`,
      lastModified: NOW,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/privacy`,
      lastModified: NOW,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/terms`,
      lastModified: NOW,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
