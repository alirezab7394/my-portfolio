import Image from "next/image";
import type { Project } from "@/types/portfolio";
import ProjectPoster from "./ProjectPoster";

export default function ProjectMedia({
  project,
  title,
  category,
  sizes,
  playVideo = false,
  priority = false,
}: {
  project: Project;
  title: string;
  category: string;
  sizes: string;
  playVideo?: boolean;
  priority?: boolean;
}) {
  if (playVideo && project.video) {
    return (
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={project.video}
        poster={project.image}
        autoPlay
        muted
        loop
        playsInline
        aria-label={title}
      />
    );
  }
  if (project.image) {
    return <Image src={project.image} alt={title} fill sizes={sizes} priority={priority} className="object-cover object-top" />;
  }
  return <ProjectPoster project={project} title={title} category={category} />;
}
