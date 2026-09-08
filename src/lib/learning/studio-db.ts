import type { Prisma } from "@prisma/client";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";
import type { GeneratedLesson, HeadlineDepth, StudyHeadline } from "@/types/learning";

function isHeadlineDepth(value: string): value is HeadlineDepth {
  return value === "core" || value === "interview" || value === "lab";
}

export async function saveLessonToDb(lesson: GeneratedLesson): Promise<void> {
  if (!isDatabaseConfigured() || !prisma) return;
  try {
    const questions = lesson.questions as unknown as Prisma.InputJsonValue;
    const sources = lesson.sources as unknown as Prisma.InputJsonValue;
    await prisma.studyLesson.upsert({
      where: {
        destinationId_headlineId: {
          destinationId: lesson.destinationId,
          headlineId: lesson.headlineId,
        },
      },
      create: {
        destinationId: lesson.destinationId,
        headlineId: lesson.headlineId,
        title: lesson.title,
        markdown: lesson.markdown,
        questions,
        sources,
        generatedAt: new Date(lesson.generatedAt),
      },
      update: {
        title: lesson.title,
        markdown: lesson.markdown,
        questions,
        sources,
        generatedAt: new Date(lesson.generatedAt),
      },
    });
  } catch (error) {
    console.error("Could not save lesson:", error instanceof Error ? error.message : error);
  }
}

export async function loadLessonsFromDb(): Promise<GeneratedLesson[]> {
  if (!isDatabaseConfigured() || !prisma) return [];
  try {
    const rows = await prisma.studyLesson.findMany();
    return rows.map((row) => ({
      destinationId: row.destinationId,
      headlineId: row.headlineId,
      title: row.title,
      markdown: row.markdown,
      questions: (row.questions ?? []) as unknown as GeneratedLesson["questions"],
      sources: (row.sources ?? []) as unknown as GeneratedLesson["sources"],
      generatedAt: row.generatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Could not load lessons:", error instanceof Error ? error.message : error);
    return [];
  }
}

export async function replaceHeadlinesInDb(destinationId: string, headlines: StudyHeadline[]): Promise<void> {
  if (!isDatabaseConfigured() || !prisma) return;
  try {
    await prisma.$transaction([
      prisma.studyHeadlineRecord.deleteMany({ where: { destinationId } }),
      prisma.studyHeadlineRecord.createMany({
        data: headlines.map((headline, index) => ({
          destinationId,
          headlineId: headline.id,
          title: headline.title,
          why: headline.why,
          depth: headline.depth,
          sortOrder: index,
        })),
      }),
    ]);
  } catch (error) {
    console.error("Could not save headlines:", error instanceof Error ? error.message : error);
  }
}

export async function loadHeadlineMapFromDb(): Promise<Record<string, StudyHeadline[]>> {
  if (!isDatabaseConfigured() || !prisma) return {};
  try {
    const rows = await prisma.studyHeadlineRecord.findMany({
      orderBy: [{ destinationId: "asc" }, { sortOrder: "asc" }],
    });
    const map: Record<string, StudyHeadline[]> = {};
    for (const row of rows) {
      const headline: StudyHeadline = {
        id: row.headlineId,
        title: row.title,
        why: row.why,
        depth: isHeadlineDepth(row.depth) ? row.depth : "core",
      };
      (map[row.destinationId] ??= []).push(headline);
    }
    return map;
  } catch (error) {
    console.error("Could not load headlines:", error instanceof Error ? error.message : error);
    return {};
  }
}
