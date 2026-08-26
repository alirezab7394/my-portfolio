import type { Metadata } from "next";
import { LearningApp } from "@/components/learning/LearningApp";

export const metadata: Metadata = {
  title: "Learning Tracker",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function LearningPage() {
  return <LearningApp />;
}
