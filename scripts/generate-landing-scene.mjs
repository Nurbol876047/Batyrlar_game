import fs from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import pngjs from "pngjs";

const { PNG } = pngjs;

const WIDTH = 1218;
const HEIGHT = 811;
const OUT_DIR = path.join(process.cwd(), "public", "assets", "landing");
const OUT_FILE = path.join(OUT_DIR, "batyr-steppe-scene.png");

function hex(value, alpha = 1) {
  const raw = value.replace("#", "");
  return {
    r: Number.parseInt(raw.slice(0, 2), 16),
    g: Number.parseInt(raw.slice(2, 4), 16),
    b: Number.parseInt(raw.slice(4, 6), 16),
    a: Math.round(alpha * 255),
  };
}

function mix(a, b, t) {
  const c1 = hex(a);
  const c2 = hex(b);
  return {
    r: Math.round(c1.r + (c2.r - c1.r) * t),
    g: Math.round(c1.g + (c2.g - c1.g) * t),
    b: Math.round(c1.b + (c2.b - c1.b) * t),
    a: 255,
  };
}

class Canvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.png = new PNG({ width, height });
    this.png.data.fill(0);
  }

  pixel(x, y, color) {
    const px = Math.round(x);
    const py = Math.round(y);

    if (px < 0 || py < 0 || px >= this.width || py >= this.height) {
      return;
    }

    const src = typeof color === "string" ? hex(color) : color;
    const index = (py * this.width + px) << 2;
    const srcA = src.a / 255;
    const dstA = this.png.data[index + 3] / 255;
    const outA = srcA + dstA * (1 - srcA);

    if (outA <= 0) {
      return;
    }

    this.png.data[index] = Math.round((src.r * srcA + this.png.data[index] * dstA * (1 - srcA)) / outA);
    this.png.data[index + 1] = Math.round((src.g * srcA + this.png.data[index + 1] * dstA * (1 - srcA)) / outA);
    this.png.data[index + 2] = Math.round((src.b * srcA + this.png.data[index + 2] * dstA * (1 - srcA)) / outA);
    this.png.data[index + 3] = Math.round(outA * 255);
  }

  rect(x, y, w, h, color) {
    for (let py = Math.round(y); py < Math.round(y + h); py += 1) {
      for (let px = Math.round(x); px < Math.round(x + w); px += 1) {
        this.pixel(px, py, color);
      }
    }
  }

  ellipse(cx, cy, rx, ry, color) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y += 1) {
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x += 1) {
        const nx = (x + 0.5 - cx) / rx;
        const ny = (y + 0.5 - cy) / ry;

        if (nx * nx + ny * ny <= 1) {
          this.pixel(x, y, color);
        }
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
        if (inside(x + 0.5, y + 0.5, points)) {
          this.pixel(x, y, color);
        }
      }
    }
  }
}

function inside(x, y, points) {
  let result = false;

  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    const [xi, yi] = points[i];
    const [xj, yj] = points[j];
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) {
      result = !result;
    }
  }

  return result;
}

function drawCloud(canvas, x, y, color, alpha = 0.36, scale = 1) {
  const c = hex(color, alpha);
  canvas.rect(x, y + 16 * scale, 88 * scale, 6 * scale, c);
  canvas.rect(x + 12 * scale, y + 8 * scale, 42 * scale, 10 * scale, c);
  canvas.rect(x + 44 * scale, y, 34 * scale, 18 * scale, c);
  canvas.rect(x + 72 * scale, y + 10 * scale, 38 * scale, 9 * scale, c);
}

function drawMountains(canvas) {
  canvas.polygon(
    [
      [0, 505],
      [288, 284],
      [430, 430],
      [500, 505],
    ],
    "#102a4a",
  );
  canvas.polygon(
    [
      [190, 505],
      [498, 326],
      [635, 505],
    ],
    "#0d2442",
  );
  canvas.polygon(
    [
      [450, 505],
      [826, 362],
      [1010, 505],
    ],
    "#0e2749",
  );
  canvas.polygon(
    [
      [760, 505],
      [1150, 316],
      [1260, 505],
    ],
    "#132d4e",
  );
  canvas.polygon(
    [
      [250, 330],
      [288, 284],
      [320, 352],
      [292, 328],
      [276, 362],
    ],
    hex("#d9edf4", 0.23),
  );
  canvas.polygon(
    [
      [468, 372],
      [498, 326],
      [528, 393],
      [500, 374],
      [485, 405],
    ],
    hex("#b9d8e8", 0.14),
  );
}

function drawStars(canvas) {
  for (let i = 0; i < 130; i += 1) {
    const x = (i * 83 + 41) % WIDTH;
    const y = 40 + ((i * 47 + 19) % 340);
    const bright = i % 13 === 0;
    const c = bright ? "#fff1c2" : i % 3 === 0 ? "#8da8d8" : "#e7f3ff";
    canvas.rect(x, y, bright ? 3 : 2, bright ? 3 : 2, hex(c, bright ? 0.9 : 0.42));
  }
}

function drawMoon(canvas) {
  for (let r = 78; r >= 46; r -= 8) {
    canvas.circle(820, 178, r, hex("#9bd1ff", 0.025));
  }

  canvas.circle(820, 178, 44, "#f4f0c9");
  canvas.circle(804, 160, 11, hex("#a3aa99", 0.28));
  canvas.circle(837, 173, 15, hex("#9da593", 0.24));
  canvas.circle(813, 196, 17, hex("#a4ad99", 0.22));
  canvas.circle(833, 203, 8, hex("#9ca58e", 0.2));
  canvas.rect(780, 176, 79, 3, hex("#fff8d8", 0.24));
}

function drawGround(canvas) {
  canvas.rect(0, 535, WIDTH, 95, "#172d25");
  canvas.rect(0, 585, WIDTH, 42, "#243b21");
  canvas.rect(0, 612, WIDTH, 28, "#6d8730");

  for (let x = 0; x < WIDTH; x += 8) {
    const h = 8 + ((x * 13) % 13);
    canvas.rect(x, 610 - h * 0.3, 8, h, x % 24 === 0 ? "#9eb449" : "#789332");
  }

  canvas.rect(0, 642, WIDTH, 44, "#1a1a18");
  canvas.rect(0, 686, WIDTH, HEIGHT - 686, "#07101d");

  for (let x = 6; x < WIDTH; x += 37) {
    const y = 656 + ((x * 7) % 45);
    canvas.rect(x, y, 22, 13, hex("#47311d", 0.5));
  }
}

function drawYurt(canvas) {
  canvas.ellipse(87, 395, 96, 30, "#5a5145");
  canvas.polygon(
    [
      [0, 515],
      [50, 386],
      [158, 386],
      [210, 515],
    ],
    "#c6b68e",
  );
  canvas.polygon(
    [
      [0, 518],
      [40, 399],
      [168, 399],
      [214, 518],
    ],
    hex("#40382e", 0.48),
  );
  canvas.rect(0, 456, 212, 25, "#744032");
  canvas.rect(0, 461, 212, 10, "#d7cab0");

  for (let x = 12; x < 200; x += 32) {
    canvas.line(x, 456, x + 18, 480, 3, "#983c2d");
    canvas.line(x + 18, 456, x, 480, 3, "#983c2d");
  }

  canvas.rect(2, 504, 210, 108, "#857a62");
  canvas.rect(78, 503, 55, 108, "#090c12");
  canvas.rect(88, 516, 32, 85, "#1c1510");
  canvas.rect(6, 566, 96, 30, "#4a3727");
  canvas.rect(4, 596, 32, 18, "#2c2118");
  canvas.rect(156, 532, 54, 74, "#3d3025");
}

function drawFire(canvas) {
  const x = 245;
  const y = 610;
  canvas.ellipse(x, y + 10, 36, 8, hex("#04070a", 0.4));
  canvas.line(x - 30, y + 5, x + 28, y + 15, 8, "#4c2b18");
  canvas.line(x - 22, y + 15, x + 21, y + 3, 8, "#5f351d");

  for (let i = 0; i < 6; i += 1) {
    const fx = x - 20 + i * 8;
    const h = 40 + (i % 2) * 22;
    canvas.polygon(
      [
        [fx - 9, y + 6],
        [fx, y - h],
        [fx + 11, y + 6],
      ],
      i % 2 === 0 ? "#ff7b19" : "#ffd75d",
    );
  }

  canvas.polygon(
    [
      [x - 9, y + 3],
      [x + 2, y - 40],
      [x + 12, y + 3],
    ],
    "#fff0a3",
  );
}

function pasteNearest(canvas, sprite, sx, sy, scale) {
  for (let y = 0; y < sprite.height; y += 1) {
    for (let x = 0; x < sprite.width; x += 1) {
      const index = (y * sprite.width + x) << 2;
      const alpha = sprite.data[index + 3];

      if (alpha === 0) {
        continue;
      }

      const c = {
        r: sprite.data[index],
        g: sprite.data[index + 1],
        b: sprite.data[index + 2],
        a: alpha,
      };

      canvas.rect(sx + x * scale, sy + y * scale, scale, scale, c);
    }
  }
}

function drawEnemy(canvas, x, footY, scale = 1.15) {
  const s = scale;
  canvas.ellipse(x + 30 * s, footY + 4 * s, 32 * s, 7 * s, hex("#020814", 0.36));
  canvas.rect(x + 16 * s, footY - 55 * s, 31 * s, 45 * s, "#8f2f32");
  canvas.rect(x + 14 * s, footY - 58 * s, 35 * s, 20 * s, "#521b24");
  canvas.rect(x + 20 * s, footY - 18 * s, 8 * s, 18 * s, "#3a1c14");
  canvas.rect(x + 38 * s, footY - 18 * s, 8 * s, 18 * s, "#3a1c14");
  canvas.ellipse(x + 31 * s, footY - 73 * s, 17 * s, 20 * s, "#c48562");
  canvas.rect(x + 22 * s, footY - 64 * s, 19 * s, 12 * s, "#21110c");
  canvas.polygon(
    [
      [x + 12 * s, footY - 80 * s],
      [x + 31 * s, footY - 103 * s],
      [x + 53 * s, footY - 80 * s],
    ],
    "#8c2b36",
  );
  canvas.line(x + 54 * s, footY - 34 * s, x + 84 * s, footY - 105 * s, 6 * s, "#7b542d");
  canvas.polygon(
    [
      [x + 86 * s, footY - 112 * s],
      [x + 98 * s, footY - 95 * s],
      [x + 82 * s, footY - 91 * s],
    ],
    "#dfe6ec",
  );
}

function drawArtifact(canvas) {
  const cx = 612;
  const cy = 542;
  canvas.circle(cx, cy, 43, hex("#f3b63c", 0.96));
  canvas.circle(cx, cy, 39, "#06111f");
  canvas.rect(cx - 21, cy - 16, 17, 29, "#f8c34a");
  canvas.rect(cx + 4, cy - 16, 17, 29, "#f8c34a");
  canvas.rect(cx - 17, cy - 10, 9, 4, "#06111f");
  canvas.rect(cx + 8, cy - 10, 9, 4, "#06111f");
  canvas.rect(cx - 17, cy + 1, 9, 4, "#06111f");
  canvas.rect(cx + 8, cy + 1, 9, 4, "#06111f");
}

function drawRightCamp(canvas) {
  canvas.rect(1060, 420, 16, 205, "#221a12");
  canvas.rect(1118, 420, 16, 205, "#221a12");
  canvas.rect(1038, 434, 116, 9, "#5a3b22");
  canvas.rect(1076, 360, 48, 54, "#30251d");
  canvas.rect(1082, 372, 34, 42, "#745034");
  canvas.line(1076, 414, 1126, 414, 6, "#1a120d");
  canvas.rect(1086, 343, 28, 12, "#1c130e");
  canvas.polygon(
    [
      [1068, 364],
      [1100, 333],
      [1132, 364],
    ],
    "#423322",
  );
  canvas.rect(1088, 340, 20, 210, "#7c2438");
  canvas.rect(1093, 348, 44, 157, "#5d1d2d");
  canvas.line(1125, 505, 1172, 614, 7, "#28331b");
  canvas.rect(1116, 323, 9, 30, "#c3943c");
  canvas.line(1078, 343, 1163, 343, 9, "#4a2d18");
  canvas.line(1115, 430, 1115, 477, 5, "#b8a9a1");
  canvas.line(1102, 454, 1115, 477, 5, "#b8a9a1");
  canvas.line(1128, 454, 1115, 477, 5, "#b8a9a1");
}

const canvas = new Canvas(WIDTH, HEIGHT);

for (let y = 0; y < HEIGHT; y += 1) {
  const t = y / HEIGHT;
  const c = y < 520 ? mix("#010923", "#103766", t * 1.2) : mix("#0b1d2d", "#040a14", (y - 520) / 291);
  canvas.rect(0, y, WIDTH, 1, c);
}

drawStars(canvas);
drawCloud(canvas, 12, 155, "#244f87", 0.44, 1.25);
drawCloud(canvas, 360, 235, "#2c5f93", 0.36, 1.35);
drawCloud(canvas, 840, 310, "#315b83", 0.34, 1.22);
drawCloud(canvas, 1088, 256, "#315b83", 0.36, 1.1);
drawMoon(canvas);
drawMountains(canvas);
drawGround(canvas);
drawYurt(canvas);
drawRightCamp(canvas);
drawFire(canvas);

const heroPath = path.join(process.cwd(), "public", "assets", "heroes", "kabanbai.png");
if (fs.existsSync(heroPath)) {
  const hero = PNG.sync.read(fs.readFileSync(heroPath));
  pasteNearest(canvas, hero, 310, 478, 1.32);
}

drawArtifact(canvas);
drawEnemy(canvas, 742, 622, 1.05);
drawEnemy(canvas, 872, 622, 1.05);
drawEnemy(canvas, 1020, 622, 1.05);

await mkdir(OUT_DIR, { recursive: true });
await new Promise((resolve, reject) => {
  canvas.png
    .pack()
    .pipe(fs.createWriteStream(OUT_FILE))
    .on("finish", resolve)
    .on("error", reject);
});

console.log(`generated ${path.relative(process.cwd(), OUT_FILE)}`);
