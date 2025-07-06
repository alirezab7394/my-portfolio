import type { Metadata } from "next";
import { generateMetadata as generatePageMetadata } from "@/lib/metadata";

// Generate metadata for the root domain
export const metadata: Metadata = generatePageMetadata(undefined, undefined, undefined, "en");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
