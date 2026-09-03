import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));
const outputDir = `${root}/exports`;
const read = (file) => fs.readFile(`${root}/public/assets/${file}`);
const esc = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

const [photo, chiro, aroma, badge, renew] = await Promise.all([
  read("committed-to-wellness-desert-dawn.png"),
  read("chirogoaz-wordmark.png"),
  read("aromahmt-wordmark.png"),
  read("3db6b.png"),
  read("3e8fa.png"),
]);

const width = 1080;
const height = 1350;
const image = await sharp(photo).resize(width, 1080, { fit: "cover", position: "centre" }).png().toBuffer();
const imageData = image.toString("base64");
const chiroData = chiro.toString("base64");
const aromaData = aroma.toString("base64");
const badgeData = badge.toString("base64");
const renewData = renew.toString("base64");

const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="overlay" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f4efe6" stop-opacity="0"/>
      <stop offset="0.27" stop-color="#f4efe6" stop-opacity="0.24"/>
      <stop offset="0.55" stop-color="#f4efe6" stop-opacity="0.92"/>
      <stop offset="1" stop-color="#fbf8f2" stop-opacity="0.98"/>
    </linearGradient>
    <linearGradient id="header" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fbf8f2" stop-opacity="0.99"/>
      <stop offset="1" stop-color="#f4efe6" stop-opacity="0.86"/>
    </linearGradient>
    <style>
      .micro { font: 600 15px Arial, sans-serif; letter-spacing: 2px; fill: #7c8b6a; }
      .eyebrow { font: 600 17px 'Courier New', monospace; letter-spacing: 3px; fill: #c96f43; }
      .script { font: 500 52px 'Brush Script MT', 'Segoe Script', cursive; fill: #1f2f20; }
      .headline { font: 500 62px 'Brush Script MT', 'Segoe Script', cursive; fill: #1f2f20; }
      .body { font: 400 22px Arial, sans-serif; fill: #57604c; }
      .small { font: 600 16px Arial, sans-serif; letter-spacing: 2px; fill: #1f2f20; }
      .button { font: 600 17px Arial, sans-serif; letter-spacing: 1px; fill: #f4efe6; }
    </style>
  </defs>
  <rect width="1080" height="${height}" fill="#f4efe6"/>
  <image href="data:image/png;base64,${imageData}" x="0" y="120" width="1080" height="1080" preserveAspectRatio="xMidYMid slice"/>
  <rect x="0" y="120" width="1080" height="1080" fill="url(#overlay)"/>
  <rect x="0" y="0" width="1080" height="190" fill="url(#header)"/>
  <rect x="0" y="1170" width="1080" height="180" fill="#fbf8f2" fill-opacity="0.96"/>
  <image href="data:image/png;base64,${renewData}" x="390" y="28" width="300" height="138" preserveAspectRatio="xMidYMid meet"/>
  <text x="58" y="220" class="micro">TEASER  ·  DAY -7</text>
  <text x="540" y="420" text-anchor="middle" class="script">Something</text>
  <text x="540" y="480" text-anchor="middle" class="headline">BEAUTIFUL</text>
  <text x="540" y="540" text-anchor="middle" class="headline">is Growing</text>
  <text x="540" y="655" text-anchor="middle" class="eyebrow">A NEW CHAPTER OF CARE</text>
  <text x="540" y="705" text-anchor="middle" class="body">We're preparing something special to</text>
  <text x="540" y="738" text-anchor="middle" class="body">help you move better, feel better,</text>
  <text x="540" y="771" text-anchor="middle" class="body">and live better—naturally.</text>
  <text x="540" y="827" text-anchor="middle" class="body">Stay tuned. Wellness is on the way.</text>
  <line x1="270" y1="882" x2="470" y2="882" stroke="#c9a66b" stroke-width="1"/>
  <image href="data:image/png;base64,${badgeData}" x="510" y="858" width="60" height="60" preserveAspectRatio="xMidYMid meet"/>
  <line x1="610" y1="882" x2="810" y2="882" stroke="#c9a66b" stroke-width="1"/>
  <text x="540" y="970" text-anchor="middle" class="small">COMMITTED TO WELLNESS</text>
  <text x="540" y="1000" text-anchor="middle" class="small">LAUNCHING SOON</text>
  <rect x="392" y="1035" width="296" height="54" rx="27" fill="#2f4630"/>
  <text x="540" y="1069" text-anchor="middle" class="button">BE THE FIRST TO KNOW  →</text>
  <image href="data:image/png;base64,${chiroData}" x="58" y="1198" width="230" height="72" preserveAspectRatio="xMidYMid meet"/>
  <line x1="340" y1="1208" x2="340" y2="1260" stroke="#d9a441" stroke-width="1"/>
  <image href="data:image/png;base64,${aromaData}" x="430" y="1198" width="230" height="72" preserveAspectRatio="xMidYMid meet"/>
  <line x1="770" y1="1208" x2="770" y2="1260" stroke="#d9a441" stroke-width="1"/>
  <text x="540" y="1305" text-anchor="middle" class="micro">MOVE BETTER  ·  HEAL DEEPER  ·  LIVE BETTER</text>
</svg>`;

await fs.mkdir(outputDir, { recursive: true });
const output = `${outputDir}/committed-to-wellness-teaser-feed.png`;
await sharp(Buffer.from(svg)).png().toFile(output);
console.log(output);
