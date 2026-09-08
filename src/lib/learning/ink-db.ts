import type { InkNote, InkStroke } from "@/types/learning";

const DB_NAME = "study-ink-v1";
const STORE = "notes";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export function inkNoteId(destinationId: string, headlineId: string) {
  return `${destinationId}::${headlineId}`;
}

export async function loadInkNote(destinationId: string, headlineId: string): Promise<InkNote | null> {
  try {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(inkNoteId(destinationId, headlineId));
      req.onsuccess = () => resolve((req.result as InkNote | undefined) ?? null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

export async function saveInkNote(
  destinationId: string,
  headlineId: string,
  strokes: InkStroke[]
): Promise<void> {
  const db = await openDb();
  const note: InkNote = {
    id: inkNoteId(destinationId, headlineId),
    destinationId,
    headlineId,
    strokes,
    updatedAt: new Date().toISOString(),
  };
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(note);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function clearInkNote(destinationId: string, headlineId: string): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(inkNoteId(destinationId, headlineId));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
