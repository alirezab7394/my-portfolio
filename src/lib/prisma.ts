import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function isPostgresUrl(url: string | undefined): boolean {
  if (!url) return false;
  return (
    url.startsWith("postgresql://") ||
    url.startsWith("postgres://") ||
    url.startsWith("prisma+postgres://")
  );
}

/** Prefer LEARNING_DATABASE_URL so a non-Postgres DATABASE_URL elsewhere won't break the tracker. */
export function getLearningDatabaseUrl(): string | undefined {
  const learningUrl = process.env.LEARNING_DATABASE_URL;
  if (isPostgresUrl(learningUrl)) return learningUrl;
  const fallback = process.env.DATABASE_URL;
  if (isPostgresUrl(fallback)) return fallback;
  return undefined;
}

function createPrismaClient(): PrismaClient | null {
  const url = getLearningDatabaseUrl();
  if (!url) return null;
  return new PrismaClient({
    datasources: { db: { url } },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production" && prisma) {
  globalForPrisma.prisma = prisma;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(getLearningDatabaseUrl() && prisma);
}
