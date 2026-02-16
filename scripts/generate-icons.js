import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'fs';

const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="bg" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </radialGradient>
    <radialGradient id="shell" cx="45%" cy="35%" r="55%">
      <stop offset="0%" stop-color="#ef6a4a"/>
      <stop offset="60%" stop-color="#dc2626"/>
      <stop offset="100%" stop-color="#b91c1c"/>
    </radialGradient>
    <radialGradient id="claw" cx="40%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#f87171"/>
      <stop offset="100%" stop-color="#dc2626"/>
    </radialGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="512" height="512" rx="108" fill="url(#bg)"/>

  <!-- Subtle ring -->
  <circle cx="256" cy="270" r="155" fill="none" stroke="#1e3a5f" stroke-width="1.5" opacity="0.4"/>

  <!-- Back legs -->
  <g stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-width="14">
    <!-- Left legs -->
    <path d="M185 310 L120 350 L95 330" stroke="#b91c1c"/>
    <path d="M175 330 L110 380 L80 370" stroke="#b91c1c"/>
    <path d="M170 345 L115 405 L85 400" stroke="#b91c1c"/>
    <!-- Right legs -->
    <path d="M327 310 L392 350 L417 330" stroke="#b91c1c"/>
    <path d="M337 330 L402 380 L432 370" stroke="#b91c1c"/>
    <path d="M342 345 L397 405 L427 400" stroke="#b91c1c"/>
  </g>

  <!-- Arms to claws -->
  <g fill="none" stroke-width="16" stroke-linecap="round">
    <path d="M190 260 L130 210 L95 170" stroke="url(#claw)"/>
    <path d="M322 260 L382 210 L417 170" stroke="url(#claw)"/>
  </g>

  <!-- Left claw -->
  <g filter="url(#glow)">
    <path d="M95 170 C70 140, 50 145, 55 170 C58 188, 80 192, 95 178" fill="url(#claw)" stroke="#b91c1c" stroke-width="3"/>
    <path d="M95 170 C80 150, 95 130, 115 145 C128 155, 118 175, 100 178" fill="url(#claw)" stroke="#b91c1c" stroke-width="3"/>
  </g>

  <!-- Right claw -->
  <g filter="url(#glow)">
    <path d="M417 170 C442 140, 462 145, 457 170 C454 188, 432 192, 417 178" fill="url(#claw)" stroke="#b91c1c" stroke-width="3"/>
    <path d="M417 170 C432 150, 417 130, 397 145 C384 155, 394 175, 412 178" fill="url(#claw)" stroke="#b91c1c" stroke-width="3"/>
  </g>

  <!-- Main body / shell -->
  <ellipse cx="256" cy="300" rx="105" ry="80" fill="url(#shell)" stroke="#991b1b" stroke-width="3"/>

  <!-- Shell texture lines -->
  <g stroke="#b91c1c" stroke-width="1.5" opacity="0.5" fill="none">
    <path d="M180 280 Q256 260 332 280"/>
    <path d="M175 300 Q256 280 337 300"/>
    <path d="M180 320 Q256 305 332 320"/>
  </g>

  <!-- Head -->
  <ellipse cx="256" cy="248" rx="72" ry="48" fill="url(#shell)" stroke="#991b1b" stroke-width="3"/>

  <!-- Eye stalks -->
  <g>
    <path d="M222 235 L210 210" stroke="#dc2626" stroke-width="10" stroke-linecap="round"/>
    <path d="M290 235 L302 210" stroke="#dc2626" stroke-width="10" stroke-linecap="round"/>
  </g>

  <!-- Eyes -->
  <g filter="url(#glow)">
    <circle cx="207" cy="205" r="14" fill="#fef3c7" stroke="#991b1b" stroke-width="2"/>
    <circle cx="305" cy="205" r="14" fill="#fef3c7" stroke="#991b1b" stroke-width="2"/>
    <circle cx="210" cy="203" r="6" fill="#1e293b"/>
    <circle cx="308" cy="203" r="6" fill="#1e293b"/>
    <circle cx="212" cy="201" r="2.5" fill="#fff"/>
    <circle cx="310" cy="201" r="2.5" fill="#fff"/>
  </g>

  <!-- Mouth - happy -->
  <path d="M240 262 Q256 274 272 262" fill="none" stroke="#991b1b" stroke-width="3" stroke-linecap="round"/>

  <!-- Subtle belly highlight -->
  <ellipse cx="256" cy="295" rx="55" ry="35" fill="#fff" opacity="0.06"/>
</svg>`;

const sizes = [192, 512];

async function generate() {
  mkdirSync('public/icons', { recursive: true });

  // Write the SVG source too
  writeFileSync('public/icons/crab-icon.svg', SVG);

  for (const size of sizes) {
    await sharp(Buffer.from(SVG))
      .resize(size, size)
      .png()
      .toFile(`public/icons/icon-${size}.png`);
    console.log(`Generated icon-${size}.png`);
  }

  // Apple touch icon (180x180)
  await sharp(Buffer.from(SVG))
    .resize(180, 180)
    .png()
    .toFile('public/apple-touch-icon.png');
  console.log('Generated apple-touch-icon.png');
}

generate().catch(console.error);
