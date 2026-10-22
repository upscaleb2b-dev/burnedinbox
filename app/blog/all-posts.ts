import type { Post } from "./posts";
import { posts } from "./posts";
import { posts2 } from "./posts2";
import { posts3 } from "./posts3";
import { GUIDES, GUIDE_PUBLISHED } from "@/lib/guides";

export type BlogPost = Post & { updated?: string };

const rewrites = new Map(
  GUIDES.filter(g => g.path.startsWith("/blog/")).map(g => [g.path.slice("/blog/".length), g]),
);

export const allPosts: BlogPost[] = [...posts, ...posts2, ...posts3].map(p => {
  const g = rewrites.get(p.slug);
  return g
    ? { ...p, title: g.title, excerpt: g.description, body: g.html, readTime: g.readTime, updated: GUIDE_PUBLISHED }
    : p;
});
