import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";
import { slugifyStr } from "./slugify";

type Category = {
  category: string;
  categoryName: string;
};

/**
 * Builds a de-duplicated, sorted category list from posts.
 *
 * - Drafts and scheduled posts are excluded via `postFilter()`
 * - `category` is the slug used in URLs; `categoryName` is the original label for display
 * - Uniqueness is based on the slug (so differently-cased labels collapse)
 */
export function getUniqueCategories(posts: CollectionEntry<"posts">[]) {
  const categories: Category[] = posts
    .filter(postFilter)
    .map(post => post.data.category)
    .filter((cat): cat is string => !!cat)
    .map(cat => ({ category: slugifyStr(cat), categoryName: cat }))
    .filter(
      (value, index, self) =>
        self.findIndex(c => c.category === value.category) === index
    )
    .sort((catA, catB) => catA.category.localeCompare(catB.category));
  return categories;
}
