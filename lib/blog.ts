import { XMLParser } from "fast-xml-parser";
import { Post } from "@/lib/data-types"

export async function parseSubstackFeed(limit = 5): Promise<Post[]> {
  const base = process.env.SUBSTACK_URL;
  if (!base) throw new Error("SUBSTACK_URL missing");

  const res = await fetch(`${base}/feed`);
  if (!res.ok) throw new Error("RSS fetch failed");

  const xml  = await res.text();
  const json = new XMLParser().parse(xml);
  const rawItems = json?.rss?.channel?.item ?? [];
  const items = Array.isArray(rawItems) ? rawItems : [rawItems];

  return items.slice(0, limit).map((p: any) => ({
    id:    p.guid?.["#text"] || p.link,
    title: p.title,
    date:  p.pubDate,
    excerpt: typeof p.description === "string" ? p.description.replace(/<[^>]+>/g, "").slice(0, 180) : "",
    readTime: "5 min read",
    tags: [],
    slug: p.link?.split("/").filter(Boolean).pop() ?? "",
    url:   p.link,
  }));
}
