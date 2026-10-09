import { khatamStar, pointsToSvg } from "@/lib/watch/girih";

const TILE = 120;
const tilePath = [
  pointsToSvg(khatamStar(TILE / 2, TILE / 2, TILE * 0.3, Math.PI / 8)),
  ...[
    [0, 0],
    [TILE, 0],
    [0, TILE],
    [TILE, TILE],
  ].map(([x, y]) => pointsToSvg(khatamStar(x, y, TILE * 0.3, Math.PI / 8))),
  `M${TILE / 2} 0V${TILE * 0.2}M${TILE / 2} ${TILE * 0.8}V${TILE}M0 ${TILE / 2}H${TILE * 0.2}M${TILE * 0.8} ${TILE / 2}H${TILE}`,
].join("");

/** Faint girih line-art laid over the canvas — engraved texture, never wallpaper. */
export function GirihBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] opacity-[0.06] mix-blend-screen [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_75%)]"
    >
      <svg className="h-full w-full">
        <defs>
          <pattern id="te-girih" width={TILE} height={TILE} patternUnits="userSpaceOnUse">
            <path d={tilePath} fill="none" stroke="#C8A15A" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#te-girih)" />
      </svg>
    </div>
  );
}

export function Grain() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] overflow-hidden opacity-[0.07]">
      <div className="te-grain absolute -inset-[10%]" />
    </div>
  );
}
