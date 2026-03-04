import { NextResponse } from "next/server";
import { fetchBlogPosts } from "@/lib/api";

export const revalidate = 300;

export async function GET() {
  try {
    const posts = await fetchBlogPosts(5);
    return NextResponse.json(posts);
  } catch (err) {
    console.error("Substack route error:", err);
    return NextResponse.json({ message: "internal error" }, { status: 500 });
  }
}
