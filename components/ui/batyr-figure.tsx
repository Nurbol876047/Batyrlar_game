import { useId } from "react";

import type { Batyr, LevelEnemy } from "@/lib/types";
import { cn } from "@/lib/utils";

type WeaponKind = "spear" | "axe" | "saber" | "sword";
type BeardKind = "full" | "trimmed" | "pointed" | "goatee";

interface FigurePalette {
  skin: string;
  skinShadow: string;
  helmet: string;
  helmetShadow: string;
  trim: string;
  plume: string;
  armor: string;
  armorShadow: string;
  sash: string;
  fur: string;
  beard: string;
  brow: string;
  cloak: string;
  sleeve?: string;
  sleeveShadow?: string;
  tunic?: string;
  tunicShadow?: string;
  boots?: string;
  bootsShadow?: string;
  shield?: string;
  shieldShadow?: string;
  shieldRim?: string;
  weapon: WeaponKind;
  beardStyle: BeardKind;
  faceWidth: number;
  browTilt: number;
  eyeShift: number;
}

interface BattleSpriteProps {
  state: "idle" | "run" | "jump" | "attack" | "special" | "hit";
  direction: 1 | -1;
  className?: string;
}

function getBatyrFigurePalette(batyrId: string): FigurePalette {
  switch (batyrId) {
    case "qobylandy":
      return {
        skin: "#d7a275",
        skinShadow: "#b97e54",
        helmet: "#c59642",
        helmetShadow: "#8f642b",
        trim: "#f8d784",
        plume: "#35bfb1",
        armor: "#3a4a65",
        armorShadow: "#243244",
        sash: "#f0bb58",
        fur: "#5f4329",
        beard: "#2b1912",
        brow: "#24140f",
        cloak: "#563323",
        sleeve: "#2f6e35",
        sleeveShadow: "#224d26",
        tunic: "#5b4c8d",
        tunicShadow: "#3c3360",
        boots: "#9a3119",
        bootsShadow: "#641d0d",
        shield: "#4d3428",
        shieldShadow: "#281914",
        shieldRim: "#949ca3",
        weapon: "spear",
        beardStyle: "pointed",
        faceWidth: 21,
        browTilt: -4,
        eyeShift: 0,
      };
    case "bogenbay":
      return {
        skin: "#d3a379",
        skinShadow: "#b78259",
        helmet: "#8a969f",
        helmetShadow: "#59636a",
        trim: "#f3cf78",
        plume: "#d67637",
        armor: "#6c3530",
        armorShadow: "#45201c",
        sash: "#d58f45",
        fur: "#6a4a34",
        beard: "#322017",
        brow: "#261913",
        cloak: "#4a3026",
        sleeve: "#4d6b2f",
        sleeveShadow: "#33471f",
        tunic: "#6b4756",
        tunicShadow: "#442d37",
        boots: "#8f3718",
        bootsShadow: "#5a210d",
        shield: "#51362a",
        shieldShadow: "#2b1913",
        shieldRim: "#8d9498",
        weapon: "axe",
        beardStyle: "full",
        faceWidth: 24,
        browTilt: -2,
        eyeShift: -1,
      };
    case "qabanbay":
      return {
        skin: "#d8aa7d",
        skinShadow: "#bb835a",
        helmet: "#d69b16",
        helmetShadow: "#9f650b",
        trim: "#ffd45c",
        plume: "#f7c948",
        armor: "#244d9e",
        armorShadow: "#17305d",
        sash: "#d6931d",
        fur: "#59402f",
        beard: "#291710",
        brow: "#21130e",
        cloak: "#4d3225",
        sleeve: "#183b7c",
        sleeveShadow: "#112b5d",
        tunic: "#244d9e",
        tunicShadow: "#17305d",
        boots: "#9f2f17",
        bootsShadow: "#6d1d0d",
        shield: "#493128",
        shieldShadow: "#241611",
        shieldRim: "#b8c2c8",
        weapon: "spear",
        beardStyle: "trimmed",
        faceWidth: 23,
        browTilt: -3,
        eyeShift: 0,
      };
    case "raiymbek":
      return {
        skin: "#daad80",
        skinShadow: "#b87d55",
        helmet: "#b37b48",
        helmetShadow: "#7c5430",
        trim: "#f9d98d",
        plume: "#57c6c7",
        armor: "#285977",
        armorShadow: "#1a3650",
        sash: "#d86b52",
        fur: "#513729",
        beard: "#24150f",
        brow: "#1d120e",
        cloak: "#553426",
        sleeve: "#2d6738",
        sleeveShadow: "#1d4626",
        tunic: "#465795",
        tunicShadow: "#2b3767",
        boots: "#97331e",
        bootsShadow: "#5f1d10",
        shield: "#4d3528",
        shieldShadow: "#251712",
        shieldRim: "#90989f",
        weapon: "saber",
        beardStyle: "goatee",
        faceWidth: 20,
        browTilt: -5,
        eyeShift: 1,
      };
    default:
      return {
        skin: "#d8a77a",
        skinShadow: "#b77c57",
        helmet: "#9b8352",
        helmetShadow: "#6e5c3a",
        trim: "#f5d27f",
        plume: "#37b7ad",
        armor: "#38506a",
        armorShadow: "#1f2d40",
        sash: "#dd8a56",
        fur: "#5e3d29",
        beard: "#2b1711",
        brow: "#22120d",
        cloak: "#563323",
        sleeve: "#2f6a38",
        sleeveShadow: "#1e4624",
        tunic: "#534c86",
        tunicShadow: "#38345e",
        boots: "#96351b",
        bootsShadow: "#5e1e0d",
        shield: "#4a3228",
        shieldShadow: "#231612",
        shieldRim: "#8f989d",
        weapon: "sword",
        beardStyle: "trimmed",
        faceWidth: 22,
        browTilt: -3,
        eyeShift: 0,
      };
  }
}

function getEnemyPalette(type: LevelEnemy["type"]): FigurePalette {
  if (type === "boss") {
    return {
      skin: "#b57d62",
      skinShadow: "#8f5d45",
      helmet: "#5f252f",
      helmetShadow: "#34131b",
      trim: "#d7ad66",
      plume: "#f29d4b",
      armor: "#6b2436",
      armorShadow: "#38121b",
      sash: "#d1614f",
      fur: "#4d2c22",
      beard: "#24110e",
      brow: "#1b0d0a",
      cloak: "#3a1c24",
      weapon: "axe",
      beardStyle: "full",
      faceWidth: 24,
      browTilt: -1,
      eyeShift: 0,
    };
  }

  if (type === "guard") {
    return {
      skin: "#be8366",
      skinShadow: "#955b42",
      helmet: "#71303d",
      helmetShadow: "#441a22",
      trim: "#d8b26c",
      plume: "#f28a5f",
      armor: "#5d2738",
      armorShadow: "#33151d",
      sash: "#e67552",
      fur: "#4c3027",
      beard: "#23120d",
      brow: "#1b0d0a",
      cloak: "#3d1d25",
      weapon: "sword",
      beardStyle: "trimmed",
      faceWidth: 22,
      browTilt: -2,
      eyeShift: 0,
    };
  }

  return {
    skin: "#c48e71",
    skinShadow: "#9b6047",
    helmet: "#65293a",
    helmetShadow: "#3b1721",
    trim: "#d8af6c",
    plume: "#f2a170",
    armor: "#502233",
    armorShadow: "#2b121a",
    sash: "#e37b5a",
    fur: "#4a3029",
    beard: "#26130f",
    brow: "#1f0f0c",
    cloak: "#381a22",
    weapon: "spear",
    beardStyle: "goatee",
    faceWidth: 20,
    browTilt: -3,
    eyeShift: 0,
  };
}

function BeardShape({
  beardStyle,
  color,
}: {
  beardStyle: BeardKind;
  color: string;
}) {
  switch (beardStyle) {
    case "full":
      return (
        <>
          <path d="M48 63c5 12 14 20 22 20s17-8 22-20v12c0 13-10 24-22 24S48 88 48 75Z" fill={color} />
          <path d="M46 54c7 0 12 5 13 11H44c0-6 1-11 2-11Zm48 0c-1 0-4 5-4 11h15c-1-6-4-11-11-11Z" fill={color} />
        </>
      );
    case "pointed":
      return (
        <>
          <path d="M55 61c3 8 8 15 15 21 7-6 12-13 15-21v10c0 9-5 19-15 27-10-8-15-18-15-27Z" fill={color} />
          <path d="M46 56c5 1 9 5 10 9H43c0-4 1-7 3-9Zm48 0c3 2 4 5 4 9H86c1-4 3-8 8-9Z" fill={color} />
        </>
      );
    case "goatee":
      return (
        <>
          <path d="M61 72c2 6 5 10 9 14 4-4 7-8 9-14v6c0 6-3 12-9 18-6-6-9-12-9-18Z" fill={color} />
          <path d="M47 58c4 1 9 4 11 8H44c0-4 1-6 3-8Zm47 0c2 2 3 4 4 8H82c2-4 5-7 12-8Z" fill={color} />
        </>
      );
    default:
      return (
        <>
          <path d="M53 65c4 9 10 15 17 19 7-4 13-10 17-19v8c0 10-8 18-17 22-9-4-17-12-17-22Z" fill={color} />
          <path d="M46 57c4 1 8 4 10 8H43c0-4 1-6 3-8Zm48 0c2 2 3 4 4 8H84c1-4 4-7 10-8Z" fill={color} />
        </>
      );
  }
}

function WeaponShape({
  weapon,
  trim,
  accent,
  portrait = false,
}: {
  weapon: WeaponKind;
  trim: string;
  accent: string;
  portrait?: boolean;
}) {
  if (weapon === "axe") {
    return (
      <>
        <rect x={portrait ? 246 : 100} y={portrait ? 104 : 76} width={portrait ? 7 : 5} height={portrait ? 150 : 60} rx="3" fill="#5c3d2b" />
        <path
          d={portrait ? "M233 98h32c8 0 14 6 14 14v8c-18 0-30 6-46 18Z" : "M92 73h20c7 0 12 5 12 11v6c-12 0-21 4-32 12Z"}
          fill={accent}
        />
      </>
    );
  }

  if (weapon === "spear") {
    return (
      <>
        <rect x={portrait ? 248 : 103} y={portrait ? 88 : 68} width={portrait ? 6 : 4} height={portrait ? 170 : 72} rx="3" fill="#6c472e" />
        <path
          d={portrait ? "M251 72l12 28h-24Z" : "M105 58l8 18H97Z"}
          fill={trim}
        />
      </>
    );
  }

  const bladePath = weapon === "saber"
    ? portrait
      ? "M255 98c18 10 26 24 28 44-12-8-30-10-48-4 10-10 14-20 20-40Z"
      : "M106 73c12 6 18 15 19 28-8-5-20-6-32-2 7-6 9-12 13-26Z"
    : portrait
      ? "M252 86l14 68c-12-8-22-9-34-5l10-63Z"
      : "M105 63l10 44c-8-5-15-6-24-3l7-41Z";

  return (
    <>
      <rect x={portrait ? 246 : 101} y={portrait ? 108 : 76} width={portrait ? 7 : 5} height={portrait ? 110 : 50} rx="3" fill="#6c472e" />
      <path d={bladePath} fill={trim} />
      <rect x={portrait ? 240 : 95} y={portrait ? 106 : 74} width={portrait ? 18 : 12} height={portrait ? 6 : 4} rx="3" fill={accent} />
    </>
  );
}

function BattleFigureBase({
  palette,
  glow,
  state,
  direction,
  className,
  boss = false,
  showShield = false,
}: BattleSpriteProps & {
  palette: FigurePalette;
  glow: string;
  boss?: boolean;
  showShield?: boolean;
}) {
  const slashId = useId().replace(/:/g, "");
  const width = boss ? 104 : showShield ? 108 : 90;
  const height = boss ? 154 : showShield ? 160 : 140;
  const lift = state === "jump" ? -16 : state === "special" ? -6 : 0;
  const lean = state === "run" ? 6 : state === "attack" ? 10 : state === "special" ? 4 : state === "hit" ? -8 : 0;
  const backArm = state === "run" ? 24 : state === "attack" ? 18 : state === "jump" ? -22 : 6;
  const frontArm = state === "attack" ? -58 : state === "special" ? -78 : state === "jump" ? -38 : state === "run" ? -18 : -6;
  const backLeg = state === "run" ? -18 : state === "jump" ? 18 : state === "attack" ? 12 : 2;
  const frontLeg = state === "run" ? 20 : state === "jump" ? -16 : state === "attack" ? -12 : -2;
  const torsoY = boss ? 3 : 0;
  const sleeve = palette.sleeve ?? palette.cloak;
  const sleeveShadow = palette.sleeveShadow ?? palette.armorShadow;
  const tunic = palette.tunic ?? palette.armor;
  const tunicShadow = palette.tunicShadow ?? palette.armorShadow;
  const boots = palette.boots ?? "#85321d";
  const bootsShadow = palette.bootsShadow ?? "#551b0e";
  const shield = palette.shield ?? "#4d3428";
  const shieldShadow = palette.shieldShadow ?? "#261814";
  const shieldRim = palette.shieldRim ?? palette.trim;

  return (
    <div
      className={cn("relative", className)}
      style={{
        width,
        height,
        transform: `scaleX(${direction})`,
        transformOrigin: "center bottom",
      }}
    >
      <svg viewBox="0 0 140 180" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`armor-${slashId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={palette.armor} />
            <stop offset="100%" stopColor={palette.armorShadow} />
          </linearGradient>
          <linearGradient id={`tunic-${slashId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={tunic} />
            <stop offset="100%" stopColor={tunicShadow} />
          </linearGradient>
          <linearGradient id={`helmet-${slashId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={palette.helmet} />
            <stop offset="100%" stopColor={palette.helmetShadow} />
          </linearGradient>
          <linearGradient id={`shield-${slashId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={shield} />
            <stop offset="100%" stopColor={shieldShadow} />
          </linearGradient>
        </defs>

        <ellipse
          cx="70"
          cy="172"
          rx={boss ? 32 : showShield ? 31 : 28}
          ry={boss ? 9 : 8}
          fill="rgba(0,0,0,0.28)"
        />

        {state === "special" && (
          <circle cx="70" cy="86" r={boss ? 54 : 48} fill={`${glow}22`} />
        )}

        <g transform={`translate(0 ${lift}) rotate(${lean} 70 98)`}>
          {showShield && (
            <g opacity="0.98">
              <ellipse cx="103" cy="84" rx="22" ry="28" fill={`url(#shield-${slashId})`} />
              <ellipse cx="103" cy="84" rx="19" ry="24" fill={shield} opacity="0.92" />
              <ellipse
                cx="103"
                cy="84"
                rx="22"
                ry="28"
                fill="none"
                stroke={shieldRim}
                strokeWidth="3.5"
              />
              <circle cx="103" cy="84" r="5.5" fill={shieldRim} />
            </g>
          )}

          <path
            d="M36 72c-9 18-11 56-4 82 10-2 21-8 30-18-6-16-8-36-7-58 0-2 0-4 1-6Z"
            fill={palette.cloak}
            opacity="0.82"
          />
          <path
            d="M98 72c7 18 8 50 4 76-9-1-18-6-25-14 4-15 6-33 6-53 0-3 0-6-1-9Z"
            fill={palette.cloak}
            opacity="0.72"
          />

          <g transform={`rotate(${backLeg} 56 118)`}>
            <rect x="49" y="112" width="14" height="46" rx="7" fill="#4e3324" />
            <rect x="47" y="140" width="16" height="18" rx="7" fill={boots} />
            <rect x="45" y="154" width="21" height="16" rx="6" fill={bootsShadow} />
          </g>
          <g transform={`rotate(${frontLeg} 84 118)`}>
            <rect x="77" y="112" width="14" height="48" rx="7" fill="#4b3123" />
            <rect x="76" y="140" width="16" height="20" rx="7" fill={boots} />
            <rect x="74" y="156" width="21" height="15" rx="6" fill={bootsShadow} />
          </g>

          <path
            d={`M46 ${76 + torsoY}c5-13 16-22 24-22h1c9 0 20 9 25 22l6 42c-8 9-19 15-31 15-11 0-23-6-31-15Z`}
            fill={sleeve}
          />
          <path
            d={`M53 ${76 + torsoY}c5-11 12-17 18-17 8 0 14 6 18 17l4 35c-6 9-14 13-22 13-8 0-17-4-23-13Z`}
            fill={`url(#tunic-${slashId})`}
          />
          <ellipse cx="49" cy={76 + torsoY} rx="11" ry="10" fill={`url(#armor-${slashId})`} />
          <ellipse cx="91" cy={76 + torsoY} rx="11" ry="10" fill={`url(#armor-${slashId})`} />
          <path
            d={`M51 ${79 + torsoY}c6-8 12-12 19-12 8 0 14 4 20 12`}
            stroke={palette.trim}
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.72"
          />
          <path d={`M52 ${110 + torsoY}h37l-5 22H57Z`} fill={palette.fur} opacity="0.95" />
          <rect x="48" y={102 + torsoY} width="44" height="10" rx="5" fill={palette.sash} />
          <circle cx="70" cy={107 + torsoY} r="7" fill={palette.trim} />
          <circle cx="70" cy={107 + torsoY} r="3.2" fill={palette.sash} />
          <path
            d={`M45 ${74 + torsoY}c5-12 12-18 17-18h16c5 0 12 6 17 18l-7 8H52Z`}
            fill={palette.fur}
            opacity="0.92"
          />

          <g transform={`rotate(${backArm} 49 82)`}>
            <rect x="41" y="79" width="12" height="38" rx="6" fill={sleeveShadow} />
            <rect x="40" y="106" width="11" height="25" rx="5" fill={palette.skin} />
            <rect x="39" y="115" width="12" height="8" rx="4" fill={palette.fur} />
          </g>
          <g transform={`rotate(${frontArm} 92 82)`}>
            <rect x="88" y="79" width="12" height="38" rx="6" fill={sleeve} />
            <rect x="90" y="106" width="11" height="24" rx="5" fill={palette.skin} />
            <rect x="89" y="114" width="12" height="8" rx="4" fill={palette.fur} />
            <g opacity="0.95">
              <WeaponShape weapon={palette.weapon} trim={palette.trim} accent={palette.sash} />
            </g>
          </g>

          <rect x="63" y="44" width="14" height="8" rx="4" fill={palette.skinShadow} />
          <ellipse cx="70" cy="42" rx={palette.faceWidth} ry="22" fill={palette.skin} />
          <ellipse cx="70" cy="49" rx={palette.faceWidth - 2} ry="16" fill={palette.skinShadow} opacity="0.14" />
          <path d={`M54 38c6-7 12-10 17-10 8 0 14 3 18 10`} stroke={palette.brow} strokeWidth="3.4" strokeLinecap="round" />
          <path d={`M55 29c7-15 18-22 30-22 12 0 23 7 30 22l-3 11H54Z`} fill={`url(#helmet-${slashId})`} />
          <path d="M53 28c10-8 18-12 31-12 13 0 22 4 33 12" stroke={palette.trim} strokeWidth="2.2" strokeLinecap="round" opacity="0.7" />
          <path d="M69 2c9 6 13 14 13 24H58c0-10 4-18 11-24Z" fill={palette.helmet} />
          <path d="M69 0c6 4 9 10 9 18h-16c0-8 2-14 7-18Z" fill={palette.trim} opacity="0.92" />
          <path d="M70 -6c4 3 6 7 6 13-3 1-6 1-10 0 0-6 1-10 4-13Z" fill="#dce3e8" opacity="0.94" />
          <path d="M74 4c8 3 14 9 17 18-8-1-16-3-23-7Z" fill={palette.plume} opacity="0.9" />

          <path
            d={`M56 42c4 ${palette.browTilt} 9 ${palette.browTilt} 13 0M71 42c4 ${palette.browTilt} 9 ${palette.browTilt} 13 0`}
            stroke={palette.brow}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx={62 + palette.eyeShift} cy="47" r="2" fill="#1a0f0c" />
          <circle cx={78 + palette.eyeShift} cy="47" r="2" fill="#1a0f0c" />
          <path d="M69 48c-2 5-2 8 1 11" stroke={palette.skinShadow} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M60 58c3-2 6-3 10-3 4 0 7 1 10 3" stroke={palette.brow} strokeWidth="2.6" strokeLinecap="round" />
          <BeardShape beardStyle={palette.beardStyle} color={palette.beard} />
          <path d="M49 41c-2 4-2 9 1 13" stroke={palette.skinShadow} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M91 41c2 4 2 9-1 13" stroke={palette.skinShadow} strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {(state === "attack" || state === "special") && (
          <path
            d={state === "special" ? "M94 44c26 12 34 31 31 59" : "M96 56c18 9 24 22 22 42"}
            fill="none"
            stroke={glow}
            strokeWidth={state === "special" ? 7 : 5}
            strokeLinecap="round"
            opacity={state === "special" ? 0.95 : 0.72}
          />
        )}

        {state === "hit" && (
          <rect x="18" y="18" width="104" height="118" rx="42" fill="rgba(255,82,82,0.12)" />
        )}
      </svg>
    </div>
  );
}

export function BatyrPortrait({
  batyr,
  className,
}: {
  batyr: Batyr;
  className?: string;
}) {
  const palette = getBatyrFigurePalette(batyr.id);
  const portraitId = useId().replace(/:/g, "");

  return (
    <svg viewBox="0 0 320 360" className={cn("h-full w-full", className)} aria-label={batyr.name} role="img">
      <defs>
        <linearGradient id={`portrait-bg-${portraitId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={batyr.colors.sky} />
          <stop offset="65%" stopColor={batyr.colors.secondary} />
          <stop offset="100%" stopColor="#09111d" />
        </linearGradient>
        <linearGradient id={`portrait-armor-${portraitId}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={palette.armor} />
          <stop offset="100%" stopColor={palette.armorShadow} />
        </linearGradient>
        <linearGradient id={`portrait-helmet-${portraitId}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={palette.helmet} />
          <stop offset="100%" stopColor={palette.helmetShadow} />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="320" height="360" rx="32" fill={`url(#portrait-bg-${portraitId})`} />
      <circle cx="160" cy="94" r="84" fill={`${batyr.colors.glow}2f`} />
      <circle cx="160" cy="118" r="62" fill={`${batyr.colors.glow}20`} />

      <g opacity="0.9">
        <WeaponShape weapon={palette.weapon} trim={palette.trim} accent={palette.sash} portrait />
      </g>

      <g>
        <path d="M80 270c18-64 53-96 80-96s62 32 80 96l10 44H70Z" fill={palette.cloak} opacity="0.72" />
        <path d="M92 254c12-54 38-82 68-82s56 28 68 82l8 52H84Z" fill={`url(#portrait-armor-${portraitId})`} />
        <path d="M102 246c13-28 30-42 58-42 30 0 46 14 58 42" stroke={palette.trim} strokeWidth="7" strokeLinecap="round" opacity="0.7" />
        <rect x="116" y="278" width="88" height="18" rx="9" fill={palette.sash} />
        <circle cx="160" cy="287" r="10" fill={palette.trim} />
        <path d="M92 232c16-38 34-54 50-54h36c16 0 36 16 50 54l-12 14H104Z" fill={palette.fur} opacity="0.96" />

        <rect x="148" y="122" width="24" height="18" rx="9" fill={palette.skinShadow} />
        <ellipse cx="160" cy="116" rx={palette.faceWidth + 18} ry="42" fill={palette.skin} />
        <ellipse cx="160" cy="120" rx={palette.faceWidth + 14} ry="30" fill={palette.skinShadow} opacity="0.14" />
        <path d="M114 86c14-15 28-22 46-22 18 0 32 7 46 22" stroke={palette.brow} strokeWidth="6" strokeLinecap="round" />
        <path d="M112 74c16-28 32-40 48-40 18 0 34 12 48 40l-5 18H117Z" fill={`url(#portrait-helmet-${portraitId})`} />
        <path d="M110 72c18-14 31-20 50-20 20 0 34 6 52 20" stroke={palette.trim} strokeWidth="3.4" strokeLinecap="round" opacity="0.75" />
        <path d="M154 20c13 8 19 23 19 39h-32c0-16 5-31 13-39Z" fill={palette.helmet} />
        <path d="M169 22c19 7 32 20 37 37-18-2-31-7-44-16Z" fill={palette.plume} opacity="0.94" />
        <path
          d={`M128 112c10 ${palette.browTilt} 18 ${palette.browTilt} 28 0M164 112c10 ${palette.browTilt} 18 ${palette.browTilt} 28 0`}
          stroke={palette.brow}
          strokeWidth="4.4"
          strokeLinecap="round"
        />
        <circle cx={143 + palette.eyeShift} cy="122" r="4.2" fill="#1a0f0c" />
        <circle cx={177 + palette.eyeShift} cy="122" r="4.2" fill="#1a0f0c" />
        <path d="M159 126c-4 9-3 15 2 20" stroke={palette.skinShadow} strokeWidth="3" strokeLinecap="round" />
        <path d="M136 146c8-4 16-6 24-6 8 0 16 2 24 6" stroke={palette.brow} strokeWidth="4.6" strokeLinecap="round" />

        <g transform="translate(52 70) scale(1.55)">
          <BeardShape beardStyle={palette.beardStyle} color={palette.beard} />
        </g>
        <path d="M118 108c-4 7-4 14 2 20" stroke={palette.skinShadow} strokeWidth="3" strokeLinecap="round" />
        <path d="M202 108c4 7 4 14-2 20" stroke={palette.skinShadow} strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function HeroBattleSprite({
  batyr,
  state,
  direction,
  className,
}: {
  batyr: Batyr;
} & BattleSpriteProps) {
  return (
    <BattleFigureBase
      palette={getBatyrFigurePalette(batyr.id)}
      glow={batyr.colors.glow}
      state={state}
      direction={direction}
      className={className}
      showShield
    />
  );
}

export function EnemyBattleSprite({
  type,
  state,
  direction,
  className,
}: {
  type: LevelEnemy["type"];
} & BattleSpriteProps) {
  return (
    <BattleFigureBase
      palette={getEnemyPalette(type)}
      glow={type === "boss" ? "#ffb38a" : "#fb7185"}
      state={state}
      direction={direction}
      className={className}
      boss={type === "boss"}
    />
  );
}
