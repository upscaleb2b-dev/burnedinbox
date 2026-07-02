import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      // Explicitly welcome AI/LLM crawlers — being cited by assistants is a
      // distribution channel for an authority site.
      { userAgent: "GPTBot",             allow: "/" },
      { userAgent: "OAI-SearchBot",      allow: "/" },
      { userAgent: "ChatGPT-User",       allow: "/" },
      { userAgent: "ClaudeBot",          allow: "/" },
      { userAgent: "Claude-User",        allow: "/" },
      { userAgent: "Claude-SearchBot",   allow: "/" },
      { userAgent: "anthropic-ai",       allow: "/" },
      { userAgent: "PerplexityBot",      allow: "/" },
      { userAgent: "Google-Extended",    allow: "/" },
      { userAgent: "Applebot-Extended",  allow: "/" },
      { userAgent: "Bytespider",         allow: "/" },
      { userAgent: "CCBot",              allow: "/" },
    ],
    sitemap: "https://burnedinbox.com/sitemap.xml",
    host: "https://burnedinbox.com",
  };
}
