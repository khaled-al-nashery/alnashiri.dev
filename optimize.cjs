const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const outDir = 'public/assets/blog/main-components-of-microservices-architecture';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const files = [
  { in: 'C:/Users/khale/.gemini/antigravity-ide/brain/e284d118-14e1-40ac-84b1-ae8d0fa62893/components_diagram_1783456410166.png', name: 'components-diagram' },
  { in: 'C:/Users/khale/.gemini/antigravity-ide/brain/e284d118-14e1-40ac-84b1-ae8d0fa62893/ecommerce_flow_1783456458222.png', name: 'ecommerce-flow' },
  { in: 'C:/Users/khale/.gemini/antigravity-ide/brain/e284d118-14e1-40ac-84b1-ae8d0fa62893/components_checklist_1783456505624.png', name: 'components-checklist' }
];

async function processImages() {
  for (const file of files) {
    if (!fs.existsSync(file.in)) {
      console.log('File not found:', file.in);
      continue;
    }
    
    // desktop
    await sharp(file.in)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path.join(outDir, `${file.name}-opt.webp`));
      
    // mobile
    await sharp(file.in)
      .resize({ width: 568, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path.join(outDir, `${file.name}-mobile.webp`));
      
    console.log(`Processed ${file.name}`);
  }
}

processImages().catch(console.error);
