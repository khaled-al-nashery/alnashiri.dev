import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://alnashiri.dev",
    title: "Alnashiri.dev",
    description: "Microservices Architecture, System Design, and Software Engineering Insights",
    author: "Khaled Abdh Ali Al-Nashery",
    profile: "https://www.linkedin.com/in/khaled-al-nashery/",
    ogImage: "default-og.jpg",
    lang: "en",
    timezone: "Asia/Riyadh",
    dir: "ltr",
  },
  posts: {
    perPage: 5,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: { enabled: false },
    search: "pagefind",
  },
  socials: [
    { name: "github",   url: "https://github.com/khaled-al-nashery" },
    { name: "linkedin", url: "https://www.linkedin.com/in/khaled-al-nashery/" },

  ],
  shareLinks: [
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "x",        url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "pinterest", url: "https://pinterest.com/pin/create/button/?url=" },
    { name: "mail",     url: "mailto:?subject=See%20this%20post&body=" },
  ],
});