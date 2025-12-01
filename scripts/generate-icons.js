// Ce script nécessite 'sharp' : npm install --save-dev sharp
import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";

const sizes = [72, 96, 128, 144, 152, 167, 180, 192, 384, 512];
const inputSvg = "./public/iptvfarouk.svg"; // Votre logo SVG
const outputDir = "./public";

async function generateIcons() {
  try {
    for (const size of sizes) {
      await sharp(inputSvg)
        .resize(size, size)
        .png()
        .toFile(path.join(outputDir, `icon-${size}x${size}.png`));

    }

  } catch (error) {
    console.error("❌ Erreur:", error);
  }
}

generateIcons();
