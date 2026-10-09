"use client";

import { useEffect, useMemo, useState } from "react";
import { gearOutline, pitchRadius, toSvgPath } from "@/lib/watch/gear-profile";
import { rosette, segmentsToSvg } from "@/lib/watch/girih";
import { TRAIN } from "@/components/three/watch/movement-layout";

const S = 100;

/**
 * 2D skeleton watch for reduced motion / no WebGL: the same gear train and girih rosette
 * as the 3D movement, drawn as engraved line-art.
 */
export default function StaticWatch({ className }: { className?: string }) {
  const [time, setTime] = useState({ h: 10, m: 10 });
  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTime({ h: d.getHours() % 12, m: d.getMinutes() });
    };
    update();
    const id = window.setInterval(update, 30000);
    return () => window.clearInterval(id);
  }, []);

  const gears = useMemo(
    () =>
      TRAIN.flatMap((a) =>
        [a.wheel, a.pinion].filter(Boolean).map((part) => ({
          d: toSvgPath(gearOutline(part!.teeth, part!.module, part!.style), S),
          x: a.pos[0] * S,
          y: -a.pos[1] * S,
          r: pitchRadius(part!.teeth, part!.module) * S,
          rot: (a.phase * 180) / Math.PI,
        })),
      ),
    [],
  );
  const rose = useMemo(() => segmentsToSvg(rosette(0, 0, 70, 10)), []);
  const hourAngle = (time.h + time.m / 60) * 30;
  const minuteAngle = time.m * 6;

  return (
    <svg viewBox="-330 -330 660 660" className={className} role="img" aria-hidden="true">
      <defs>
        <radialGradient id="sw-case" cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#ecd197" />
          <stop offset="0.5" stopColor="#c8a15a" />
          <stop offset="1" stopColor="#6e5427" />
        </radialGradient>
        <radialGradient id="sw-dial" cx="50%" cy="40%" r="60%">
          <stop offset="0" stopColor="#15181d" />
          <stop offset="1" stopColor="#060708" />
        </radialGradient>
      </defs>
      <circle r="318" fill="url(#sw-case)" />
      <circle r="300" fill="#0b0c0f" />
      <circle r="262" fill="url(#sw-dial)" />
      <g stroke="#C8A15A" strokeOpacity="0.55" fill="#C8A15A" fillOpacity="0.06" strokeWidth="1.2">
        {gears.map((g, i) => (
          <path key={i} d={g.d} transform={`translate(${g.x} ${g.y}) rotate(${-g.rot})`} />
        ))}
      </g>
      <path
        d="M0-262A262 262 0 1 1 0 262A262 262 0 1 1 0-262ZM0-200A200 200 0 1 0 0 200A200 200 0 1 0 0-200Z"
        fill="#0b0d10"
        fillOpacity="0.92"
        fillRule="evenodd"
      />
      {Array.from({ length: 60 }, (_, i) => (
        <line
          key={i}
          y1={i % 5 === 0 ? -236 : -242}
          y2="-252"
          stroke={i % 5 === 0 ? "#C8A15A" : "#F4EFE6"}
          strokeOpacity={i % 5 === 0 ? 1 : 0.4}
          strokeWidth={i % 5 === 0 ? 3 : 1}
          transform={`rotate(${i * 6})`}
        />
      ))}
      {[
        ["12", 0, -216],
        ["3", 216, 0],
        ["9", -216, 0],
      ].map(([n, x, y]) => (
        <text key={n} x={x} y={Number(y) + 9} textAnchor="middle" className="font-display" fontSize="34" fontStyle="italic" fill="#F4EFE6">
          {n}
        </text>
      ))}
      <path d={rose} stroke="#C8A15A" strokeOpacity="0.5" strokeWidth="1" fill="none" />
      <circle r="78" fill="none" stroke="#22D3C5" strokeOpacity="0.7" strokeWidth="1" />
      <g transform="translate(0 172)">
        <circle r="70" fill="#07080a" stroke="#C8A15A" strokeWidth="3" />
        <circle r="44" fill="none" stroke="#d9dde1" strokeOpacity="0.6" />
        {[0, 120, 240].map((a) => (
          <line key={a} y2="-56" stroke="#d9dde1" strokeOpacity="0.6" strokeWidth="2" transform={`rotate(${a + 20})`} />
        ))}
      </g>
      <g strokeLinecap="round">
        <line y1="22" y2="-130" stroke="#dcb36b" strokeWidth="9" transform={`rotate(${hourAngle})`} />
        <line y1="26" y2="-200" stroke="#dcb36b" strokeWidth="6" transform={`rotate(${minuteAngle})`} />
        <line y1="-60" y2="-185" stroke="#22D3C5" strokeWidth="2.5" transform={`rotate(${minuteAngle})`} />
      </g>
      <circle r="9" fill="#dcb36b" />
    </svg>
  );
}
