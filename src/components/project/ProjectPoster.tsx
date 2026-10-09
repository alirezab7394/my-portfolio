import { khatamStar, pointsToSvg } from "@/lib/watch/girih";
import type { Project } from "@/types/portfolio";

const STAR = pointsToSvg(khatamStar(0, 0, 150, Math.PI / 8));
const INNER = pointsToSvg(khatamStar(0, 0, 92, 0));

/** Typographic stand-in used until a real screenshot is set on `Project.image`. */
export default function ProjectPoster({ project, title, category }: { project: Project; title: string; category: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-obsidian-2" style={{ "--accent": project.accent } as React.CSSProperties}>
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70"
        style={{
          background: `radial-gradient(120% 90% at 85% 10%, color-mix(in oklab, ${project.accent} 38%, transparent), transparent 60%), radial-gradient(90% 70% at 0% 100%, rgb(200 161 90 / 0.18), transparent 60%)`,
        }}
      />
      <svg aria-hidden="true" viewBox="-200 -200 400 400" className="absolute -bottom-1/4 -right-1/4 h-[130%] w-auto opacity-25 rtl:-left-1/4 rtl:right-auto">
        <path d={STAR} fill="none" stroke={project.accent} strokeWidth="1.2" />
        <path d={INNER} fill="none" stroke="#F4EFE6" strokeOpacity="0.5" strokeWidth="0.8" />
        <circle r="186" fill="none" stroke="#F4EFE6" strokeOpacity="0.2" strokeDasharray="1 6" />
      </svg>
      <div className="absolute inset-x-0 top-0 flex items-center gap-1.5 border-b border-ivory/10 bg-obsidian/50 px-4 py-2.5" aria-hidden="true">
        <span className="h-2 w-2 rounded-full bg-ivory/20" />
        <span className="h-2 w-2 rounded-full bg-ivory/20" />
        <span className="h-2 w-2 rounded-full bg-ivory/20" />
        <span dir="ltr" className="ms-3 truncate font-mono text-[10px] tracking-[0.12em] text-ivory/50">
          {project.domain}
        </span>
      </div>
      <div className="absolute inset-x-6 bottom-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: project.accent }}>
          {category}
        </p>
        <p className="mt-2 font-display text-5xl leading-none text-ivory">{title}</p>
      </div>
    </div>
  );
}
