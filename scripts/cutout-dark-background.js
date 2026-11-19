const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * High-quality dark background removal for lookbook streetwear apparel.
 * Eliminates white fringing completely by extracting clean silhouettes from dark backgrounds.
 */
async function removeDarkBackground(inputPath, outputPath, options = {}) {
  const {
    lumThreshold = 38,       // Luminance below which a pixel is considered background
    distThreshold = 45,      // Max Euclidean distance from sampled border background color
    featherRadius = 1,       // 1-pixel soft antialiased transition
    padding = 24,            // Padding around trimmed image
  } = options;

  console.log(`\n[Processing] ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);
  
  const img = sharp(inputPath).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;

  // 1. Sample background color along image perimeter
  let bgR = 0, bgG = 0, bgB = 0, count = 0;
  const sample = (x, y) => {
    const idx = (y * W + x) * C;
    bgR += data[idx];
    bgG += data[idx + 1];
    bgB += data[idx + 2];
    count++;
  };

  for (let x = 0; x < W; x += 4) {
    sample(x, 0);
    sample(x, 1);
    sample(x, H - 2);
    sample(x, H - 1);
  }
  for (let y = 0; y < H; y += 4) {
    sample(0, y);
    sample(1, y);
    sample(W - 2, y);
    sample(W - 1, y);
  }

  bgR = Math.round(bgR / count);
  bgG = Math.round(bgG / count);
  bgB = Math.round(bgB / count);
  console.log(`  Sampled border BG color: rgb(${bgR}, ${bgG}, ${bgB})`);

  // Predicate: is this pixel dark background?
  const isDarkBg = (r, g, b) => {
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const dR = r - bgR;
    const dG = g - bgG;
    const dB = b - bgB;
    const dist = Math.sqrt(dR * dR + dG * dG + dB * dB);

    // If near the sampled dark background color or very dark luminance
    if (dist <= distThreshold && lum <= lumThreshold) return true;
    if (lum <= 18) return true; // Pitch black is always background
    if (dist <= distThreshold * 0.8 && lum <= lumThreshold * 1.3) return true;
    return false;
  };

  // 2. BFS Flood Fill from edges
  const isBg = new Uint8Array(W * H);
  const queue = new Int32Array(W * H);
  let qHead = 0, qTail = 0;

  // Enqueue qualifying border pixels
  for (let x = 0; x < W; x++) {
    for (const y of [0, 1, H - 2, H - 1]) {
      const idx = (y * W + x) * C;
      if (isDarkBg(data[idx], data[idx + 1], data[idx + 2])) {
        const p = y * W + x;
        if (!isBg[p]) {
          isBg[p] = 1;
          queue[qTail++] = p;
        }
      }
    }
  }

  for (let y = 0; y < H; y++) {
    for (const x of [0, 1, W - 2, W - 1]) {
      const idx = (y * W + x) * C;
      if (isDarkBg(data[idx], data[idx + 1], data[idx + 2])) {
        const p = y * W + x;
        if (!isBg[p]) {
          isBg[p] = 1;
          queue[qTail++] = p;
        }
      }
    }
  }

  while (qHead < qTail) {
    const curr = queue[qHead++];
    const cx = curr % W;
    const cy = (curr / W) | 0;

    const neighbors = [
      cy > 0 ? curr - W : -1,
      cy < H - 1 ? curr + W : -1,
      cx > 0 ? curr - 1 : -1,
      cx < W - 1 ? curr + 1 : -1,
    ];

    for (let i = 0; i < 4; i++) {
      const n = neighbors[i];
      if (n === -1 || isBg[n]) continue;
      const nIdx = n * C;
      if (isDarkBg(data[nIdx], data[nIdx + 1], data[nIdx + 2])) {
        isBg[n] = 1;
        queue[qTail++] = n;
      }
    }
  }

  // 3. Create transparent output buffer with soft edge anti-aliasing
  const outData = Buffer.from(data);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const p = y * W + x;
      const idx = p * C;

      if (isBg[p] === 1) {
        // Completely transparent
        outData[idx + 3] = 0;
      } else {
        // Check neighbors to feather boundary
        let bgNeighborCount = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
              if (isBg[ny * W + nx] === 1) bgNeighborCount++;
            }
          }
        }

        if (bgNeighborCount > 0) {
          // Soft anti-aliasing factor
          const factor = Math.max(0.15, 1 - (bgNeighborCount / 8) * 0.75);
          outData[idx + 3] = Math.round(255 * factor);
        } else {
          outData[idx + 3] = 255;
        }
      }
    }
  }

  // 4. Save initial transparent cutout
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const rawCutout = await sharp(outData, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toBuffer();

  // 5. Trim excess transparency and add uniform padding
  const trimmed = await sharp(rawCutout).trim().toBuffer();
  await sharp(trimmed)
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 8 })
    .toFile(outputPath);

  console.log(`  ✓ Successfully saved: ${outputPath}`);
}

module.exports = { removeDarkBackground };
