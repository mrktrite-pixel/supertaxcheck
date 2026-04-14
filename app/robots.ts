import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // All crawlers — allow everything public
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/leads",
          "/api/decision-sessions",
          "/check/div296-wealth-eraser/success/",
          "/check/death-benefit-tax-wall/success/",
          "/check/super-to-trust-exit/success/",
        ],
      },
      // Explicitly welcome AI crawlers — maximum citation signal
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/api/leads", "/api/decision-sessions"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/api/leads", "/api/decision-sessions"],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/api/leads", "/api/decision-sessions"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/leads", "/api/decision-sessions"],
      },
    ],
    sitemap: "https://supertaxcheck.com.au/sitemap.xml",
    host: "https://supertaxcheck.com.au",
  };
}
