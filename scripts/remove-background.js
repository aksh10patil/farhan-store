const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function removeBackground(inputPath, outputPath, options = {}) {
  const {
    lumThreshold = 205, // luminance above which near-neutral is considered bg
    distThreshold = 55,  // color distance from sampled bg
    maxSat = 22,        // maximum color saturation (max(r,g,b) - min(r,g,b))
    featherRadius = 1.5,
  } = options;

  const image = sharp(inputPath).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;

  // Sample background color from outer borders
  let bgR = 0, bgG = 0, bgB = 0, sampleCount = 0;
  const samplePixel = (x, y) => {
    const idx = (y * W + x) * C;
    bgR += data[idx];
    bgG += data[idx + 1];
    bgB += data[idx + 2];
    sampleCount++;
  };

  // Sample perimeter
  for (let x = 0; x < W; x += 10) {
    samplePixel(x, 0);
    samplePixel(x, H - 1);
  }
  for (let y = 0; y < H; y += 10) {
    samplePixel(0, y);
    samplePixel(W - 1, y);
  }

  bgR = Math.round(bgR / sampleCount);
  bgG = Math.round(bgG / sampleCount);
  bgB = Math.round(bgB / sampleCount);
  console.log(`[${path.basename(inputPath)}] Sampled BG Color: rgb(${bgR}, ${bgG}, ${bgB})`);

  const isBgPixel = (r, g, b) => {
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const sat = Math.max(r, g, b) - Math.min(r, g, b);
    const dR = r - bgR;
    const dG = g - bgG;
    const dB = b - bgB;
    const dist = Math.sqrt(dR * dR + dG * dG + dB * dB);

    // Matches if close to sampled background and low saturation, or very bright
    if (sat < maxSat && dist < distThreshold) return true;
    if (sat < maxSat && lum > lumThreshold) return true;
    // Floor contact shadow removal near borders
    if (lum > 185 && sat < 14 && dist < distThreshold * 1.3) return true;
    return false;
  };

  const isBg = new Uint8Array(W * H);
  const queue = new Int32Array(W * H);
  let qHead = 0, qTail = 0;

  // Seed with all qualifying perimeter pixels
  for (let x = 0; x < W; x++) {
    for (const y of [0, 1, H - 2, H - 1]) {
      const idx = (y * W + x) * C;
      if (isBgPixel(data[idx], data[idx + 1], data[idx + 2])) {
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
      if (isBgPixel(data[idx], data[idx + 1], data[idx + 2])) {
        const p = y * W + x;
        if (!isBg[p]) {
          isBg[p] = 1;
          queue[qTail++] = p;
        }
      }
    }
  }

  // BFS Flood Fill
  while (qHead < qTail) {
    const curr = queue[qHead++];
    const cx = curr % W;
    const cy = (curr / W) | 0;

    // 4 directions
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
      if (isBgPixel(data[nIdx], data[nIdx + 1], data[nIdx + 2])) {
        isBg[n] = 1;
        queue[qTail++] = n;
      }
    }
  }

  // Apply transparency and anti-aliasing
  const outData = Buffer.from(data);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const p = y * W + x;
      const idx = p * C;

      if (isBg[p] === 1) {
        outData[idx + 3] = 0; // Completely transparent
      } else {
        // Check if on border of background (feathering)
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
          // Soft edge blending
          const factor = 1 - (bgNeighborCount / 8) * 0.65;
          outData[idx + 3] = Math.round(255 * factor);
        } else {
          outData[idx + 3] = 255;
        }
      }
    }
  }

  // Ensure output directory exists
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  await sharp(outData, { raw: { width: W, height: H, channels: 4 } })
    .png({ compressionLevel: 8 })
    .toFile(outputPath);

  console.log(`Saved transparent PNG: ${outputPath}`);
}

module.exports = { removeBackground };

if (require.main === module) {
  const [,, input, output] = process.argv;
  if (input && output) {
    removeBackground(input, output).catch(console.error);
  }
}
