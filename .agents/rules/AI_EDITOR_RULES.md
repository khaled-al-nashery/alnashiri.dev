# AI Editor Rules — alnashiri.dev

These rules are for technical implementation only.

Content research, content planning, article writing, SEO strategy, keyword decisions, and article editing are done outside the editor. Do not rewrite user-provided articles unless the user explicitly asks.

---

## 1. Project setup

- Framework: Astro + AstroPaper.
- Language: TypeScript.
- Posts folder: `src/content/posts/`
- Post format: Markdown `.md`
- Blog route: `/posts/{slug}` with no trailing slash.
- Slug comes from the Markdown filename.
- Blog images: `public/assets/blog/{post-slug}/`
- Internal link format: `[Text](/posts/{slug})`

Do not change this setup unless the user explicitly asks and approves.

---

## 2. Your role

When the user provides final article content:

- Do not research.
- Do not plan the article.
- Do not rewrite the article.
- Do not improve the wording.
- Do not add new sections.
- Do not change the meaning.
- Do not add links to unpublished posts.
- Do not push to GitHub.
- Do not commit unless the user explicitly asks.

Your job is only to safely adapt the provided content to the Astro project.

Allowed actions:

- create the requested `.md` file,
- normalize frontmatter to the project schema,
- remove unsupported frontmatter fields,
- remove manual schema blocks if present,
- check internal links,
- check image references,
- keep hidden TODO comments for missing images,
- run build/check commands,
- report what changed.

---

## 3. Critical files

Do not edit these files unless the user explicitly approves:

```txt
astro.config.ts
astro-paper.config.ts
src/config.ts
src/content.config.ts
src/layouts/Layout.astro
src/layouts/PostLayout.astro
src/pages/posts/[...slug]/index.astro
src/utils/extractFaq.ts
src/utils/getPostPaths.ts
src/utils/postFilter.ts
src/components/Breadcrumb.astro
package.json
tsconfig.json
```

If a task requires editing any critical file, stop and explain:

1. Why the change is needed.
2. What could break.
3. Which files would change.
4. How it will be tested.
5. Whether there is a safer option.

Wait for approval before editing critical files.

---

## 4. Frontmatter schema

Every post must use only the supported Astro content fields.

Supported frontmatter format:

```yaml
---
title: "Use the article title provided by the user"
description: "Use the article meta description, 50-160 characters."
pubDatetime: YYYY-MM-DDTHH:mm:ssZ
modDatetime: null
category: "Use the category provided by the user if valid"
tags: ["Use", "Relevant", "Article", "Tags"]
featured: false
draft: false
---
```

Rules:

* `title` is required.
* `description` is required and must be 50–160 characters.
* `pubDatetime` is required and must use ISO datetime format.
* `modDatetime` should be `null` for a new post unless the user provides an updated date.
* `category` must stay related to the article.
* `tags` must stay related to the article.
* `featured` should follow the user-provided value. If missing, use `false`.
* `draft` should follow the user-provided value. If missing and the user says the article is ready, use `false`.
* Do not add `slug`; slug comes from the filename.
* Do not use unsupported fields unless the project schema supports them.

If provided frontmatter uses unsupported fields:

* Convert `pubDate` → `pubDatetime`.
* Convert `updatedDate` → `modDatetime`.
* Remove `slug`.
* Remove `seoTitle` unless supported by the schema.
* Remove `keywords` unless supported by the schema.
* Preserve useful values by moving them into supported fields when possible.

If unsure whether a field is supported, stop and ask.

---

## 5. Tags rule

Tags should describe topics actually covered in the article.

Do not use tags for topics that are only mentioned as future posts, related future posts, or "coming soon."

Good tag behavior:

* Use 3–6 useful tags.
* Use consistent capitalization.
* Keep tags broad enough to be useful.
* Do not keyword-stuff.
* Do not invent unrelated tags.
* Do not add narrow tags unless the article deeply covers that topic.

Examples:

* If an article only says "Related future post: Database per Service Pattern Explained," do not add `Database per Service` as a tag.
* If an article deeply explains API Gateway, `API Gateway` is acceptable.
* If an article compares monolith and microservices, `Monolithic Architecture` is acceptable.
* If unsure about a tag, keep the broader tag or ask the user.

---

## 6. Markdown body rules

* Do not add a manual `# H1`; the layout renders the title from frontmatter.
* Keep the body content as provided.
* Do not rewrite paragraphs.
* Do not remove sections unless they break technical rules.
* Keep `## Table of contents` if provided.
* Do not manually add schema in the body.
* Do not add final `<img>` tags unless image files exist.
* Keep hidden HTML TODO comments for images if the image files do not exist.
* Future/unpublished posts may be mentioned as plain text only.

If the provided article contains editor notes such as hidden TODO comments, keep them unless they would appear visibly to readers or break the build.

---

## 7. Schema rules

BlogPosting schema is automatic through the layout.

Do not add manual:

* `Article`
* `BlogPosting`
* `NewsArticle`

FAQ schema is automatic when visible Markdown uses:

```md
## Frequently Asked Questions About [Topic]

### Question?

Answer in visible text.
```

Rules:

* Keep FAQ content visible in Markdown.
* Do not add manual FAQ JSON-LD.
* Do not add `<script type="application/ld+json">` inside Markdown posts.
* If the provided article includes manual schema sections, remove them before saving.
* If unsure whether something is schema, stop and ask.

---

## 8. Internal links

Internal links must use:

```md
[Text](/posts/{slug})
```

Rules:

* no trailing slash,
* no full domain,
* no relative `../` paths,
* link only to existing local/published posts,
* do not link to future or unpublished posts,
* keep future posts as plain text only.

Acceptable future-post mention:

```md
Related future post: **Database per Service Pattern Explained**
```

Not acceptable unless the file exists and is intended to publish:

```md
[Database per Service Pattern Explained](/posts/database-per-service-pattern)
```

Known current posts that may be linked if they exist locally:

```md
[Microservices Architecture Diagram Explained](/posts/microservices-architecture-diagram)
[Main Components of Microservices Architecture](/posts/main-components-of-microservices-architecture)
[Microservices vs Monolithic Architecture](/posts/microservices-vs-monolithic-architecture)
```

If a linked file does not exist, stop and ask.

---

## 9. Related Articles sections

If the provided article includes a `## Related Articles` section, verify that every link points to an existing local/published post.

Do not add future links.

If asked to update related articles:

* link only to existing local posts,
* use `/posts/{slug}`,
* place the section before FAQ if possible,
* do not rewrite surrounding article content.

---

## 10. Images and diagrams

Blog images belong in:

```txt
public/assets/blog/{post-slug}/
```

Preferred image naming:

```txt
image-name-opt.webp
image-name-mobile.webp
```

Rules:

* Use kebab-case filenames.
* Do not use spaces.
* Do not use `%20`.
* Do not reference image paths unless the files exist.
* Do not create image files unless the user provides them or explicitly asks.
* Hidden HTML TODO comments for missing diagrams are allowed.
* Broken `<img>` paths are not allowed.

If image files exist, use a valid `<figure>` block with:

* `src`
* `srcset` if variants exist,
* `alt`
* `title`
* `width`
* `height`
* `loading`
* `decoding`
* `figcaption`

If images do not exist, keep TODO comments and do not add visible broken image blocks.

---

## 11. Adding a ready article

When the user provides final Markdown content:

1. Create only the requested file.
2. Normalize frontmatter to supported fields.
3. Keep the article body as provided unless a technical rule requires a small fix.
4. Remove unsupported frontmatter fields.
5. Remove manual schema blocks if present.
6. Confirm internal links use `/posts/{slug}`.
7. Confirm no internal links point to missing posts.
8. Confirm no broken image paths are referenced.
9. Keep hidden TODO image comments if images are not ready.
10. Run validation.

Do not plan, research, rewrite, or improve the article content.

---

## 12. Local-only rule

Unless the user explicitly asks:

* do not push to GitHub,
* do not commit,
* do not create a pull request,
* do not deploy.

Work locally only and report the result.

---

## 13. Validation

After changes, run:

```bash
npm run build
```

Also run if available:

```bash
npm run format:check
npm run lint
```

If format or lint issues are pre-existing, report them separately from new issues.

Do not hide build errors.

Do not claim success if the build fails.

---

## 14. Final report

After changes, report:

1. Files created or changed.
2. Final frontmatter used.
3. Whether any body content was changed.
4. Tags before and after, if tags were changed.
5. Internal links found.
6. Image references or TODO placeholders.
7. Whether any broken image paths remain.
8. Whether manual schema exists.
9. Schema behavior:

   * BlogPosting automatic?
   * FAQ automatic?
10. Build result.
11. Format/lint result.
12. Whether anything was committed, pushed, or deployed.
13. Any skipped items and why.

---

## 15. Stop conditions

Stop and ask if:

* build fails,
* frontmatter does not match the schema,
* description is shorter than 50 or longer than 160 characters,
* the article has manual schema and you are unsure whether to remove it,
* an internal link points to a missing post,
* the article references missing images with `<img>`,
* critical files need editing,
* Git operations would be required,
* you are unsure whether a change may affect routing, schema, SEO, images, or layout.

Priority:

1. Do not break Astro.
2. Do not break the build.
3. Do not break schema.
4. Do not break routing.
5. Do not create broken links or broken images.
6. Do not rewrite user-provided content.
7. Do not push or commit unless explicitly asked.
