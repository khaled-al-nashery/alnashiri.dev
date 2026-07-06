import sharp from 'sharp';
import path from 'path';

async function getDimensions() {
  const dir = 'public/assets/blog/microservices-architecture-diagram';
  const files = [
    'anatomy.webp',
    'sync-vs-async.webp',
    'ecommerce-example.webp',
    'monolith-vs-microservices.webp'
  ];
  
  for (const file of files) {
    const input = path.join(dir, file);
    const metadata = await sharp(input).metadata();
    console.log(`${file}: width=${metadata.width}, height=${metadata.height}`);
  }
}

getDimensions().catch(console.error);
