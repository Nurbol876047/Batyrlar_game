"use client";

import { useEffect, useRef } from "react";
import { Howl, Howler } from "howler";

import { useGameStore } from "@/store/game-store";

export type SoundKind = "tap" | "attack" | "special" | "correct" | "wrong" | "impact";

const soundMap: Record<SoundKind, { frequency: number; duration: number; type: OscillatorType }> =
  {
    tap: { frequency: 320, duration: 0.08, type: "triangle" },
    attack: { frequency: 210, duration: 0.12, type: "sawtooth" },
    special: { frequency: 480, duration: 0.2, type: "square" },
    correct: { frequency: 620, duration: 0.14, type: "triangle" },
    wrong: { frequency: 170, duration: 0.18, type: "sine" },
    impact: { frequency: 130, duration: 0.1, type: "square" },
  };

function getWaveSample(type: OscillatorType, phase: number) {
  switch (type) {
    case "square":
      return phase < 0.5 ? 1 : -1;
    case "sawtooth":
      return phase * 2 - 1;
    case "triangle":
      return 1 - Math.abs(phase * 4 - 2);
    default:
      return Math.sin(phase * Math.PI * 2);
  }
}

function writeAscii(view: DataView, offset: number, value: string) {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index));
  }
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }

  return window.btoa(binary);
}

function createToneDataUri({ frequency, duration, type }: (typeof soundMap)[SoundKind]) {
  const sampleRate = 22050;
  const sampleCount = Math.floor(sampleRate * duration);
  const bytes = new Uint8Array(44 + sampleCount * 2);
  const view = new DataView(bytes.buffer);

  writeAscii(view, 0, "RIFF");
  view.setUint32(4, 36 + sampleCount * 2, true);
  writeAscii(view, 8, "WAVE");
  writeAscii(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeAscii(view, 36, "data");
  view.setUint32(40, sampleCount * 2, true);

  for (let index = 0; index < sampleCount; index += 1) {
    const time = index / sampleRate;
    const phase = (time * frequency) % 1;
    const attack = Math.min(1, index / (sampleRate * 0.01));
    const release = Math.max(0, 1 - index / sampleCount);
    const envelope = attack * release * release;
    const sample = getWaveSample(type, phase) * envelope * 0.28;
    view.setInt16(44 + index * 2, Math.max(-1, Math.min(1, sample)) * 32767, true);
  }

  return `data:audio/wav;base64,${bytesToBase64(bytes)}`;
}

export function useAudioFeedback() {
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const soundsRef = useRef<Partial<Record<SoundKind, Howl>>>({});

  useEffect(() => {
    Howler.mute(!soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    return () => {
      Object.values(soundsRef.current).forEach((sound) => sound?.unload());
      soundsRef.current = {};
    };
  }, []);

  const play = (kind: SoundKind) => {
    if (!soundEnabled || typeof window === "undefined") {
      return;
    }

    if (!soundsRef.current[kind]) {
      soundsRef.current[kind] = new Howl({
        src: [createToneDataUri(soundMap[kind])],
        volume: kind === "special" ? 0.42 : 0.32,
        html5: false,
      });
    }

    soundsRef.current[kind]?.play();
  };

  return { play };
}
