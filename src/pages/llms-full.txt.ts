import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getSortedPosts } from "@/utils/getSortedPosts";
import { getPostUrl } from "@/utils/getPostPaths";
import config from "@/config";

/**
 * llms-full.txt — Full-content endpoint for AI/LLM ingestion.
 *
 * Following the emerging llms-full.txt convention, this endpoint provides
 * the complete text of every published post so AI systems can ingest the
 * full corpus without scraping individual pages.
 */
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
    "---",
    "",
  ];

  if (sortedPosts.length === 0) {
    lines.push("No published posts yet.");
  } else {
    for (const post of sortedPosts) {
      const url = getPostUrl(post.id, post.filePath, config.site.lang);
      lines.push(`## ${post.data.title}`);
      lines.push("");
      lines.push(`URL: ${config.site.url}${url}`);
      lines.push(`Description: ${post.data.description}`);
      lines.push(`Published: ${post.data.pubDatetime.toISOString().split("T")[0]}`);
      lines.push(`Tags: ${post.data.tags.join(", ")}`);
      lines.push("");

      // Include the full post body (raw markdown)
      if (post.body) {
        // Strip the frontmatter (already parsed) and render the raw markdown
        lines.push(post.body);
      }

      lines.push("");
      lines.push("---");
      lines.push("");
    }
  }

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
