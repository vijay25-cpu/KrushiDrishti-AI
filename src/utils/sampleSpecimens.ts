/**
 * Generates reliable, high-fidelity botanical leaf specimen images
 * directly in client memory via HTML5 Canvas.
 * Eliminates external network dependency and CORS blocking.
 */

export interface SampleSpecimenItem {
  id: string;
  title: string;
  crop: string;
  caption: string;
  generateDataUrl: () => string;
}

export function generateTomatoBlightLeaf(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 480;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background - clean neutral agricultural studio backdrop
  const bgGrad = ctx.createLinearGradient(0, 0, 480, 480);
  bgGrad.addColorStop(0, '#1c2420');
  bgGrad.addColorStop(1, '#0e1411');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 480, 480);

  // Soft leaf drop shadow
  ctx.save();
  ctx.filter = 'blur(12px)';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.beginPath();
  ctx.ellipse(240, 255, 145, 190, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Leaf Main Body (Tomato Compound Leaflet)
  const leafGrad = ctx.createRadialGradient(230, 200, 20, 240, 240, 210);
  leafGrad.addColorStop(0, '#388e3c');
  leafGrad.addColorStop(0.6, '#2e7d32');
  leafGrad.addColorStop(1, '#1b5e20');
  ctx.fillStyle = leafGrad;
  ctx.strokeStyle = '#144517';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(240, 50);
  // Serrated leaflet contour
  ctx.bezierCurveTo(280, 80, 310, 110, 340, 160);
  ctx.bezierCurveTo(370, 210, 385, 270, 350, 330);
  ctx.bezierCurveTo(320, 380, 270, 410, 240, 430);
  ctx.bezierCurveTo(210, 410, 160, 380, 130, 330);
  ctx.bezierCurveTo(95, 270, 110, 210, 140, 160);
  ctx.bezierCurveTo(170, 110, 200, 80, 240, 50);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Leaf midrib and secondary veins
  ctx.strokeStyle = 'rgba(165, 214, 167, 0.45)';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(240, 430);
  ctx.quadraticCurveTo(238, 250, 240, 55);
  ctx.stroke();

  // Lateral veins
  ctx.lineWidth = 1.8;
  const veinPairs = [
    [100, 275, 115, 205, 130],
    [160, 315, 180, 160, 190],
    [220, 340, 250, 135, 260],
    [280, 330, 310, 145, 320],
    [340, 300, 360, 175, 370],
  ];
  for (const [vy, rx, ry, lx, ly] of veinPairs) {
    ctx.beginPath();
    ctx.moveTo(240, vy);
    ctx.quadraticCurveTo((240 + rx) / 2, vy - 15, rx, ry);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(240, vy);
    ctx.quadraticCurveTo((240 + lx) / 2, vy - 15, lx, ly);
    ctx.stroke();
  }

  // Early Blight Target-Board Necrotic Lesions (Alternaria solani)
  const drawTargetLesion = (cx: number, cy: number, r: number) => {
    // Chlorotic yellow halo
    const haloGrad = ctx.createRadialGradient(cx, cy, r * 0.7, cx, cy, r * 1.5);
    haloGrad.addColorStop(0, 'rgba(253, 216, 53, 0.85)');
    haloGrad.addColorStop(1, 'rgba(253, 216, 53, 0)');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Concentric dark necrotic rings
    ctx.fillStyle = '#4e342e';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // Ring 1
    ctx.strokeStyle = '#271914';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.75, 0, Math.PI * 2);
    ctx.stroke();

    // Ring 2
    ctx.strokeStyle = '#6d4c41';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.45, 0, Math.PI * 2);
    ctx.stroke();

    // Center dark core
    ctx.fillStyle = '#1b0000';
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.2, 0, Math.PI * 2);
    ctx.fill();
  };

  drawTargetLesion(275, 230, 36);
  drawTargetLesion(190, 310, 26);
  drawTargetLesion(210, 160, 20);

  return canvas.toDataURL('image/jpeg', 0.92);
}

export function generateHealthyPotatoLeaf(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 480;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, 480, 480);
  bgGrad.addColorStop(0, '#17221d');
  bgGrad.addColorStop(1, '#0c1511');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 480, 480);

  // Vibrant Healthy Solanum tuberosum leaf
  ctx.save();
  ctx.filter = 'blur(10px)';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.beginPath();
  ctx.ellipse(240, 255, 140, 180, 0.05, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const leafGrad = ctx.createRadialGradient(240, 210, 30, 240, 240, 200);
  leafGrad.addColorStop(0, '#43a047');
  leafGrad.addColorStop(0.7, '#2e7d32');
  leafGrad.addColorStop(1, '#1b5e20');
  ctx.fillStyle = leafGrad;
  ctx.strokeStyle = '#144617';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(240, 55);
  ctx.bezierCurveTo(300, 95, 345, 155, 360, 235);
  ctx.bezierCurveTo(370, 310, 325, 375, 240, 425);
  ctx.bezierCurveTo(155, 375, 110, 310, 120, 235);
  ctx.bezierCurveTo(135, 155, 180, 95, 240, 55);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Primary midrib
  ctx.strokeStyle = '#a5d6a7';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(240, 425);
  ctx.lineTo(240, 60);
  ctx.stroke();

  // Fine pinnate venation
  ctx.lineWidth = 1.6;
  const ribs = [110, 160, 210, 260, 310, 360];
  for (const y of ribs) {
    ctx.beginPath();
    ctx.moveTo(240, y);
    ctx.quadraticCurveTo(290, y - 20, 335, y - 40);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(240, y);
    ctx.quadraticCurveTo(190, y - 20, 145, y - 40);
    ctx.stroke();
  }

  return canvas.toDataURL('image/jpeg', 0.92);
}

export function generateGrapeDownyMildewLeaf(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 480;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const bgGrad = ctx.createLinearGradient(0, 0, 480, 480);
  bgGrad.addColorStop(0, '#1b2220');
  bgGrad.addColorStop(1, '#0e1311');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 480, 480);

  // Grape Palmate Leaf (Vitis vinifera)
  const leafGrad = ctx.createRadialGradient(240, 240, 40, 240, 240, 210);
  leafGrad.addColorStop(0, '#4caf50');
  leafGrad.addColorStop(0.7, '#2e7d32');
  leafGrad.addColorStop(1, '#1b5e20');
  ctx.fillStyle = leafGrad;
  ctx.strokeStyle = '#144617';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(240, 60);
  ctx.bezierCurveTo(270, 110, 320, 120, 370, 140);
  ctx.bezierCurveTo(390, 200, 370, 260, 350, 310);
  ctx.bezierCurveTo(360, 360, 310, 390, 240, 420);
  ctx.bezierCurveTo(170, 390, 120, 360, 130, 310);
  ctx.bezierCurveTo(110, 260, 90, 200, 110, 140);
  ctx.bezierCurveTo(160, 120, 210, 110, 240, 60);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Palmate main veins (5 main ribs radiating from petiole)
  ctx.strokeStyle = '#a5d6a7';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(240, 420);
  ctx.lineTo(240, 70);
  ctx.moveTo(240, 420);
  ctx.lineTo(365, 145);
  ctx.moveTo(240, 420);
  ctx.lineTo(115, 145);
  ctx.moveTo(240, 420);
  ctx.lineTo(345, 305);
  ctx.moveTo(240, 420);
  ctx.lineTo(135, 305);
  ctx.stroke();

  // Downy Mildew Oil Spots (Plasmopara viticola)
  const drawOilSpot = (cx: number, cy: number, w: number, h: number) => {
    ctx.save();
    const oilGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, w);
    oilGrad.addColorStop(0, '#fbc02d');
    oilGrad.addColorStop(0.6, '#fdd835');
    oilGrad.addColorStop(0.9, '#c0ca33');
    oilGrad.addColorStop(1, 'rgba(192, 202, 51, 0)');
    ctx.fillStyle = oilGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, w, h, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  drawOilSpot(200, 230, 40, 32);
  drawOilSpot(290, 210, 48, 38);
  drawOilSpot(250, 310, 35, 28);

  return canvas.toDataURL('image/jpeg', 0.92);
}

export function generateRiceBlastLeaf(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 480;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const bgGrad = ctx.createLinearGradient(0, 0, 480, 480);
  bgGrad.addColorStop(0, '#1a221f');
  bgGrad.addColorStop(1, '#0e1411');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 480, 480);

  // Elongated Rice / Paddy blade (Oryza sativa)
  ctx.save();
  ctx.translate(240, 240);
  ctx.rotate(-0.35);

  // Blade
  const bladeGrad = ctx.createLinearGradient(-40, 0, 40, 0);
  bladeGrad.addColorStop(0, '#2e7d32');
  bladeGrad.addColorStop(0.5, '#43a047');
  bladeGrad.addColorStop(1, '#1b5e20');
  ctx.fillStyle = bladeGrad;
  ctx.beginPath();
  ctx.moveTo(0, -220);
  ctx.quadraticCurveTo(55, -50, 45, 220);
  ctx.lineTo(-45, 220);
  ctx.quadraticCurveTo(-55, -50, 0, -220);
  ctx.closePath();
  ctx.fill();

  // Parallel venation
  ctx.strokeStyle = 'rgba(165, 214, 167, 0.4)';
  ctx.lineWidth = 1.2;
  for (let x = -35; x <= 35; x += 10) {
    ctx.beginPath();
    ctx.moveTo(x * 0.8, -200);
    ctx.lineTo(x, 210);
    ctx.stroke();
  }

  // Rice Blast spindle / diamond lesions (Magnaporthe oryzae)
  const drawSpindleLesion = (ly: number, size: number) => {
    // Yellow halo
    ctx.fillStyle = '#fbc02d';
    ctx.beginPath();
    ctx.ellipse(0, ly, size * 0.4, size, 0, 0, Math.PI * 2);
    ctx.fill();

    // Brown necrosis
    ctx.fillStyle = '#5d4037';
    ctx.beginPath();
    ctx.ellipse(0, ly, size * 0.28, size * 0.75, 0, 0, Math.PI * 2);
    ctx.fill();

    // Gray ash center
    ctx.fillStyle = '#b0bec5';
    ctx.beginPath();
    ctx.ellipse(0, ly, size * 0.14, size * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  drawSpindleLesion(-50, 50);
  drawSpindleLesion(60, 40);

  ctx.restore();

  return canvas.toDataURL('image/jpeg', 0.92);
}

export const SAMPLE_SPECIMENS: SampleSpecimenItem[] = [
  {
    id: 'tomato_early_blight',
    title: 'Tomato Early Blight',
    crop: 'Tomato',
    caption: 'Target-board necrotic concentric rings',
    generateDataUrl: generateTomatoBlightLeaf,
  },
  {
    id: 'potato_healthy',
    title: 'Healthy Potato Foliage',
    crop: 'Potato',
    caption: 'Vibrant green Solanum tuberosum leaf',
    generateDataUrl: generateHealthyPotatoLeaf,
  },
  {
    id: 'grape_downy_mildew',
    title: 'Grape Downy Mildew',
    crop: 'Grape',
    caption: 'Oily chlorotic foliar lesions',
    generateDataUrl: generateGrapeDownyMildewLeaf,
  },
  {
    id: 'rice_blast',
    title: 'Rice Blast Lesions',
    crop: 'Rice / Paddy',
    caption: 'Diamond spindle-shaped necrotic spots',
    generateDataUrl: generateRiceBlastLeaf,
  },
];
