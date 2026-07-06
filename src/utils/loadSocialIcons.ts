type IconModule = {
  default: (_props: Record<string, unknown>) => unknown;
};

type IconLink = {
  name: string;
  url: string;
  linkTitle?: string;
};

type ResolvedIcon = {
  url: string;
  title: string;
  Icon: (_props: Record<string, unknown>) => unknown;
} | null;

const icons = import.meta.glob<IconModule>(
  "/src/assets/icons/socials/*.svg"
);

/**
 * Resolves the SVG icon component for a given social/share link name.
 * Returns the icon module default export, or undefined if the icon doesn't exist.
 */
async function resolveIcon(
  name: string
): Promise<IconModule["default"] | undefined> {
  const mod = await icons[`/src/assets/icons/socials/${name}.svg`]?.();
  return mod?.default;
}

/**
 * Loads social or share-link icons with resolved titles.
 *
 * Each link object must have `name`, `url`, and optionally `linkTitle`.
 * The `resolveTitle` callback receives `(name, url, linkTitle?)` and
 * should return the accessible label for the icon.
 */
type ResolvedIconItem = {
  url: string;
  title: string;
  Icon: (_props: Record<string, unknown>) => unknown;
};

export async function loadSocialIcons(
  links: IconLink[],
  resolveTitle: (name: string, url: string, linkTitle?: string) => string
): Promise<ResolvedIconItem[]> {
  const items = await Promise.all(
    links.map(async ({ name, url, linkTitle }) => {
      const Icon = await resolveIcon(name);
      if (!Icon) return null;
      return { url, title: resolveTitle(name, url, linkTitle), Icon };
    })
  );
  return items.filter(
    (item): item is ResolvedIconItem => item !== null
  );
}
