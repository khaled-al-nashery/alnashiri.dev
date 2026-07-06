import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getSortedPosts } from "@/utils/getSortedPosts";
import { getPostUrl } from "@/utils/getPostPaths";
import config from "@/config";

export const GET: APIRoute = async () => {
  const posts = await getCollection("posts");
  const sortedPosts = getSortedPosts(posts);

  const lines: string[] = [
    `# ${config.site.title}`,
    "",
    `> ${config.site.description}`,
    "",
    "## About",
    "",
    "This website publishes practical guides about system design, software architecture, APIs, distributed systems, and engineering best practices.",
    "",
    "## Posts",
    "",
  ];

  if (sortedPosts.length === 0) {
    lines.push("No published posts yet.");
  } else {
    for (const post of sortedPosts) {
      const url = getPostUrl(post.id, post.filePath, config.site.lang);
      lines.push(`- [${post.data.title}](${config.site.url}${url})`);
    }
  }

  lines.push("");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
