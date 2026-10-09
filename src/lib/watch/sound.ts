"use client";

import { getUi, setUi } from "./store";

const STORAGE_KEY = "te:sound";
let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;

function context() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.04), ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 3;
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Synthesised escapement tick: a filtered noise transient plus a faint metallic ping. */
export function playTick(intensity = 1) {
  if (!getUi().soundOn) return;
  const audio = context();
  if (!audio || !noise) return;
  const t = audio.currentTime;

  const src = audio.createBufferSource();
  src.buffer = noise;
  const band = audio.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 3400;
  band.Q.value = 6;
  const gain = audio.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.32 * intensity, t + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
  src.connect(band).connect(gain).connect(audio.destination);
  src.start(t);

  const ping = audio.createOscillator();
  ping.type = "sine";
  ping.frequency.value = 2650;
  const pingGain = audio.createGain();
  pingGain.gain.setValueAtTime(0.0001, t);
  pingGain.gain.exponentialRampToValueAtTime(0.05 * intensity, t + 0.003);
  pingGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
  ping.connect(pingGain).connect(audio.destination);
  ping.start(t);
  ping.stop(t + 0.1);
}

export function restoreSoundPreference() {
  try {
    if (localStorage.getItem(STORAGE_KEY) === "on") setUi({ soundOn: true });
  } catch {
    /* storage unavailable */
  }
}

export function setSound(on: boolean) {
  setUi({ soundOn: on });
  try {
    localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {
    /* storage unavailable */
  }
  if (on) playTick(0.8);
}
