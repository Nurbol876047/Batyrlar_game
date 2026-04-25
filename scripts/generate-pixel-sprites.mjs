import fs from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import pngjs from "pngjs";

const { PNG } = pngjs;

const FRAME = 96;
const CARD = 128;
const SHEET_FRAMES = 12;
const HERO_DIR = path.join(process.cwd(), "public", "assets", "heroes");
const SPRITE_DIR = path.join(process.cwd(), "public", "assets", "sprites");

const black = "#140d09";
const blackSoft = "#2a1a10";
const skin = "#f0a66f";
const skinShadow = "#c77b4d";
const wood = "#7a4a25";
const woodDark = "#3b2414";
const steel = "#dce8f0";
const steelShadow = "#87939c";

const heroes = [
  {
    id: "qobylandy",
    asset: "koblandy",
    helmet: "#cdd6dd",
    helmetDark: "#697782",
    helmetLight: "#ffffff",
    cloth: "#174d87",
    clothDark: "#0e2f58",
    clothLight: "#2d74b1",
    belt: "#d39a23",
    shield: "#5c3a22",
    shieldDark: "#2e1d12",
    shieldLight: "#a9763d",
    beard: "#20120c",
    boots: "#a93a17",
    plume: "#eaf2f6",
    weapon: "spear",
    speed: 3,
    heavy: 0,
  },
  {
    id: "bogenbay",
    asset: "bogenbai",
    helmet: "#d99b17",
    helmetDark: "#805006",
    helmetLight: "#ffe68a",
    cloth: "#6e4024",
    clothDark: "#321e13",
    clothLight: "#a66d31",
    belt: "#e4a62a",
    shield: "#694321",
    shieldDark: "#2f1d10",
    shieldLight: "#b9843d",
    beard: "#1d100b",
    boots: "#8b3216",
    plume: "#f0b834",
    weapon: "axe",
    speed: 0,
    heavy: 1,
  },
  {
    id: "qabanbay",
    asset: "kabanbai",
    helmet: "#d99b17",
    helmetDark: "#835308",
    helmetLight: "#ffe172",
    cloth: "#2455a5",
    clothDark: "#123166",
    clothLight: "#3b75c2",
    belt: "#e0a327",
    shield: "#6a4122",
    shieldDark: "#2f1c11",
    shieldLight: "#b77e39",
    beard: "#21120d",
    boots: "#a23a16",
    plume: "#f2c842",
    weapon: "spear",
    speed: 1,
    heavy: 0.3,
  },
  {
    id: "raiymbek",
    asset: "raimbek",
    helmet: "#d99b17",
    helmetDark: "#835308",
    helmetLight: "#ffe172",
    cloth: "#2f783b",
    clothDark: "#1b4826",
    clothLight: "#58a85d",
    belt: "#df9a22",
    shield: "#62401f",
    shieldDark: "#2c1c10",
    shieldLight: "#a97739",
    beard: "#21120d",
    boots: "#873417",
    plume: "#7cc34b",
    weapon: "saber",
    speed: 4,
    heavy: -0.2,
  },
];

const framePlan = [
  ["idle", 0],
  ["idle", 1],
  ["walk", 0],
  ["walk", 1],
  ["walk", 2],
  ["walk", 3],
  ["attack", 0],
  ["attack", 1],
  ["attack", 2],
  ["jump", 0],
  ["hurt", 0],
  ["victory", 0],
];

function rgba(hex, alpha = 1) {
  const raw = hex.replace("#", "");
  return {
    r: Number.parseInt(raw.slice(0, 2), 16),
    g: Number.parseInt(raw.slice(2, 4), 16),
    b: Number.parseInt(raw.slice(4, 6), 16),
    a: Math.round(alpha * 255),
  };
}

class Canvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.png = new PNG({ width, height });
    this.png.data.fill(0);
  }

  px(x, y, color) {
    const px = Math.round(x);
    const py = Math.round(y);

    if (px < 0 || py < 0 || px >= this.width || py >= this.height) return;

    const src = typeof color === "string" ? rgba(color) : color;
    const i = (py * this.width + px) << 2;
    const sa = src.a / 255;
    const da = this.png.data[i + 3] / 255;
    const oa = sa + da * (1 - sa);

    if (oa <= 0) return;

    this.png.data[i] = Math.round((src.r * sa + this.png.data[i] * da * (1 - sa)) / oa);
    this.png.data[i + 1] = Math.round((src.g * sa + this.png.data[i + 1] * da * (1 - sa)) / oa);
    this.png.data[i + 2] = Math.round((src.b * sa + this.png.data[i + 2] * da * (1 - sa)) / oa);
    this.png.data[i + 3] = Math.round(oa * 255);
  }

  rect(x, y, w, h, color) {
    for (let yy = Math.round(y); yy < Math.round(y + h); yy += 1) {
      for (let xx = Math.round(x); xx < Math.round(x + w); xx += 1) {
        this.px(xx, yy, color);
      }
    }
  }

  ellipse(cx, cy, rx, ry, color) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y += 1) {
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x += 1) {
        const nx = (x + 0.5 - cx) / rx;
        const ny = (y + 0.5 - cy) / ry;
        if (nx * nx + ny * ny <= 1) this.px(x, y, color);
      }
    }
  }

  circle(cx, cy, r, color) {
    this.ellipse(cx, cy, r, r, color);
  }

  line(x0, y0, x1, y1, width, color) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1) * 2;
    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      this.ellipse(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, width / 2, width / 2, color);
    }
  }

  polygon(points, color) {
    const xs = points.map(([x]) => x);
    const ys = points.map(([, y]) => y);
    for (let y = Math.floor(Math.min(...ys)); y <= Math.ceil(Math.max(...ys)); y += 1) {
      for (let x = Math.floor(Math.min(...xs)); x <= Math.ceil(Math.max(...xs)); x += 1) {
        if (inside(x + 0.5, y + 0.5, points)) this.px(x, y, color);
      }
    }
  }
}

function inside(x, y, points) {
  let value = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    const [xi, yi] = points[i];
    const [xj, yj] = points[j];
    const hit = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (hit) value = !value;
  }
  return value;
}

function poseFor(anim, frame, hero) {
  if (anim === "walk") {
    return {
      bob: [0, -2, 0, -2][frame],
      bodyLean: hero.speed * 0.4,
      leftLeg: [-3, 4, 5, -4][frame],
      rightLeg: [4, -3, -5, 4][frame],
      spear: 0,
      attack: 0,
      shieldShift: [0, -1, 0, 1][frame],
    };
  }
  if (anim === "attack") {
    return {
      bob: -1,
      bodyLean: [1, 5, 3][frame],
      leftLeg: [-2, 2, 4][frame],
      rightLeg: [2, -2, -4][frame],
      spear: [5, 19, 12][frame],
      attack: frame + 1,
      shieldShift: 2,
    };
  }
  if (anim === "jump") {
    return { bob: -8, bodyLean: hero.speed * 0.7, leftLeg: -5, rightLeg: 5, spear: 1, attack: 0, shieldShift: -2 };
  }
  if (anim === "hurt") {
    return { bob: 1, bodyLean: -6, leftLeg: -2, rightLeg: 2, spear: -9, attack: 0, shieldShift: -4, hurt: true };
  }
  if (anim === "victory") {
    return { bob: -3, bodyLean: 0, leftLeg: 0, rightLeg: 0, spear: -2, attack: 0, shieldShift: -1, victory: true };
  }
  return { bob: frame === 0 ? 0 : -1, bodyLean: 0, leftLeg: 0, rightLeg: 0, spear: 0, attack: 0, shieldShift: frame === 0 ? 0 : -1 };
}

function drawFrame(canvas, hero, anim, frame, ox = 0, oy = 0) {
  const p = poseFor(anim, frame, hero);
  const cx = ox + 47 + p.bodyLean;
  const foot = oy + 91;
  const bodyY = oy + 53 + p.bob;
  const headY = oy + 30 + p.bob;

  canvas.ellipse(ox + 48, oy + 91, 34, 5, rgba("#02050a", 0.32));

  drawLeg(canvas, cx - 7, bodyY + 30, cx - 13 + p.leftLeg, foot - 5, hero.boots);
  drawLeg(canvas, cx + 8, bodyY + 30, cx + 11 + p.rightLeg, foot - 5, hero.boots);

  drawBody(canvas, hero, cx, bodyY, p);
  drawShield(canvas, hero, cx - 21 + p.shieldShift, bodyY + 14 + Math.abs(p.leftLeg) * 0.1);
  drawArms(canvas, hero, cx, bodyY, p);
  drawWeapon(canvas, hero, cx, bodyY, p, ox, oy);
  drawHead(canvas, hero, cx + (p.hurt ? -3 : 0), headY, p);

  if (p.attack > 1) drawSlash(canvas, hero, ox, oy, p.attack);
  if (p.hurt) {
    canvas.rect(ox + 16, oy + 61, 3, 3, "#d74832");
    canvas.rect(ox + 20, oy + 68, 2, 2, "#ffad55");
  }
}

function drawLeg(canvas, x0, y0, x1, y1, boot) {
  canvas.line(x0, y0, x1, y1, 8, black);
  canvas.line(x0, y0, x1, y1, 5, "#15335b");
  canvas.rect(x1 - 7, y1 - 1, 15, 6, black);
  canvas.rect(x1 - 5, y1, 12, 4, boot);
}

function drawBody(canvas, hero, cx, y, p) {
  canvas.polygon(
    [
      [cx - 18, y - 3],
      [cx + 19, y - 4],
      [cx + 23, y + 36],
      [cx - 22, y + 36],
    ],
    black,
  );
  canvas.polygon(
    [
      [cx - 15, y],
      [cx + 16, y],
      [cx + 18, y + 32],
      [cx - 18, y + 32],
    ],
    hero.cloth,
  );
  canvas.rect(cx - 16, y + 17, 35, 15, hero.clothDark);
  canvas.rect(cx - 13, y + 3, 8, 25, hero.clothLight);
  canvas.rect(cx + 11, y + 2, 5, 25, rgba("#ffffff", 0.12));
  canvas.line(cx - 14, y + 2, cx + 15, y + 30, 5, hero.belt);
  canvas.rect(cx - 20, y + 18, 43, 6, black);
  canvas.rect(cx - 17, y + 19, 37, 4, hero.belt);
  canvas.circle(cx + 1, y + 21, 6, black);
  canvas.circle(cx + 1, y + 21, 4, hero.helmetLight);
  canvas.rect(cx - 3, y + 32, 7, 11, black);
}

function drawShield(canvas, hero, cx, cy) {
  canvas.circle(cx, cy, 21, black);
  canvas.circle(cx, cy, 18, hero.shield);
  canvas.circle(cx, cy, 13, hero.shieldDark);
  canvas.circle(cx, cy, 5, black);
  canvas.circle(cx, cy, 3, hero.helmetLight);
  canvas.rect(cx - 16, cy - 2, 32, 4, rgba("#ffffff", 0.08));
  canvas.rect(cx - 3, cy - 15, 6, 30, rgba("#000000", 0.12));
  canvas.line(cx - 15, cy - 12, cx + 12, cy + 15, 3, hero.shieldLight);
}

function drawArms(canvas, hero, cx, y, p) {
  const leftHandX = cx - 25 + p.shieldShift;
  const leftHandY = y + 15;
  canvas.line(cx - 13, y + 6, leftHandX, leftHandY, 7, black);
  canvas.line(cx - 13, y + 6, leftHandX, leftHandY, 4, hero.clothDark);

  const rightHandX = cx + 27 + p.spear * 0.45;
  const rightHandY = y + 18 - p.attack * 2;
  canvas.line(cx + 14, y + 7, rightHandX, rightHandY, 8, black);
  canvas.line(cx + 14, y + 7, rightHandX, rightHandY, 5, hero.cloth);
  canvas.circle(rightHandX, rightHandY, 5, black);
  canvas.circle(rightHandX, rightHandY, 3, skin);
}

function drawWeapon(canvas, hero, cx, y, p, ox, oy) {
  if (hero.weapon === "axe") {
    const handX = cx + 28 + p.spear * 0.45;
    const handY = y + 18 - p.attack * 2;
    const tipX = p.attack ? ox + 91 : cx + 40;
    const tipY = p.attack ? handY - 1 : y - 8;
    canvas.line(handX, handY + 11, tipX, tipY, 6, black);
    canvas.line(handX, handY + 11, tipX, tipY, 3, wood);
    canvas.polygon(
      [
        [tipX - 2, tipY - 8],
        [tipX + 17, tipY - 2],
        [tipX + 11, tipY + 15],
        [tipX - 7, tipY + 8],
      ],
      black,
    );
    canvas.polygon(
      [
        [tipX, tipY - 5],
        [tipX + 13, tipY - 1],
        [tipX + 8, tipY + 11],
        [tipX - 4, tipY + 6],
      ],
      steel,
    );
    return;
  }

  if (hero.weapon === "saber") {
    const handX = cx + 27 + p.spear * 0.6;
    const handY = y + 17 - p.attack * 2;
    const bladeX = p.attack ? ox + 91 : cx + 45;
    const bladeY = p.attack ? handY - 13 : oy + 18;
    canvas.line(handX, handY, bladeX, bladeY, 6, black);
    canvas.line(handX, handY, bladeX, bladeY, 3, steel);
    canvas.rect(handX - 5, handY - 3, 11, 5, hero.belt);
    return;
  }

  if (hero.weapon !== "spear") return;

  if (p.attack) {
    const handX = cx + 27 + p.spear * 0.45;
    const handY = y + 18 - p.attack * 2;
    const buttX = handX - 18;
    const buttY = handY + 7;
    const tipX = ox + 91;
    const tipY = handY - 3 - p.attack;

    canvas.line(buttX, buttY, tipX, tipY, 7, black);
    canvas.line(buttX + 3, buttY - 1, tipX - 6, tipY + 1, 4, wood);
    canvas.polygon(
      [
        [tipX + 2, tipY],
        [tipX - 16, tipY - 9],
        [tipX - 12, tipY + 10],
      ],
      black,
    );
    canvas.polygon(
      [
        [tipX, tipY],
        [tipX - 13, tipY - 6],
        [tipX - 10, tipY + 7],
      ],
      steel,
    );
    canvas.rect(tipX - 12, tipY - 4, 5, 9, rgba("#ffffff", 0.35));
    return;
  }

  const x = cx + 33;
  const top = p.victory ? oy + 2 : oy + 18;
  const bottom = oy + 88;
  canvas.line(x, top, x, bottom, 7, black);
  canvas.line(x, top + 4, x, bottom - 3, 4, wood);
  canvas.polygon(
    [
      [x, top - 13],
      [x + 12, top + 8],
      [x, top + 22],
      [x - 12, top + 8],
    ],
    black,
  );
  canvas.polygon(
    [
      [x, top - 9],
      [x + 8, top + 8],
      [x, top + 18],
      [x - 8, top + 8],
    ],
    steel,
  );
  canvas.rect(x + 3, top, 5, 14, rgba("#ffffff", 0.35));
}

function drawSlash(canvas, hero, ox, oy, level) {
  const c = hero.weapon === "saber" ? "#bfffea" : "#fff0a6";
  canvas.rect(ox + 59, oy + 49, 30, 4, rgba(c, 0.68));
  canvas.rect(ox + 67, oy + 54, 23, 3, rgba("#ffffff", 0.65));
  if (level > 2) canvas.rect(ox + 73, oy + 44, 16, 3, rgba(c, 0.4));
}

function drawHead(canvas, hero, cx, cy, p) {
  canvas.rect(cx - 7, cy + 19, 14, 9, black);
  canvas.rect(cx - 5, cy + 19, 10, 7, skinShadow);
  canvas.ellipse(cx, cy + 1, 24, 26, black);
  canvas.ellipse(cx, cy + 2, 21, 23, skin);
  canvas.rect(cx - 16, cy + 9, 33, 20, hero.beard);
  canvas.rect(cx - 10, cy + 17, 21, 5, "#f2a96f");
  canvas.rect(cx - 7, cy + 17, 15, 3, black);
  canvas.rect(cx - 11, cy - 4, 5, 9, black);
  canvas.rect(cx + 10, cy - 4, 5, 9, black);
  canvas.rect(cx - 1, cy + 3, 4, 7, skinShadow);
  canvas.rect(cx - 22, cy - 16, 44, 16, black);
  canvas.rect(cx - 20, cy - 15, 40, 13, hero.helmet);
  canvas.rect(cx - 16, cy - 12, 32, 4, hero.helmetLight);
  canvas.polygon(
    [
      [cx - 24, cy - 14],
      [cx - 10, cy - 38],
      [cx + 18, cy - 32],
      [cx + 25, cy - 14],
    ],
    black,
  );
  canvas.polygon(
    [
      [cx - 20, cy - 15],
      [cx - 7, cy - 34],
      [cx + 15, cy - 29],
      [cx + 21, cy - 15],
    ],
    hero.helmet,
  );
  canvas.rect(cx - 23, cy - 8, 47, 8, black);
  canvas.rect(cx - 20, cy - 7, 41, 5, hero.helmet);
  canvas.rect(cx + 1, cy - 26, 12, 6, hero.helmetDark);
  canvas.polygon(
    [
      [cx + 5, cy - 33],
      [cx + 18, cy - 28],
      [cx + 7, cy - 22],
    ],
    hero.plume,
  );
  if (hero.helmet !== "#cdd6dd") {
    canvas.rect(cx - 2, cy - 45, 7, 15, black);
    canvas.rect(cx, cy - 43, 4, 13, hero.helmet);
  }
  if (p.victory) canvas.rect(cx - 9, cy + 12, 18, 4, hero.helmetLight);
}

function crop(src, frame) {
  const out = new Canvas(FRAME, FRAME);
  for (let y = 0; y < FRAME; y += 1) {
    for (let x = 0; x < FRAME; x += 1) {
      const si = (y * src.width + frame * FRAME + x) << 2;
      const di = (y * FRAME + x) << 2;
      out.png.data[di] = src.png.data[si];
      out.png.data[di + 1] = src.png.data[si + 1];
      out.png.data[di + 2] = src.png.data[si + 2];
      out.png.data[di + 3] = src.png.data[si + 3];
    }
  }
  return out;
}

function resizeNearest(src, width, height) {
  const out = new Canvas(width, height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const sx = Math.floor((x / width) * src.width);
      const sy = Math.floor((y / height) * src.height);
      const si = (sy * src.width + sx) << 2;
      const di = (y * width + x) << 2;
      out.png.data[di] = src.png.data[si];
      out.png.data[di + 1] = src.png.data[si + 1];
      out.png.data[di + 2] = src.png.data[si + 2];
      out.png.data[di + 3] = src.png.data[si + 3];
    }
  }
  return out;
}

function writePng(file, png) {
  return new Promise((resolve, reject) => {
    png
      .pack()
      .pipe(fs.createWriteStream(file))
      .on("finish", resolve)
      .on("error", reject);
  });
}

await mkdir(HERO_DIR, { recursive: true });
await mkdir(SPRITE_DIR, { recursive: true });

for (const hero of heroes) {
  const sheet = new Canvas(FRAME * SHEET_FRAMES, FRAME);
  framePlan.forEach(([anim, frame], index) => {
    drawFrame(sheet, hero, anim, frame, index * FRAME, 0);
  });

  const portrait = resizeNearest(crop(sheet, 0), CARD, CARD);
  const heroPath = path.join(HERO_DIR, `${hero.asset}.png`);
  const sheetPath = path.join(SPRITE_DIR, `${hero.asset}_sheet.png`);

  await writePng(heroPath, portrait.png);
  await writePng(sheetPath, sheet.png);

  console.log(`generated ${path.relative(process.cwd(), heroPath)}`);
  console.log(`generated ${path.relative(process.cwd(), sheetPath)}`);
}
