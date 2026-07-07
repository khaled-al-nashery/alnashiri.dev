const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const IMG_DIR = path.join(__dirname, "public/assets/blog/microservices-architecture-diagram");
const MOBILE_WIDTH = 568; // Exact width Lighthouse expects for mobile LCP

const images = [
  { src: "anatomy.webp", out: "anatomy-mobile.webp" },
  { src: "sync-vs-async.webp", out: "sync-vs-async-mobile.webp" },
  { src: "ecommerce-example.webp", out: "ecommerce-example-mobile.webp" },
  { src: "monolith-vs-microservices.webp", out: "monolith-vs-microservices-mobile.webp" },
];

async function generateMobileImages() {
  for (const { src, out } of images) {
    const srcPath = path.join(IMG_DIR, src);
    const outPath = path.join(IMG_DIR, out);

    await sharp(srcPath)
      .resize({ width: MOBILE_WIDTH, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(outPath);

    console.log(`Generated ${out}`);
  }
}

generateMobileImages().catch(console.error);
